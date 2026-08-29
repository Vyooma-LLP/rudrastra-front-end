/**
 * /api/seller/inventory
 *
 * SECURITY: sellerId is NEVER read from the client request.
 * Derived exclusively from the authenticated session via requireSellerSession().
 *
 * Ownership invariant: before writing inventory for a skuId, we verify the SKU
 * belongs to the authenticated seller. A seller cannot log stock for another
 * seller's SKU by supplying a foreign skuId.
 *
 * GET  — returns only the authenticated seller's inventory
 * POST — logs/updates inventory, enforcing seller ownership of the target SKU
 */

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { inventoryItems, inventoryLocations, sellerSkus, sellerOffers, products, productVariants } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { requireSellerSession } from '@/lib/seller-session';

export async function GET() {
  try {
    const { sellerId } = await requireSellerSession();

    const items = await db
      .select({
        itemId: inventoryItems.id,
        onHandQuantity: inventoryItems.onHandQuantity,
        reservedQuantity: inventoryItems.reservedQuantity,
        skuCode: sellerSkus.skuCode,
        locationName: inventoryLocations.name,
        productTitle: products.title,
        variantName: productVariants.name,
      })
      .from(inventoryItems)
      .leftJoin(inventoryLocations, eq(inventoryItems.locationId, inventoryLocations.id))
      .leftJoin(sellerSkus, eq(inventoryItems.skuId, sellerSkus.id))
      .leftJoin(sellerOffers, eq(sellerSkus.offerId, sellerOffers.id))
      .leftJoin(productVariants, eq(sellerOffers.variantId, productVariants.id))
      .leftJoin(products, eq(productVariants.productId, products.id))
      // Tenant boundary enforced — only this seller's inventory
      .where(eq(inventoryItems.sellerId, sellerId))
      .orderBy(desc(inventoryItems.updatedAt));

    return NextResponse.json(items);
  } catch (err) {
    if (err instanceof NextResponse) return err;
    console.error('GET /api/seller/inventory failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { sellerId } = await requireSellerSession();

    const body = await req.json();
    // Strip any client-supplied sellerId — NEVER trusted
    const { skuId, locationId, onHandQuantity } = body;

    if (!skuId) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'skuId is required.' },
        { status: 400 }
      );
    }

    const parsedQuantity = parseInt(onHandQuantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return NextResponse.json(
        { error: 'INVALID_QUANTITY', message: 'onHandQuantity must be a non-negative integer.' },
        { status: 400 }
      );
    }

    // ── Ownership check ──────────────────────────────────────────────────────
    // Verify the target SKU belongs to THIS seller. A seller cannot log stock
    // for another seller's SKU by guessing or injecting a foreign skuId.
    const [ownedSku] = await db
      .select({ id: sellerSkus.id })
      .from(sellerSkus)
      .where(and(eq(sellerSkus.id, skuId), eq(sellerSkus.sellerId, sellerId)))
      .limit(1);

    if (!ownedSku) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'SKU does not belong to your seller account.' },
        { status: 403 }
      );
    }
    // ────────────────────────────────────────────────────────────────────────

    // Resolve or create a default warehouse location for this seller
    let targetLocationId = locationId;
    if (!targetLocationId) {
      const [existingLocation] = await db
        .select({ id: inventoryLocations.id })
        .from(inventoryLocations)
        .where(eq(inventoryLocations.sellerId, sellerId))
        .limit(1);

      if (existingLocation) {
        targetLocationId = existingLocation.id;
      } else {
        const [newLocation] = await db
          .insert(inventoryLocations)
          .values({
            sellerId,
            name: 'Main Warehouse',
            address: 'Default Address',
          })
          .returning();
        targetLocationId = newLocation.id;
      }
    } else {
      // If a locationId WAS supplied, verify it also belongs to this seller
      const [ownedLocation] = await db
        .select({ id: inventoryLocations.id })
        .from(inventoryLocations)
        .where(and(eq(inventoryLocations.id, targetLocationId), eq(inventoryLocations.sellerId, sellerId)))
        .limit(1);

      if (!ownedLocation) {
        return NextResponse.json(
          { error: 'FORBIDDEN', message: 'Location does not belong to your seller account.' },
          { status: 403 }
        );
      }
    }

    // Upsert inventory item — all IDs verified server-side
    const [item] = await db
      .insert(inventoryItems)
      .values({
        sellerId,
        locationId: targetLocationId,
        skuId,
        onHandQuantity: parsedQuantity,
        reservedQuantity: 0,
      })
      .onConflictDoUpdate({
        target: [inventoryItems.locationId, inventoryItems.skuId],
        set: {
          onHandQuantity: parsedQuantity,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({ success: true, item });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    console.error('POST /api/seller/inventory failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
