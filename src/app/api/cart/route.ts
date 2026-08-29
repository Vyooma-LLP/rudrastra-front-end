import { createClient } from '@/utils/supabase/server';
import { db } from "@/db/index";
import { cartItems, productVariants, sellers, users, sellerOffers } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
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
        if (!isFeatureEnabled('storefrontCart')) {
            return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
        }

        const userId = await getUserId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const items = await db
            .select({
                id: cartItems.id,
                variantId: productVariants.id,
                offerId: cartItems.offerId,
                quantity: cartItems.quantity,
                title: productVariants.name,
                mpn: sql<string>`'N/A'`,
                price: sql<number>`COALESCE(${sellerOffers.price}, 0)`,
                stockQty: sql<number>`0`, // Temp fallback, actual stock requires inventory check
                sellerId: sql<string>`COALESCE(${sellerOffers.sellerId}::text, 'N/A')`,
                sellerName: sql<string>`COALESCE(${sellers.storeName}, 'N/A')`,
            })
            .from(cartItems)
            .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
            .leftJoin(sellerOffers, eq(cartItems.offerId, sellerOffers.id))
            .leftJoin(sellers, eq(sellerOffers.sellerId, sellers.id))
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
        if (!isFeatureEnabled('storefrontCart')) {
            return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
        }

        const userId = await getUserId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { action, payload } = body;

        if (action === "ADD") {
            let { variantId, offerId, quantity } = payload;
            
            if (!isValidQuantity(quantity)) {
                return NextResponse.json({ error: "INVALID_QUANTITY" }, { status: 400 });
            }
            
            if (!variantId || !offerId) {
                 return NextResponse.json({ error: "Variant ID and Offer ID are required" }, { status: 400 });
            }
            
            // Check if item already exists in cart for the same variant AND offer
            const [existing] = await db.select().from(cartItems).where(
                and(
                    eq(cartItems.userId, userId), 
                    eq(cartItems.variantId, variantId),
                    eq(cartItems.offerId, offerId)
                )
            );

            const requestedTotalQty = existing ? existing.quantity + quantity : quantity;
            // Temporarily skip stock check during migration

            if (existing) {
                await db.update(cartItems)
                    .set({ quantity: requestedTotalQty, updatedAt: new Date() })
                    .where(eq(cartItems.id, existing.id));
            } else {
                await db.insert(cartItems).values({
                    userId,
                    variantId,
                    offerId,
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
