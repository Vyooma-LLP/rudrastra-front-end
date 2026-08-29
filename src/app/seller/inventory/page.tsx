import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { db } from '@/db';
import { inventoryItems, inventoryLocations, sellerSkus, sellerOffers, productVariants, products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSellerSession } from '@/lib/seller-session';

export default async function SellerInventoryPage() {
  // Server-side identity resolution — never trust a client-supplied value
  const session = await getSellerSession();
  if (!session) redirect('/login');

  const { sellerId } = session;

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

  return (
    <CapabilityGuard featureKey="seller.inventory">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Physical Inventory Stock Ledger</h1>
            <p className="text-xs text-[#777777]">Strict tracking of on-hand vs reserved stock (<code>sellable = on_hand - reserved</code>).</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/seller/inventory/new"
              className="px-4 py-2 bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Log Inventory
            </Link>
          </div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">SKU Code</th>
                <th className="p-4">Product / Variant</th>
                <th className="p-4">Warehouse Location</th>
                <th className="p-4">On-Hand Stock</th>
                <th className="p-4">Reserved Stock</th>
                <th className="p-4">Sellable Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#777777] font-sans">
                    No inventory logged. Click &quot;Log Inventory&quot; to add stock.
                  </td>
                </tr>
              ) : items.map((item, idx) => {
                const sellable = (item.onHandQuantity || 0) - (item.reservedQuantity || 0);
                return (
                  <tr key={idx} data-testid="inventory-row">
                    <td className="p-4 font-bold text-[#138808]" data-testid="inventory-sku">{item.skuCode}</td>
                    <td className="p-4 font-sans">
                      {item.productTitle}
                      {item.variantName && item.variantName !== 'Standard' && (
                        <span className="text-[#777777]"> — {item.variantName}</span>
                      )}
                    </td>
                    <td className="p-4 font-sans">{item.locationName}</td>
                    <td className="p-4">{item.onHandQuantity} Units</td>
                    <td className="p-4 text-[#F35C27]">{item.reservedQuantity} Units</td>
                    <td className="p-4 font-bold text-[#138808]">{sellable} Units</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </CapabilityGuard>
  );
}
