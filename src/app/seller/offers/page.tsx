import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { db } from '@/db';
import { sellerOffers, sellerSkus, products, productVariants } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSellerSession } from '@/lib/seller-session';

export default async function SellerOffersPage() {
  // Server-side identity resolution — never trust a client-supplied value
  const session = await getSellerSession();
  if (!session) redirect('/login');

  const { sellerId } = session;

  const offers = await db
    .select({
      offerId: sellerOffers.id,
      price: sellerOffers.price,
      moq: sellerOffers.moq,
      leadTimeDays: sellerOffers.leadTimeDays,
      skuCode: sellerSkus.skuCode,
      productTitle: products.title,
      productMpn: products.mpn,
      variantName: productVariants.name,
    })
    .from(sellerOffers)
    .leftJoin(sellerSkus, eq(sellerOffers.id, sellerSkus.offerId))
    .leftJoin(productVariants, eq(sellerOffers.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    // Tenant boundary enforced — only this seller's offers
    .where(eq(sellerOffers.sellerId, sellerId))
    .orderBy(desc(sellerOffers.createdAt));

  return (
    <CapabilityGuard featureKey="seller.offers">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Active Seller Offers & SKU Mapping</h1>
            <p className="text-xs text-[#777777]">Set unit prices, lead times, MOQs, and GST HSN codes for canonical product variants.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/seller/offers/new"
              className="px-4 py-2 bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Map New Offer SKU
            </Link>
          </div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Seller SKU Code</th>
                <th className="p-4">Canonical Variant</th>
                <th className="p-4">Unit Price (excl. GST)</th>
                <th className="p-4">Lead Time</th>
                <th className="p-4">MOQ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#777777] font-sans">
                    No offers mapped yet. Click &quot;Map New Offer SKU&quot;.
                  </td>
                </tr>
              ) : offers.map((offer, idx) => (
                <tr key={idx} data-testid="offer-row">
                  <td className="p-4 font-bold text-[#138808]" data-testid="offer-sku">{offer.skuCode || 'N/A'}</td>
                  <td className="p-4 font-sans font-semibold">
                    {offer.productTitle} {offer.variantName !== 'Standard' ? `- ${offer.variantName}` : ''} <br/>
                    <span className="text-[#777777] text-[10px] font-mono">{offer.productMpn}</span>
                  </td>
                  <td className="p-4 font-bold">₹{(offer.price / 100).toFixed(2)}</td>
                  <td className="p-4 font-sans">{offer.leadTimeDays} Days</td>
                  <td className="p-4">{offer.moq} Unit(s)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CapabilityGuard>
  );
}
