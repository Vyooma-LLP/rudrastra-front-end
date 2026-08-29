import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { IndianRupee, PackageCheck, AlertCircle, Package, ArrowRight } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { db } from '@/db';
import { sellerOffers, sellerSkus, inventoryItems } from '@/db/schema';
import { eq, count, lt, sql } from 'drizzle-orm';
import { getSellerSession } from '@/lib/seller-session';

export default async function SellerDashboardPage() {
  // Server-side identity resolution — never trust a client-supplied value
  const session = await getSellerSession();
  if (!session) redirect('/login');

  const { sellerId, storeName } = session;

  // Real metrics from the DB — no fake data
  const [offerCount] = await db
    .select({ count: count() })
    .from(sellerOffers)
    .where(eq(sellerOffers.sellerId, sellerId));

  const [skuCount] = await db
    .select({ count: count() })
    .from(sellerSkus)
    .where(eq(sellerSkus.sellerId, sellerId));

  // Low stock: items where sellable quantity (on_hand - reserved) < 10
  const [lowStockCount] = await db
    .select({ count: count() })
    .from(inventoryItems)
    .where(
      sql`${inventoryItems.sellerId} = ${sellerId}
          AND (${inventoryItems.onHandQuantity} - ${inventoryItems.reservedQuantity}) < 10`
    );

  return (
    <CapabilityGuard featureKey="seller.onboarding">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Seller Merchant Dashboard</h1>
          <p className="text-xs text-[#777777]">{storeName}</p>
        </div>

        {/* Real metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
            <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
              <span>Active Offers</span>
              <IndianRupee className="w-4 h-4 text-[#138808]" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#111111]">{offerCount?.count ?? 0}</div>
            <div className="text-[11px] text-[#777777] font-semibold">Canonical variant listings</div>
          </div>

          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
            <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
              <span>Mapped SKUs</span>
              <PackageCheck className="w-4 h-4 text-[#F35C27]" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#111111]">{skuCount?.count ?? 0}</div>
            <div className="text-[11px] text-[#777777] font-semibold">Linked to your offers</div>
          </div>

          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
            <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
              <span>Low Stock SKUs</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#111111]">{lowStockCount?.count ?? 0}</div>
            <div className="text-[11px] text-rose-600 font-semibold">
              {(lowStockCount?.count ?? 0) > 0 ? 'Action required' : 'All SKUs healthy'}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="border-t border-[#E5E5E5] pt-6">
          <h2 className="text-xs font-bold text-[#777777] uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/seller/offers/new"
              className="flex items-center justify-between px-4 py-3 border border-[#E5E5E5] hover:border-[#111111] hover:bg-[#F5F5F5] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#F35C27]" />
                <div>
                  <p className="text-xs font-bold text-[#111111]">Map New Offer SKU</p>
                  <p className="text-[10px] text-[#777777]">Link your inventory to a canonical variant</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#111111] transition-colors" />
            </Link>

            <Link
              href="/seller/inventory/new"
              className="flex items-center justify-between px-4 py-3 border border-[#E5E5E5] hover:border-[#111111] hover:bg-[#F5F5F5] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <PackageCheck className="w-4 h-4 text-[#138808]" />
                <div>
                  <p className="text-xs font-bold text-[#111111]">Log Physical Stock</p>
                  <p className="text-[10px] text-[#777777]">Update on-hand quantities for your SKUs</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#111111] transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </CapabilityGuard>
  );
}
