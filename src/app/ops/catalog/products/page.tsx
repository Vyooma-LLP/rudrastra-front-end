import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { products } from '@/db/schema';
import { desc } from 'drizzle-orm';

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Products Catalog</h1>
          <p className="text-xs text-[#777777]">Manage the canonical product catalog for the MVP.</p>
        </div>
        <Link 
          href="/ops/catalog/products/new"
          className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Price (INR)</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
            {allProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-sans">
                  No products found. Click "Add Product" to create one.
                </td>
              </tr>
            ) : (
              allProducts.map((p) => (
                <tr key={p.id}>
                  <td className="p-4 font-bold">{p.sku || '-'}</td>
                  <td className="p-4 font-sans">{p.title}</td>
                  <td className="p-4 font-sans">₹{(p.price / 100).toFixed(2)}</td>
                  <td className="p-4 font-sans">{p.stockQty}</td>
                  <td className="p-4 font-sans">
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/ops/catalog/products/${p.id}/edit`}
                      className="px-3 py-1 bg-white border border-gray-300 text-black hover:bg-gray-50 text-[11px] font-sans font-bold"
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
  );
}
