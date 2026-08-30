import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { products, manufacturers } from '@/db/schema';
import { desc, eq, asc } from 'drizzle-orm';
import { Plus } from 'lucide-react';
import { DeleteProductButton } from '@/components/catalog/DeleteProductButton';
import { ManufacturerFilter } from '@/components/catalog/ManufacturerFilter';
import { redirect } from 'next/navigation';

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ manufacturerId?: string }> }) {
  const params = await searchParams;
  const selectedManufacturerId = params.manufacturerId;

  const allManufacturers = await db.select().from(manufacturers).orderBy(asc(manufacturers.name));
  
  const filteredProducts = await db.query.products.findMany({
    where: selectedManufacturerId ? eq(products.manufacturerId, selectedManufacturerId) : undefined,
    orderBy: (products, { desc }) => [desc(products.createdAt)],
    with: {
      category: true,
      productVariants: true,
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Products Catalog</h1>
          <p className="text-xs text-[#777777]">Manage the canonical product catalog for the MVP.</p>
        </div>
        <Link 
          href="/ops/catalog/products/new"
          className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-gray-800 text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {/* Manufacturer Filter Dropdown */}
        <div className="w-full md:w-1/3">
          <ManufacturerFilter manufacturers={allManufacturers} selectedId={selectedManufacturerId} />
        </div>

        {/* Products Table */}
        <div className="flex-1 bg-white border border-[#E5E5E5] overflow-hidden text-xs shadow-sm">
          <div className="p-4 border-b border-[#E5E5E5] bg-[#F5F5F5] flex justify-between items-center">
            <h2 className="font-bold text-[#111111] text-sm">
              {selectedManufacturerId 
                ? `Products of ${allManufacturers.find(m => m.id === selectedManufacturerId)?.name}` 
                : 'All Products'}
            </h2>
            <span className="text-[#777777] text-xs font-mono">{filteredProducts.length} items</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">MPN</th>
                <th className="p-4">Product Family</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Variants</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#777777] font-sans text-sm">
                    No products found for this manufacturer.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors" data-testid="product-row">
                    <td className="p-4 font-bold" data-testid="product-mpn">{p.mpn || '-'}</td>
                    <td className="p-4 font-sans">{p.title}</td>
                    <td className="p-4 font-sans font-medium text-sm">{p.category?.name || 'Uncategorized'}</td>
                    <td className="p-4 font-sans text-center">{p.productVariants?.length || 0}</td>
                    <td className="p-4 font-sans">
                      <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider ${p.isActive ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-amber-100 text-amber-700'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-4">
                        <Link 
                          href={`/ops/catalog/products/${p.id}/edit`}
                          className="text-[#138808] hover:text-[#0f6c06] text-[10px] font-bold uppercase tracking-wider transition-colors"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={p.id} productName={p.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
