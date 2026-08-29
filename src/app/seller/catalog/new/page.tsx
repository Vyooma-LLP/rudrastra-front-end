import React from 'react';
export const dynamic = 'force-dynamic';
import { db } from '@/db';
import { ProductFormEngine } from '@/components/catalog/ProductFormEngine';
import { createFullProduct } from '@/app/ops/catalog/products/actions';
import Link from 'next/link';

export default async function SellerNewProductPage() {
  const manufacturers = await db.query.manufacturers.findMany();
  const categories = await db.query.categories.findMany({
    with: { specDefinitions: true }
  });

  // Note: For MVP, Sellers can propose canonical products using the exact same flow as Ops.
  return (
    <div className="w-full min-h-screen bg-zinc-950 p-6 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/seller/catalog" className="text-zinc-400 hover:text-white text-sm font-semibold">
            ← Back to My Catalog
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Propose New Product</h1>
          <p className="text-zinc-400">Add a canonical manufacturer product to the global catalog.</p>
        </div>

        <ProductFormEngine 
          mode="create" 
          manufacturers={manufacturers} 
          categories={categories} 
          onSubmit={createFullProduct} 
        />
      </div>
    </div>
  );
}
