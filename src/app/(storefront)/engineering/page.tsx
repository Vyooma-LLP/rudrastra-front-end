"use client";

import Image from "next/image";
import { toast } from "@/components/ui/Toast";

/**
 * P0: Engineering Discovery Platform
 * Shell is live. All tools are Coming Soon in MVP.
 */
function comingSoon(label: string) {
  toast(`${label} — Coming Soon`);
}

export default function EngineeringPage() {
  const tools = [
    {
      title: "Compatibility Engine",
      desc: "Verify engineering constraints between motors, ESCs, flight controllers and power systems.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "BOM Procurement",
      desc: "Upload a complete bill of materials. Instantly resolve MPNs and check inventory across all sellers.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Architecture Explorer",
      desc: "Browse reference drone architectures (Quads, VTOLs, Hex) and view their exact component stacks.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
  ];

  const architectures = [
    { slug: "heavy-lift-hexacopter", title: "Heavy Lift Hexacopter", payload: "15kg", flightTime: "45m", img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80" },
    { slug: "mapping-vtol", title: "Mapping VTOL Fixed-Wing", payload: "2kg", flightTime: "120m", img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80" },
    { slug: "tactical-quadcopter", title: "Tactical Quadcopter", payload: "1.5kg", flightTime: "55m", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80" },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">

      {/* HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mb-4 block">
          Platform Capabilities
        </span>
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
          Engineering <span className="text-[var(--primary)]">Intelligence.</span>
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl mb-8">
          The technical core of Rudraastra. Validate system compatibility, resolve complex BOMs, and explore reference architectures for indigenous UAV development.
        </p>
      </section>

      {/* TOOLS GRID */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => comingSoon(tool.title)}
            title="Coming Soon"
            className="bg-white border border-[var(--border)] p-8 flex flex-col h-full min-h-[320px] relative group transition-colors duration-fast hover:bg-[#111111] text-left cursor-pointer"
          >
            <div className="w-12 h-12 bg-black flex items-center justify-center mb-8 group-hover:bg-[var(--primary)] transition-colors duration-fast">
              {tool.icon}
            </div>

            <h2 className="font-heading font-bold text-[28px] tracking-tight mb-4 group-hover:text-white transition-colors duration-fast">
              {tool.title}
              <span className="ml-3 text-[11px] font-sans uppercase tracking-widest text-black bg-[#EAEAEA] px-2 py-1 rounded-sm align-middle group-hover:text-[#111111]">
                Soon
              </span>
            </h2>

            <p className="font-sans text-[15px] text-[var(--muted-foreground)] leading-relaxed mb-6 flex-1 group-hover:text-white/80 transition-colors duration-fast">
              {tool.desc}
            </p>

            <div className="flex justify-between items-end mt-auto pt-4 border-t border-[var(--border)] group-hover:border-white/20 transition-colors duration-fast">
              <span className="font-sans font-bold text-[14px] flex items-center gap-2 group-hover:text-white transition-colors duration-fast">
                In Development
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* REFERENCE ARCHITECTURES */}
      <section className="w-full bg-[#111111] text-white px-6 lg:px-10 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/20 pb-6">
            <div>
              <h2 className="font-heading font-bold text-[32px] md:text-[40px] tracking-tight mb-3">Reference Architectures</h2>
              <p className="font-sans text-[15px] text-white/70 max-w-xl">
                Explore complete, verified system architectures and immediately add their specific component BOMs to your procurement list.
              </p>
            </div>
            <button
              type="button"
              onClick={() => comingSoon("Reference Architectures")}
              title="Coming Soon"
              className="hidden md:inline-flex px-6 py-3 border border-white text-[13px] font-sans font-semibold hover:bg-white hover:text-black transition-colors duration-fast mt-6 cursor-pointer"
            >
              View All Architectures
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {architectures.map((arch, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => comingSoon(arch.title)}
                title="Coming Soon"
                className="bg-black/50 border border-white/10 p-6 hover:border-white/40 transition-colors duration-fast cursor-pointer group text-left w-full"
              >
                <div className="aspect-[4/3] bg-white/5 mb-6 overflow-hidden relative">
                  <Image
                    src={arch.img}
                    alt={arch.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-slow opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <span className="font-sans text-white/30 text-[12px] font-bold tracking-widest absolute bottom-4 left-4 z-20">SYSTEM RENDER</span>
                </div>
                <h3 className="font-heading font-bold text-[24px] mb-4 group-hover:text-[var(--primary)] transition-colors duration-fast">{arch.title}</h3>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-white/50 uppercase tracking-widest mb-1">Payload</span>
                    <span className="font-mono text-[14px]">{arch.payload}</span>
                  </div>
                  <div className="w-[1px] bg-white/20"></div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-white/50 uppercase tracking-widest mb-1">Flight Time</span>
                    <span className="font-mono text-[14px]">{arch.flightTime}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
