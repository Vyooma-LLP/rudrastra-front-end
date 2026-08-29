import React from 'react';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ProductFormEngine } from '@/components/catalog/ProductFormEngine';
import { updateFullProduct } from '@/app/ops/catalog/products/actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const manufacturers = await db.query.manufacturers.findMany();
  const categories = await db.query.categories.findMany({
    with: { specDefinitions: true }
  });

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      productMedia: true,
      productVariants: {
        with: {
          specValues: true
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Map data to engine format
  const initialData = {
    id: product.id,
    manufacturerId: product.manufacturerId || "",
    categoryId: product.categoryId,
    title: product.title,
    mpn: product.mpn || "",
    description: product.description || "",
    media: product.productMedia.sort((a, b) => a.sortOrder - b.sortOrder),
    variants: product.productVariants.map(v => ({
      id: v.id,
      name: v.name,
      sku: v.canonicalSku || "",
      specs: v.specValues
    }))
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 p-6 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/seller/catalog" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Edit Product Proposition</h1>
            <p className="text-zinc-400">Modify your canonical catalog proposal.</p>
          </div>
        </div>

        <ProductFormEngine 
          mode="edit" 
          manufacturers={manufacturers} 
          categories={categories} 
          initialData={initialData} 
          onSubmit={updateFullProduct} 
        />
      </div>
    </div>
  );
}
