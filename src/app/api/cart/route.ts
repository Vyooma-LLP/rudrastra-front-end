import { createClient } from "../../../../utils/supabase/server";
import { db } from "@/db/index";
import { cartItems, products, sellers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isFeatureEnabled } from "@/lib/features";

// Middleware to get current user ID
async function getUserId() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    return userRecord?.id || null;
}

function isValidQuantity(q: any): boolean {
    if (typeof q !== 'number') return false;
    if (!Number.isInteger(q)) return false;
    if (q <= 0) return false;
    if (q > 10000) return false;
    return true;
}

export async function GET(request: Request) {
    try {
        if (!await isFeatureEnabled('commerce.cart')) {
            return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
        }

        const userId = await getUserId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const items = await db
            .select({
                id: cartItems.id,
                productId: products.id,
                quantity: cartItems.quantity,
                title: products.title,
                mpn: products.mpn,
                price: products.price,
                stockQty: products.stockQty,
                sellerId: sellers.id,
                sellerName: sellers.storeName,
            })
            .from(cartItems)
            .innerJoin(products, eq(cartItems.productId, products.id))
            .innerJoin(sellers, eq(products.sellerId, sellers.id))
            .where(eq(cartItems.userId, userId));

        // Server-side authoritative calculation
        let subtotal = 0;
        for (const item of items) {
            subtotal += (item.price || 0) * item.quantity;
        }

        // Integer arithmetic for GST 18%
        const tax = Math.floor((subtotal * 18 + 50) / 100);
        const total = subtotal + tax;

        return NextResponse.json({ items, summary: { subtotal, tax, total } }, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!await isFeatureEnabled('commerce.cart')) {
            return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
        }

        const userId = await getUserId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { action, payload } = body;

        if (action === "ADD") {
            let { mpn, sellerId, productId, quantity } = payload;
            
            if (!isValidQuantity(quantity)) {
                return NextResponse.json({ error: "INVALID_QUANTITY" }, { status: 400 });
            }
            
            let productRecord = null;
            if (!productId && mpn && sellerId) {
                 const [product] = await db.select().from(products).where(
                     and(eq(products.mpn, mpn), eq(products.sellerId, sellerId))
                 );
                 if (product) {
                     productId = product.id;
                     productRecord = product;
                 } else {
                     return NextResponse.json({ error: "Product not found" }, { status: 404 });
                 }
            } else if (productId) {
                 const [product] = await db.select().from(products).where(eq(products.id, productId));
                 if (product) {
                     productRecord = product;
                 }
            }

            if (!productId) {
                 return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
            }
            
            if (!productRecord) {
                 return NextResponse.json({ error: "Product not found" }, { status: 404 });
            }
            
            // Check if item already exists in cart
            const [existing] = await db.select().from(cartItems).where(
                and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
            );

            const requestedTotalQty = existing ? existing.quantity + quantity : quantity;
            if (requestedTotalQty > productRecord.stockQty) {
                return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
            }

            if (existing) {
                await db.update(cartItems)
                    .set({ quantity: requestedTotalQty, updatedAt: new Date() })
                    .where(eq(cartItems.id, existing.id));
            } else {
                await db.insert(cartItems).values({
                    userId,
                    productId,
                    quantity,
                });
            }
        } else if (action === "UPDATE") {
            const { itemId, quantity } = payload;

            if (!isValidQuantity(quantity)) {
                return NextResponse.json({ error: "INVALID_QUANTITY" }, { status: 400 });
            }

            const [existing] = await db.select().from(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)));
            if (!existing) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });

            const [product] = await db.select().from(products).where(eq(products.id, existing.productId));
            if (product && quantity > product.stockQty) {
                return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
            }

            await db.update(cartItems)
                .set({ quantity, updatedAt: new Date() })
                .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)));
        } else if (action === "REMOVE") {
            const { itemId } = payload;
            await db.delete(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)));
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        // Return updated items
        return GET(request);
    } catch (err: unknown) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
