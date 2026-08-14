import { createClient } from '@/utils/supabase/server';
import { db } from "@/db/index";
import { cartItems, products, users, quoteRequests, quoteRequestItems, idempotencyKeys } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isFeatureEnabled } from "@/lib/features";
import crypto from "crypto";

async function getUserId(request: Request) {
    const supabase = await createClient();
    
    let user;
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data } = await supabase.auth.getUser(token);
        user = data.user;
    } else {
        const { data } = await supabase.auth.getUser();
        user = data.user;
    }

    if (!user) return null;
    
    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    return userRecord?.id || null;
}

export async function POST(request: Request) {
    try {
        if (!await isFeatureEnabled('commerce.checkout')) {
            return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
        }

        const userId = await getUserId(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { idempotencyKey, customerInfo, shippingAddress } = body;

        if (!idempotencyKey) {
            return NextResponse.json({ error: "Idempotency key is required" }, { status: 400 });
        }

        const requestHash = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');

        // 1. Check existing Idempotency Key outside transaction
        const [existingKey] = await db.select().from(idempotencyKeys).where(
            and(eq(idempotencyKeys.userId, userId), eq(idempotencyKeys.idempotencyKey, idempotencyKey))
        );

        if (existingKey) {
            if (existingKey.requestHash !== requestHash) {
                return NextResponse.json({ error: "IDEMPOTENCY_CONFLICT: payload differs" }, { status: 409 });
            }
            if (existingKey.status === "COMPLETED") {
                return NextResponse.json(JSON.parse(existingKey.response || "{}"), { status: 200 });
            } else if (existingKey.status === "FAILED") {
                return NextResponse.json(JSON.parse(existingKey.response || "{}"), { status: 400 });
            }
        }

        try {
            const cart = await db
                .select({
                    id: cartItems.id,
                    productId: products.id,
                    quantity: cartItems.quantity,
                    price: products.price,
                    title: products.title,
                })
                .from(cartItems)
                .innerJoin(products, eq(cartItems.productId, products.id))
                .where(eq(cartItems.userId, userId));

            if (cart.length === 0) {
                return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
            }

            let estimatedSubtotal = 0;
            for (const item of cart) {
                estimatedSubtotal += (item.price || 0) * item.quantity;
            }

            if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
                throw new Error("Missing required customer fields");
            }
            if (!shippingAddress || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
                throw new Error("Missing required shipping address fields");
            }

            const quoteNumber = `QR-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

            // 3. Execute Unified Transaction
            const result = await db.transaction(async (tx) => {
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24);
                
                await tx.insert(idempotencyKeys).values({
                    userId,
                    operation: 'quote_request',
                    idempotencyKey,
                    requestHash,
                    status: 'COMPLETED',
                    expiresAt,
                    response: JSON.stringify({ pending: true })
                });

                // NO inventory deduction for Quote Requests

                // c. Create Quote Request
                const [quoteReq] = await tx.insert(quoteRequests).values({
                    quoteNumber,
                    userId,
                    status: 'NEW',
                    customerName: customerInfo.name,
                    email: customerInfo.email,
                    phone: customerInfo.phone,
                    companyName: customerInfo.companyName || null,
                    shippingAddressLine1: shippingAddress.line1,
                    shippingAddressLine2: shippingAddress.line2 || null,
                    shippingCity: shippingAddress.city,
                    shippingState: shippingAddress.state,
                    shippingPincode: shippingAddress.pincode,
                    notes: customerInfo.notes || null,
                    estimatedSubtotal
                }).returning({ id: quoteRequests.id, quoteNumber: quoteRequests.quoteNumber });

                // d. Create Quote Request Items
                await tx.insert(quoteRequestItems).values(
                    cart.map(item => ({
                        quoteRequestId: quoteReq.id,
                        productId: item.productId,
                        productNameSnapshot: item.title,
                        priceSnapshot: item.price || 0,
                        quantity: item.quantity
                    }))
                );

                // e. Clear Cart
                await tx.delete(cartItems).where(eq(cartItems.userId, userId));

                const finalResponse = { success: true, quoteId: quoteReq.id, quoteNumber: quoteReq.quoteNumber, status: 'NEW' };
                
                await tx.update(idempotencyKeys)
                    .set({ response: JSON.stringify(finalResponse) })
                    .where(and(eq(idempotencyKeys.userId, userId), eq(idempotencyKeys.idempotencyKey, idempotencyKey)));

                return finalResponse;
            });

            return NextResponse.json(result, { status: 200 });

        } catch (error: unknown) {
            if ((error as any).code === '23505' || (error as Error).message.includes('unique constraint')) {
                return NextResponse.json({ error: "Request is already processing or completed" }, { status: 409 });
            }

            try {
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24);
                await db.insert(idempotencyKeys).values({
                    userId,
                    operation: 'quote_request',
                    idempotencyKey,
                    requestHash,
                    status: 'FAILED',
                    expiresAt,
                    response: JSON.stringify({ error: (error as Error).message })
                }).onConflictDoNothing();
            } catch(e) {}
            
            return NextResponse.json({ error: (error as Error).message }, { status: 400 });
        }
    } catch (err: unknown) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const userId = await getUserId(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const history = await db.select().from(quoteRequests).where(eq(quoteRequests.userId, userId)).orderBy(quoteRequests.createdAt);
        return NextResponse.json({ quotes: history }, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
