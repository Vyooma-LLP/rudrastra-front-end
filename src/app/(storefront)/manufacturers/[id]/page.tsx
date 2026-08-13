"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CapabilityGuard } from "@/components/layout/CapabilityGuard";
import { SupabaseGetManufacturerProductsAdapter } from "@/modules/catalog/frontend-contracts/SupabaseManufacturerAdapter";
import { ManufacturerProduct } from "@/modules/catalog/frontend-contracts/ManufacturerContract";

// In MVP, we might fetch from real DB instead of Mock
const getProductsQuery = new SupabaseGetManufacturerProductsAdapter();

export default function ManufacturerDetailPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "";
  const id = rawId ? rawId.toLowerCase() : "";
  
  const [products, setProducts] = useState<ManufacturerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const items = await getProductsQuery.execute({ manufacturerSlug: id });
      setProducts(items);
      setLoading(false);
    }
    if (id) {
      load();
    }
  }, [id]);

  const displayName = id
    ? id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Manufacturer";

  return (
    <CapabilityGuard featureKey="catalog.products">
      <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5] font-sans">
        {/* HERO */}
        <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-[12px] text-[var(--muted-foreground)] mb-4">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/manufacturers" className="hover:text-[var(--foreground)] transition-colors">Manufacturers</Link>
              <span>/</span>
              <span className="text-[var(--foreground)] font-semibold">{displayName}</span>
            </div>
            
            <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight text-[var(--foreground)] mb-4">
              {displayName}
            </h1>
            <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl">
              Authoritative catalog parts, dimensions, electrical attributes and inventory direct from {displayName}.
            </p>
          </div>
        </section>

        {/* PRODUCT LIST */}
        <section className="w-full px-6 lg:px-10 py-16 max-w-7xl mx-auto flex-1">
          <h2 className="font-heading font-bold text-[24px] mb-8">Canonical Products</h2>

          {loading ? (
            <div className="w-full h-64 border border-[var(--border)] bg-white flex items-center justify-center">
              <div className="text-[var(--muted-foreground)] text-[14px] font-mono animate-pulse">Querying engineering catalog...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="w-full h-64 border border-[var(--border)] bg-white flex flex-col items-center justify-center p-8 text-center">
              <span className="text-red-500 font-bold text-lg mb-2">No Verified Products Found</span>
              <p className="text-[var(--muted-foreground)] text-[14px] max-w-md">
                No active products matched this manufacturer. The manufacturer details may still be under review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="bg-white border border-[var(--border)] p-6 hover:border-[var(--foreground)] transition-all duration-fast flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square bg-[#FBFBFB] border border-[var(--border)] flex items-center justify-center p-4 mb-6">
                      <Image
                        src={p.img}
                        alt={p.name}
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block mb-1">
                      {p.category}
                    </span>
                    <h3 className="font-heading font-bold text-[18px] text-[var(--foreground)] mb-2 hover:text-[var(--primary)] transition-colors">
                      {p.name}
                    </h3>
                    <span className="font-mono text-[12px] text-[var(--muted-foreground)] block mb-4">
                      MPN: {p.mpn}
                    </span>
                  </div>
                  <div className="border-t border-[var(--border)] pt-4 flex justify-between items-center mt-4">
                    <span className="font-sans font-bold text-[16px] text-[var(--foreground)]">
                      {p.price}
                    </span>
                    <span className="text-[12px] text-[var(--primary)] font-bold flex items-center gap-1">
                      View details
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </CapabilityGuard>
  );
}
