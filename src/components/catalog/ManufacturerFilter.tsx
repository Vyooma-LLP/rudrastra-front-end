"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ManufacturerFilter({ manufacturers, selectedId }: { manufacturers: any[], selectedId?: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="manufacturerId" className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
        Manufacturers
      </label>
      <select 
        id="manufacturerId"
        value={selectedId || ""}
        onChange={(e) => {
          if (e.target.value) {
            router.push(`/ops/catalog/products?manufacturerId=${e.target.value}`);
          } else {
            router.push(`/ops/catalog/products`);
          }
        }}
        className="px-3 py-2 text-sm border border-[#E5E5E5] bg-white focus:outline-none focus:ring-1 focus:ring-[#111111] w-full"
      >
        <option value="">All Manufacturers</option>
        {manufacturers.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
    </div>
  );
}
