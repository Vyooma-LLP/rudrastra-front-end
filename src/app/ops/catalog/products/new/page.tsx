import React from 'react';
import { db } from '@/db';
import { ProductFormEngine } from '@/components/catalog/ProductFormEngine';
import { createFullProduct } from '@/app/ops/catalog/products/actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewProductPage() {
  const manufacturers = await db.query.manufacturers.findMany();
  const categories = await db.query.categories.findMany({
    with: {
      specDefinitions: true
    }
  });

  return (
    <div className="w-full min-h-screen bg-zinc-950 p-6 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/ops/catalog/products"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Create Product Family</h1>
            <p className="text-zinc-400">Add a canonical manufacturer product to the catalog.</p>
          </div>
        </div>

        <ProductFormEngine mode="create" manufacturers={manufacturers} categories={categories} onSubmit={createFullProduct} />
      </div>
    </div>
  );
}
