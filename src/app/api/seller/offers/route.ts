/**
 * /api/seller/offers
 *
 * SECURITY: sellerId is NEVER read from the client request.
 * It is always derived from the authenticated session via requireSellerSession().
 *
 * GET  — returns only the authenticated seller's offers
 * POST — creates an offer bound to the authenticated seller
 */

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sellerOffers, sellerSkus, products, productVariants } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireSellerSession } from '@/lib/seller-session';

export async function GET() {
  try {
    const { sellerId } = await requireSellerSession();

    const offers = await db
      .select({
        offerId: sellerOffers.id,
        variantId: sellerOffers.variantId,
        price: sellerOffers.price,
        moq: sellerOffers.moq,
        leadTimeDays: sellerOffers.leadTimeDays,
        isActive: sellerOffers.isActive,
        skuId: sellerSkus.id,
        skuCode: sellerSkus.skuCode,
        productTitle: products.title,
        productMpn: products.mpn,
      })
      .from(sellerOffers)
      .leftJoin(sellerSkus, eq(sellerOffers.id, sellerSkus.offerId))
      .leftJoin(productVariants, eq(sellerOffers.variantId, productVariants.id))
      .leftJoin(products, eq(productVariants.productId, products.id))
      // Tenant boundary enforced — only this seller's offers
      .where(eq(sellerOffers.sellerId, sellerId))
      .orderBy(desc(sellerOffers.createdAt));

    return NextResponse.json(offers);
  } catch (err) {
    // If requireSellerSession threw a NextResponse, return it directly
    if (err instanceof NextResponse) return err;
    console.error('GET /api/seller/offers failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { sellerId } = await requireSellerSession();

    const body = await req.json();

    // Strip any client-supplied sellerId from the body — it is NEVER trusted
    const { variantId, price, moq, leadTimeDays, skuCode } = body;

    if (!variantId || !price || !skuCode) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'variantId, price, and skuCode are required.' },
        { status: 400 }
      );
    }

    // Validate price is a positive integer (stored in paise)
    const priceInt = parseInt(price, 10);
    if (isNaN(priceInt) || priceInt <= 0) {
      return NextResponse.json(
        { error: 'INVALID_PRICE', message: 'Price must be a positive integer (in paise).' },
        { status: 400 }
      );
    }

    // Upsert offer — sellerId comes from the verified session only
    const [offer] = await db
      .insert(sellerOffers)
      .values({
        sellerId,
        variantId,
        price: priceInt,
        moq: parseInt(moq, 10) || 1,
        leadTimeDays: parseInt(leadTimeDays, 10) || 0,
      })
      .onConflictDoUpdate({
        target: [sellerOffers.sellerId, sellerOffers.variantId],
        set: {
          price: priceInt,
          moq: parseInt(moq, 10) || 1,
          leadTimeDays: parseInt(leadTimeDays, 10) || 0,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Map SKU — sellerId enforced from session
    await db
      .insert(sellerSkus)
      .values({
        sellerId,
        offerId: offer.id,
        skuCode,
      })
      .onConflictDoUpdate({
        target: [sellerSkus.sellerId, sellerSkus.skuCode],
        set: { offerId: offer.id },
      });

    return NextResponse.json({ success: true, offer });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    console.error('POST /api/seller/offers failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
