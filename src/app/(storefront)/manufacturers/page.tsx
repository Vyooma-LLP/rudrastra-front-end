"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

/**
 * P0: Manufacturers Directory
 * Canonical index of engineering origins and supply chain sources.
 * Upgraded with category product visuals representing their engineering domain.
 */
export default function ManufacturersPage() {
  const [isApplied, setIsApplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const manufacturers = [
    { id: "M01", name: "T-Motor", origin: "China", expertise: "Propulsion, ESCs, Motors", tier: "Tier 1", count: 142, link: "/manufacturers/t-motor", img: "/images/products/rudrastra_motor_1785921295587.png" },
    { id: "M02", name: "CubePilot", origin: "Australia", expertise: "Flight Controllers, GPS, Carrier Boards", tier: "Tier 1", count: 48, link: "/manufacturers/cubepilot", img: "/images/products/rudrastra_fc_1785921305227.png" },
    { id: "M03", name: "Holybro", origin: "China", expertise: "Flight Controllers, Telemetry, GPS", tier: "Tier 1", count: 86, link: "/manufacturers/holybro", img: "/images/products/rudrastra_gps_1785921355597.png" },
    { id: "M04", name: "Mauch Electronic", origin: "Germany", expertise: "Power Modules, PDBs, Current Sensors", tier: "Tier 2", count: 32, link: "/manufacturers/mauch", img: "/images/products/rudrastra_battery_1785921378157.png" },
    { id: "M05", name: "CUAV", origin: "China", expertise: "Flight Controllers, LTE, Telemetry", tier: "Tier 1", count: 64, link: "/manufacturers/cuav", img: "/images/products/rudrastra_esc_1785921326270.png" },
    { id: "M06", name: "HexAero", origin: "Taiwan", expertise: "Flight Controllers, Avionics", tier: "Tier 1", count: 12, link: "/manufacturers/hexaero", img: "/images/products/flight-controller.png" },
    { id: "M07", name: "Gremsy", origin: "Vietnam", expertise: "Gimbals, Payload Mounts", tier: "Tier 2", count: 24, link: "/manufacturers/gremsy", img: "/images/products/rudrastra_fc_1785921305227.png" },
    { id: "M08", name: "Here", origin: "Australia", expertise: "GNSS, RTK, Navigation", tier: "Tier 1", count: 18, link: "/manufacturers/here", img: "/images/products/rudrastra_gps_1785921355597.png" },
  ];

  return (
    <CapabilityGuard featureKey="catalog.manufacturers">

    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
      
      {/* HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mb-4 block">
          Canonical Supply Chain
        </span>
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
          Trusted <span className="text-[var(--primary)]">Manufacturers.</span>
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl mb-8">
          Browse canonical product families directly by their engineering origin. We index products by their original manufacturer to guarantee authenticity and precise specification matching.
        </p>

        {/* Large Search Input */}
        <div className="w-full max-w-4xl relative flex items-center group">
          <svg className="absolute left-5 w-5 h-5 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) window.location.href = `/manufacturers?q=${encodeURIComponent(searchQuery.trim())}`; }}
            placeholder="Search manufacturers (e.g., T-Motor, Holybro, Mauch)..."
            className="w-full h-[64px] pl-14 pr-[120px] bg-white border border-[var(--border)] font-sans text-[16px] focus:outline-none focus:border-[var(--foreground)] transition-colors duration-fast placeholder:text-[var(--muted-foreground)] focus:placeholder:opacity-50"
          />
          <button
            onClick={() => { if (searchQuery.trim()) window.location.href = `/manufacturers?q=${encodeURIComponent(searchQuery.trim())}`; }}
            className="absolute right-2 top-2 bottom-2 bg-[var(--foreground)] text-white font-sans font-semibold text-[14px] px-8 hover:bg-[var(--primary)] transition-colors duration-fast flex items-center gap-2 group/btn"
          >
            Search
            <svg className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* MANUFACTURER GRID */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manufacturers.map((mfg) => (
          <Link key={mfg.id} href={mfg.link} className="bg-white border border-[var(--border)] p-8 flex flex-col h-full min-h-[340px] relative group hover:bg-[var(--primary)] transition-colors duration-fast">
            <div className="flex justify-between items-start mb-6">
              <span className="font-sans text-[14px] font-bold text-[var(--muted-foreground)] group-hover:text-white/85 transition-colors duration-fast">{mfg.id}</span>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[11px] font-bold tracking-widest uppercase border border-[var(--border)] px-2 py-1 group-hover:border-white/30 group-hover:text-white transition-colors duration-fast">{mfg.tier}</span>
              </div>
            </div>
            
            <div className="flex gap-6 items-center mb-6">
              <div className="w-16 h-16 bg-[#FAFAFA] border border-[var(--border)] p-2 relative shrink-0 flex items-center justify-center group-hover:bg-white transition-colors duration-fast">
                <Image
                  src={mfg.img}
                  alt={mfg.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="font-heading font-bold text-[28px] tracking-tight uppercase mb-1 group-hover:text-white transition-colors duration-fast">{mfg.name}</h2>
                <div className="font-sans text-[13px] font-semibold text-[var(--foreground)] flex items-center gap-2 group-hover:text-white/90 transition-colors duration-fast">
                  HQ: {mfg.origin}
                </div>
              </div>
            </div>
            
            <div className="font-sans text-[15px] text-[var(--muted-foreground)] leading-relaxed mb-8 flex-1 group-hover:text-white/90 transition-colors duration-fast">
              <span className="block mb-2 font-bold text-[12px] tracking-widest uppercase text-[var(--foreground)] group-hover:text-white/60">Core Expertise</span>
              {mfg.expertise}
            </div>
            
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-[var(--border)] group-hover:border-white/20 transition-colors duration-fast">
              <span className="font-sans font-bold text-[14px] flex items-center gap-2 group-hover:text-white transition-colors duration-fast">
                View {mfg.count} Products
                <svg className="w-4 h-4 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="w-full bg-[#111111] text-white px-6 lg:px-10 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-[32px] md:text-[48px] tracking-tight mb-6">Are you an OEM Manufacturer?</h2>
            <p className="font-sans text-[16px] text-white/70 max-w-2xl mx-auto">
              Join the Rudrastra canonical supply chain. To guarantee authenticity and performance, all manufacturers must undergo physical product testing. Please fill out the details below and prepare to send your demo units for verification.
            </p>
          </div>
          
          {isApplied ? (
            <div className="bg-[#138808]/10 border border-[#138808]/30 p-8 text-center text-[#138808] font-sans">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-bold text-[20px] mb-2">Application Received</h3>
              <p className="text-white/70">Our engineering team will contact you within 24 hours with instructions for shipping your demo units for verification testing.</p>
            </div>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setIsApplied(true);
              }}
              className="bg-[#1A1A1A] p-8 border border-[#333] space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-sans text-[12px] font-bold text-white/70 uppercase">Company Name</label>
                  <input required type="text" className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[var(--primary)] focus:outline-none transition-colors" placeholder="e.g. T-Motor" />
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-[12px] font-bold text-white/70 uppercase">GSTIN / Tax ID</label>
                  <input required type="text" className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[var(--primary)] focus:outline-none transition-colors" placeholder="GSTIN" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-sans text-[12px] font-bold text-white/70 uppercase">Engineering Domains</label>
                <input required type="text" className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[var(--primary)] focus:outline-none transition-colors" placeholder="e.g. Propulsion, Flight Controllers, Telemetry" />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-[12px] font-bold text-white/70 uppercase">ISO Certifications</label>
                <input type="text" className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[var(--primary)] focus:outline-none transition-colors" placeholder="e.g. ISO 9001:2015 (Optional)" />
              </div>
              
              <div className="bg-[#111] border border-[#333] p-4 text-sm text-white/60">
                <strong className="text-white">Note:</strong> Submitting this form initiates the OEM verification process. You will be required to send physical product samples to our Bangalore testing facility before your catalog is activated.
              </div>

              <button 
                type="submit"
                className="w-full bg-white text-black font-sans font-bold text-[14px] px-8 py-4 hover:bg-[var(--primary)] hover:text-white transition-colors duration-fast mt-4"
              >
                Submit Application & Request Testing Kit
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  
    </CapabilityGuard>
);
}
