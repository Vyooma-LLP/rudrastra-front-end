import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productVariants, sellerOffers, sellers, inventoryItems, sellerSkus, productSpecValues, specDefinitions } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { isFeatureEnabled } from "@/lib/features";

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isFeatureEnabled('storefrontSell')) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
    }

    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "BAD_REQUEST", message: "Invalid product ID format" }, { status: 400 });
    }

    // 1. Fetch the canonical product
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        productMedia: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: "NOT_FOUND", message: "Product not found" }, { status: 404 });
    }
    
    // Sort media
    product.productMedia.sort((a: any, b: any) => a.sortOrder - b.sortOrder);

    // 2. Fetch variants for this product
    const variantsList = await db.select().from(productVariants).where(eq(productVariants.productId, id));

    // 3. For each variant, fetch specs and active seller offers
    const variants = await Promise.all(variantsList.map(async (variant) => {
        // Specs
        const specs = await db
            .select({
                name: specDefinitions.name,
                value: productSpecValues.valueString,
                unit: specDefinitions.unit
            })
            .from(productSpecValues)
            .innerJoin(specDefinitions, eq(productSpecValues.specId, specDefinitions.id))
            .where(eq(productSpecValues.variantId, variant.id));

        // Offers + Inventory
        const offers = await db
            .select({
                id: sellerOffers.id,
                sellerId: sellerOffers.sellerId,
                sellerName: sellers.storeName,
                price: sellerOffers.price,
                moq: sellerOffers.moq,
                isActive: sellerOffers.isActive,
            })
            .from(sellerOffers)
            .innerJoin(sellers, eq(sellerOffers.sellerId, sellers.id))
            .where(
                and(
                    eq(sellerOffers.variantId, variant.id),
                    eq(sellerOffers.isActive, true)
                )
            );

        // Fetch inventory for these offers
        const offersWithStock = await Promise.all(offers.map(async (offer) => {
            // Find the sku for this offer
            const [sku] = await db.select().from(sellerSkus).where(
                eq(sellerSkus.offerId, offer.id)
            );

            let stockAvailable = 0;
            if (sku) {
                // Sum up sellable inventory across all locations
                const stockRecords = await db.select({
                    onHand: inventoryItems.onHandQuantity,
                    reserved: inventoryItems.reservedQuantity
                }).from(inventoryItems).where(eq(inventoryItems.skuId, sku.id));

                stockAvailable = stockRecords.reduce((acc, curr) => acc + (curr.onHand - curr.reserved), 0);
            }

            return {
                ...offer,
                stockAvailable
            };
        }));

        return {
            ...variant,
            specs,
            offers: offersWithStock
        };
    }));

    return NextResponse.json({ 
        product: {
            ...product,
            variants
        } 
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: "An unexpected error occurred" }, { status: 500 });
  }
}
