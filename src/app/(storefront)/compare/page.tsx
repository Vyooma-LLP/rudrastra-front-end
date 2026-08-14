"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * P0: Compare Components
 * Engineering comparison of specifications.
 * Supports dynamic add/remove of columns from a product catalog pool.
 */

type CompareComponent = {
  id: string;
  mfg: string;
  mpn: string;
  img: string;
  price: string;
  kv: string;
  voltage: string;
  weight: string;
  current: string;
  thrust: string;
};

const CATALOG_POOL: CompareComponent[] = [
  { id: "RUD-MOT-MN4014", mfg: "T-Motor", mpn: "MN4014", img: "/images/products/rudrastra_motor_1785921295587.png", price: "₹12,450", kv: "400", voltage: "6S-12S", weight: "168g", current: "30A", thrust: "8.2kg" },
  { id: "RUD-MOT-MN3510", mfg: "T-Motor", mpn: "MN3510", img: "/images/products/rudrastra_motor_1785921295587.png", price: "₹8,900", kv: "360", voltage: "6S-8S", weight: "140g", current: "22A", thrust: "4.5kg" },
  { id: "RUD-MOT-MN4010", mfg: "T-Motor", mpn: "MN4010", img: "/images/products/rudrastra_motor_1785921295587.png", price: "₹10,200", kv: "420", voltage: "6S-12S", weight: "155g", current: "28A", thrust: "6.8kg" },
  { id: "RUD-MOT-U8-II", mfg: "T-Motor", mpn: "U8 II", img: "/images/products/rudrastra_motor_1785921295587.png", price: "₹18,700", kv: "85", voltage: "12S-24S", weight: "256g", current: "50A", thrust: "14.0kg" },
  { id: "RUD-MOT-AT2312", mfg: "T-Motor", mpn: "AT2312", img: "/images/products/rudrastra_motor_1785921295587.png", price: "₹3,200", kv: "960", voltage: "3S-4S", weight: "56g", current: "12A", thrust: "0.8kg" },
];

const SPEC_ROWS = [
  { label: "KV Rating", key: "kv" },
  { label: "Operating Voltage", key: "voltage" },
  { label: "Weight", key: "weight" },
  { label: "Max Current", key: "current" },
  { label: "Max Thrust", key: "thrust" },
] as const;

const MAX_COMPARE = 4;

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CompareTool() {
  const searchParams = useSearchParams();
  const addParam = searchParams.get('add');

  const [selected, setSelected] = useState<CompareComponent[]>([
    CATALOG_POOL[0],
    CATALOG_POOL[1],
    CATALOG_POOL[2],
  ]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (addParam) {
      const p = CATALOG_POOL.find(c => c.id === addParam);
      if (p && !selected.find(s => s.id === p.id)) {
        // If it's not already in there, replace the first one with the new one
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelected(prev => [p, ...prev.slice(0, 2)]);
      }
    }
  }, [addParam]);

  const remove = (id: string) => setSelected((prev) => prev.filter((c) => c.id !== id));

  const add = (component: CompareComponent) => {
    if (selected.length >= MAX_COMPARE) return;
    if (selected.find((c) => c.id === component.id)) return;
    setSelected((prev) => [...prev, component]);
    setShowPicker(false);
  };

  const available = CATALOG_POOL.filter((p) => !selected.find((s) => s.id === p.id));

  return (
    
      <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
        {/* HERO */}
        <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
          <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
            <span className="text-[var(--primary)]">Compare</span> components without opening ten tabs.
          </h1>
          <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl">
            Evaluate technical specifications side-by-side. Add up to {MAX_COMPARE} components. Click any row value to highlight differences.
          </p>
        </section>

        {/* COMPARISON TABLE */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-16">

          {/* Add Component Picker */}
          {showPicker && (
            <div className="mb-6 bg-white border border-[var(--border)] p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-bold text-[18px]">Select a component to add</h3>
                <button
                  onClick={() => setShowPicker(false)}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {available.length === 0 ? (
                <p className="text-[var(--muted-foreground)] text-[14px]">All available components are already in the comparison.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {available.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => add(p)}
                      className="flex items-center gap-3 p-3 border border-[var(--border)] hover:border-[var(--foreground)] transition-colors text-left"
                    >
                      <Image src={p.img} alt={p.mpn} width={48} height={48} className="object-contain shrink-0" />
                      <div>
                        <p className="font-heading font-bold text-[14px]">{p.mpn}</p>
                        <p className="font-sans text-[11px] text-[var(--muted-foreground)]">{p.mfg}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white border border-[var(--border)] overflow-x-auto">
            <table className="w-full text-left font-sans text-[14px]">
              <thead>
                <tr>
                  {/* Label column */}
                  <th className="p-6 border-b border-r border-[var(--border)] bg-[#FAFAFA] w-[200px] shrink-0 min-w-[150px]">
                    {/* Empty corner */}
                  </th>

                  {/* Product columns */}
                  {selected.map((c) => (
                    <th key={c.id} className="p-6 border-b border-[var(--border)] bg-white min-w-[250px] relative group">
                      <button
                        onClick={() => remove(c.id)}
                        title="Remove from comparison"
                        className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="flex flex-col items-center text-center">
                        <Image src={c.img} alt={c.mpn} width={100} height={100} className="object-contain mb-4" />
                        <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase">{c.mfg}</span>
                        <Link
                          href={`/products/${c.id}`}
                          className="font-heading font-bold text-[18px] hover:text-[var(--primary)] transition-colors mt-1 mb-2"
                        >
                          {c.mpn}
                        </Link>
                        <span className="font-bold text-[16px]">{c.price}</span>
                      </div>
                    </th>
                  ))}

                  {/* Add column (shown if below max) */}
                  {selected.length < MAX_COMPARE && (
                    <th className="p-6 border-b border-l border-[var(--border)] bg-[#FAFAFA] min-w-[200px]">
                      <button
                        onClick={() => setShowPicker(true)}
                        className="w-full h-[180px] border-2 border-dashed border-[var(--border)] hover:border-[var(--foreground)] hover:bg-white transition-colors duration-fast flex flex-col items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      >
                        <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="square" strokeLinejoin="miter" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-semibold text-[13px]">Add Component</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border)]">
                {SPEC_ROWS.map((row) => {
                  // Determine if values differ for highlighting
                  const values = selected.map((c) => c[row.key]);
                  const allSame = values.every((v) => v === values[0]);

                  return (
                    <tr key={row.key} className="hover:bg-[#FAFAFA] transition-colors duration-fast">
                      <td className="p-6 font-semibold text-[13px] text-[var(--muted-foreground)] uppercase tracking-wider border-r border-[var(--border)]">
                        {row.label}
                      </td>
                      {selected.map((c) => (
                        <td key={c.id} className="p-6 font-medium text-center">
                          <span
                            className={
                              !allSame
                                ? "bg-amber-50 px-2 py-1 border border-amber-200 text-amber-800 font-bold"
                                : ""
                            }
                          >
                            {c[row.key]}
                          </span>
                        </td>
                      ))}
                      {selected.length < MAX_COMPARE && (
                        <td className="p-6 border-l border-[var(--border)]"></td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selected.length === 0 && (
            <div className="mt-6 p-12 bg-white border border-[var(--border)] flex flex-col items-center justify-center text-center">
              <p className="font-heading font-bold text-[20px] mb-2">Nothing to compare</p>
              <p className="font-sans text-[var(--muted-foreground)] text-[14px] mb-6">Add at least two components to begin comparison.</p>
              <button
                onClick={() => setShowPicker(true)}
                className="bg-[var(--foreground)] text-white font-bold font-sans px-6 py-3 hover:bg-[var(--primary)] transition-colors duration-fast"
              >
                Add First Component
              </button>
            </div>
          )}

          {selected.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                href={`/rfq?mpn=${selected.map((c) => c.mpn).join(",")}`}
                className="inline-flex items-center gap-2 bg-[var(--foreground)] text-white font-sans font-bold px-8 py-3.5 hover:bg-[var(--primary)] transition-colors duration-fast"
              >
                Request Quote for Selected
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </section>
      </div>
    
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-24 text-center">Loading comparison...</div>}>
      <CompareTool />
    </Suspense>
  );
}
