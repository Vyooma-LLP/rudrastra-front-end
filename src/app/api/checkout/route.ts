import { createClient } from '@/utils/supabase/server';
import { db } from "@/db/index";
import { cartItems, products, sellers, users, orders, orderItems, idempotencyKeys } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isFeatureEnabled } from "@/lib/features";
import crypto from "crypto";

async function getUserId() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    return userRecord?.id || null;
}

export async function POST(request: Request) {
    try {
        if (!await isFeatureEnabled('commerce.checkout')) {
            return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
        }

        const userId = await getUserId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { idempotencyKey, shippingAddress } = body;

        if (!idempotencyKey) {
            return NextResponse.json({ error: "Idempotency key is required" }, { status: 400 });
        }

        // Generate hash of the request to detect payload mutation on retry
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
                // Return previous failure
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
                    sku: products.sku,
                })
                .from(cartItems)
                .innerJoin(products, eq(cartItems.productId, products.id))
                .where(eq(cartItems.userId, userId));

            if (cart.length === 0) {
                return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
            }

            let subtotal = 0;
            for (const item of cart) {
                subtotal += (item.price || 0) * item.quantity;
            }
            
            // Integer arithmetic for GST 18%
            const tax = Math.floor((subtotal * 18 + 50) / 100);
            const total = subtotal + tax;

            // 3. Execute Unified Transaction
            const result = await db.transaction(async (tx) => {
                
                // a. Insert Idempotency Key (throws constraint violation if concurrent request won the race)
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24);
                
                await tx.insert(idempotencyKeys).values({
                    userId,
                    operation: 'checkout',
                    idempotencyKey,
                    requestHash,
                    status: 'COMPLETED',
                    expiresAt,
                    response: JSON.stringify({ pending: true }) // placeholder, updated later
                });

                // b. Atomic Inventory Deduction
                for (const item of cart) {
                    const updateResult = await tx.update(products)
                        .set({ stockQty: sql`${products.stockQty} - ${item.quantity}` })
                        .where(and(
                            eq(products.id, item.productId),
                            sql`${products.stockQty} >= ${item.quantity}`
                        ))
                        .returning({ id: products.id });
                    
                    if (updateResult.length === 0) {
                        throw new Error(`Insufficient stock for product ${item.productId}`);
                    }
                }

                // Validate shipping address
                if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
                    throw new Error("Missing required shipping address fields");
                }

                // c. Create Order
                const [order] = await tx.insert(orders).values({
                    userId,
                    status: 'PENDING',
                    subtotal,
                    tax,
                    total,
                    shippingName: shippingAddress.name,
                    shippingPhone: shippingAddress.phone,
                    shippingAddressLine1: shippingAddress.line1,
                    shippingAddressLine2: shippingAddress.line2 || null,
                    shippingCity: shippingAddress.city,
                    shippingState: shippingAddress.state,
                    shippingPincode: shippingAddress.pincode
                }).returning({ id: orders.id });

                // d. Create Order Items
                await tx.insert(orderItems).values(
                    cart.map(item => ({
                        orderId: order.id,
                        productId: item.productId,
                        productNameSnapshot: item.title,
                        skuSnapshot: item.sku,
                        quantity: item.quantity,
                        unitPrice: item.price || 0,
                        lineTotal: (item.price || 0) * item.quantity
                    }))
                );

                // e. Clear Cart
                await tx.delete(cartItems).where(eq(cartItems.userId, userId));

                const finalResponse = { success: true, orderId: order.id, total, status: 'PENDING' };
                
                // f. Update Idempotency Key with final response
                await tx.update(idempotencyKeys)
                    .set({ response: JSON.stringify(finalResponse) })
                    .where(and(eq(idempotencyKeys.userId, userId), eq(idempotencyKeys.idempotencyKey, idempotencyKey)));

                return finalResponse;
            });

            return NextResponse.json(result, { status: 200 });

        } catch (error: unknown) {
            // If the transaction threw due to idempotency conflict, we handle it
            if ((error as any).code === '23505' || (error as Error).message.includes('unique constraint')) {
                return NextResponse.json({ error: "Request is already processing or completed" }, { status: 409 });
            }

            // For business errors (e.g., Insufficient stock), we must manually save the FAILED key
            // since the main transaction rolled back.
            try {
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24);
                await db.insert(idempotencyKeys).values({
                    userId,
                    operation: 'checkout',
                    idempotencyKey,
                    requestHash,
                    status: 'FAILED',
                    expiresAt,
                    response: JSON.stringify({ error: (error as Error).message })
                }).onConflictDoNothing();
            } catch(e) {
                // Ignore conflict here
            }
            
            return NextResponse.json({ error: (error as Error).message }, { status: 400 });
        }
    } catch (err: unknown) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
