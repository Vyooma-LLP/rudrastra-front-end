"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CapabilityGuard } from "@/components/layout/CapabilityGuard";

type BomItem = {
  position: string;
  mpn: string;
  manufacturer: string;
  description: string;
  qty: number;
  category: string;
  productId: string;
};

type ArchitectureSpec = {
  slug: string;
  title: string;
  config: string;
  payload: string;
  flightTime: string;
  img: string;
  useCase: string;
  bom: BomItem[];
};

const ARCHITECTURE_DATA: Record<string, ArchitectureSpec> = {
  "heavy-lift-hexacopter": {
    slug: "heavy-lift-hexacopter",
    title: "Heavy Lift Hexacopter",
    config: "X6 Hex Configuration",
    payload: "15kg",
    flightTime: "45m",
    useCase: "Agricultural spraying, industrial inspection, cargo delivery",
    img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
    bom: [
      { position: "M1–M6", mpn: "MN4014", manufacturer: "T-Motor", description: "400KV Brushless Motor", qty: 6, category: "Propulsion", productId: "RUD-MOT-MN4014" },
      { position: "ESC1–ESC6", mpn: "Flame 80A", manufacturer: "T-Motor", description: "80A Electronic Speed Controller", qty: 6, category: "ESC", productId: "RUD-ESC-FLAME80" },
      { position: "FC", mpn: "Cube Orange+", manufacturer: "CubePilot", description: "Flight Controller + IMU + Barometer", qty: 1, category: "Avionics", productId: "RUD-FC-CUBE-ORANGE" },
      { position: "GPS", mpn: "Here3+", manufacturer: "CubePilot", description: "Multi-constellation RTK GPS", qty: 1, category: "Navigation", productId: "RUD-GPS-HERE3" },
      { position: "BAT", mpn: "Tattu 6S 22000mAh", manufacturer: "Tattu", description: "6S LiPo Battery Pack", qty: 2, category: "Power", productId: "RUD-BAT-TATTU-22000" },
    ],
  },
  "mapping-vtol": {
    slug: "mapping-vtol",
    title: "Mapping VTOL Fixed-Wing",
    config: "Tilt-Rotor VTOL",
    payload: "2kg",
    flightTime: "120m",
    useCase: "Terrain mapping, survey, long-range reconnaissance",
    img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
    bom: [
      { position: "M1–M4", mpn: "MN3510", manufacturer: "T-Motor", description: "360KV VTOL Lift Motor", qty: 4, category: "Propulsion", productId: "RUD-MOT-MN3510" },
      { position: "M5 (Pusher)", mpn: "AT2312", manufacturer: "T-Motor", description: "Fixed-wing Pusher Motor", qty: 1, category: "Propulsion", productId: "RUD-MOT-AT2312" },
      { position: "FC", mpn: "Cube Orange+", manufacturer: "CubePilot", description: "Flight Controller", qty: 1, category: "Avionics", productId: "RUD-FC-CUBE-ORANGE" },
      { position: "GPS", mpn: "Holybro M8N", manufacturer: "Holybro", description: "GPS+Compass Module", qty: 1, category: "Navigation", productId: "RUD-GPS-HOLY-M8N" },
    ],
  },
  "tactical-quadcopter": {
    slug: "tactical-quadcopter",
    title: "Tactical Quadcopter",
    config: "H4 Configuration",
    payload: "1.5kg",
    flightTime: "55m",
    useCase: "Defense ISR, border patrol, urban surveillance",
    img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
    bom: [
      { position: "M1–M4", mpn: "MN4010", manufacturer: "T-Motor", description: "420KV Tactical Motor", qty: 4, category: "Propulsion", productId: "RUD-MOT-MN4010" },
      { position: "ESC1–ESC4", mpn: "Air40A", manufacturer: "T-Motor", description: "40A Air ESC", qty: 4, category: "ESC", productId: "RUD-ESC-AIR40" },
      { position: "FC", mpn: "Cube Orange+", manufacturer: "CubePilot", description: "Flight Controller", qty: 1, category: "Avionics", productId: "RUD-FC-CUBE-ORANGE" },
    ],
  },
};

export default function ArchitectureDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const arch = slug ? ARCHITECTURE_DATA[slug] : null;

  if (!arch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] font-sans">
        <div className="text-center p-12">
          <h1 className="font-heading font-bold text-[32px] mb-4">Architecture Not Found</h1>
          <p className="text-[var(--muted-foreground)] mb-6">No reference architecture matched this identifier.</p>
          <Link href="/engineering/architectures" className="font-bold text-[var(--primary)]">← Back to Architectures</Link>
        </div>
      </div>
    );
  }

  return (
    <CapabilityGuard featureKey="engineering.search">
      <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
        {/* HERO */}
        <section className="w-full bg-[#111111] text-white px-6 lg:px-10 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image src={arch.img} alt={arch.title} fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-2 text-[12px] text-white/50 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/engineering" className="hover:text-white transition-colors">Engineering</Link>
              <span>/</span>
              <Link href="/engineering/architectures" className="hover:text-white transition-colors">Architectures</Link>
              <span>/</span>
              <span className="text-white/80 font-semibold">{arch.title}</span>
            </div>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest block mb-3">{arch.config}</span>
            <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight mb-4">
              {arch.title}
            </h1>
            <p className="font-sans text-[16px] text-white/70 max-w-xl mb-8">{arch.useCase}</p>
            <div className="flex gap-8">
              {[{ label: "Payload", val: arch.payload }, { label: "Flight Time", val: arch.flightTime }, { label: "BOM Items", val: `${arch.bom.reduce((s, r) => s + r.qty, 0)} parts` }].map(({ label, val }) => (
                <div key={label}>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">{label}</span>
                  <span className="font-mono text-[20px] font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOM TABLE */}
        <section className="w-full px-6 lg:px-10 py-16 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading font-bold text-[28px] tracking-tight mb-1">Component Stack</h2>
              <p className="font-sans text-[14px] text-[var(--muted-foreground)]">
                All components have been validated for compatibility within this system architecture.
              </p>
            </div>
            <Link
              href={`/rfq?arch=${arch.slug}`}
              className="hidden md:inline-flex bg-[var(--foreground)] text-white font-bold font-sans text-[13px] px-6 py-3 hover:bg-[var(--primary)] transition-colors duration-fast"
            >
              Request Quote for Full BOM →
            </Link>
          </div>

          <div className="bg-white border border-[var(--border)] overflow-x-auto">
            <table className="w-full text-left font-sans text-[14px] whitespace-nowrap">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[#FAFAFA] text-[11px] uppercase text-[var(--muted-foreground)] tracking-wider">
                  <th className="px-6 py-4 font-semibold">Position</th>
                  <th className="px-6 py-4 font-semibold">MPN</th>
                  <th className="px-6 py-4 font-semibold">Manufacturer</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold text-center">Qty</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {arch.bom.map((row, i) => (
                  <tr key={i} className="hover:bg-[#FAFAFA] transition-colors duration-fast">
                    <td className="px-6 py-4 font-mono text-[12px] text-[var(--muted-foreground)]">{row.position}</td>
                    <td className="px-6 py-4 font-mono font-bold text-[13px]">{row.mpn}</td>
                    <td className="px-6 py-4 font-medium">{row.manufacturer}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{row.description}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider bg-[#F5F5F5] border border-[var(--border)] px-2 py-1">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold">{row.qty}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/products/${row.productId}`}
                        className="font-sans font-bold text-[12px] text-[var(--foreground)] hover:text-[var(--primary)] flex items-center gap-1 transition-colors"
                      >
                        View
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile CTA */}
          <div className="mt-6 flex justify-center md:hidden">
            <Link
              href={`/rfq?arch=${arch.slug}`}
              className="w-full text-center bg-[var(--foreground)] text-white font-bold font-sans text-[13px] px-6 py-4 hover:bg-[var(--primary)] transition-colors duration-fast"
            >
              Request Quote for Full BOM →
            </Link>
          </div>

          {/* COMPATIBILITY NOTE */}
          <div className="mt-10 p-6 bg-white border border-[var(--border)] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <p className="font-heading font-bold text-[16px] mb-1">Want to verify component compatibility?</p>
              <p className="font-sans text-[13px] text-[var(--muted-foreground)]">
                Run the full compatibility check for voltage, current, and interface constraints across this stack.
              </p>
            </div>
            <Link
              href="/compatibility"
              className="shrink-0 border border-[var(--foreground)] text-[var(--foreground)] font-bold font-sans text-[13px] px-6 py-3 hover:bg-[var(--foreground)] hover:text-white transition-colors duration-fast"
            >
              Open Compatibility Engine →
            </Link>
          </div>
        </section>
      </div>
    </CapabilityGuard>
  );
}
