import React from 'react';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { db } from '@/db';
import { products } from '@/db/schema';
import { desc, isNotNull } from 'drizzle-orm';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Plus, CheckCircle, AlertTriangle, FileBox } from 'lucide-react';

export default async function CatalogSubmissionsPage() {
  // In a real app, this would filter by the logged-in seller's ID
  // For MVP, we'll fetch products that have ANY sellerId assigned,
  // or just show a subset to simulate "My Products"
  const sellerProducts = await db.select().from(products).orderBy(desc(products.createdAt));

  return (
    <CapabilityGuard featureKey="seller.catalog-submissions">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Catalog & Pricing</h1>
            <p className="text-xs text-[#777777] mt-1">Submit new products, map variants, and manage your bulk pricing tiers.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/seller/catalog/new"
              className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#138808] text-white hover:bg-[#0f6c06] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Submission
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Product Details</th>
                <th className="px-5 py-4 whitespace-nowrap">SKU</th>
                <th className="px-5 py-4 whitespace-nowrap">Base Price (INR)</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {sellerProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-sans">
                    No products found. Click "New Submission" to create one.
                  </td>
                </tr>
              ) : (
                sellerProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-4 font-medium">{p.title}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[#777777]">{p.mpn || '-'}</td>
                    <td className="px-5 py-4 font-mono text-sm font-bold">-</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                        ${p.isActive ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-amber-100 text-amber-700'}`}>
                        {p.isActive && <CheckCircle className="w-3 h-3" />}
                        {!p.isActive && <AlertTriangle className="w-3 h-3" />}
                        {p.isActive ? 'ACTIVE' : 'IN REVIEW'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link 
                        href={`/seller/catalog/${p.id}/edit`}
                        className="text-[#138808] hover:text-[#0f6c06] text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CapabilityGuard>
  );
}
