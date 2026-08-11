import Link from "next/link";
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

/**
 * P0: Categories (Engineering Taxonomy)
 * Root hub for UAV hardware subsystems.
 */
export default function CategoriesPage() {
  const categories = [
    { id: "01", name: "Propulsion", desc: "Motors, ESCs, Propellers, Motor accessories", count: 1420, link: "/categories/propulsion" },
    { id: "02", name: "Flight Control", desc: "Flight controllers, IMUs, Sensors", count: 312, link: "/categories/flight-control" },
    { id: "03", name: "Power", desc: "Batteries, BMS, Power modules, PDB", count: 856, link: "/categories/power" },
    { id: "04", name: "Compute & AI", desc: "Companion computers, AI accelerators, SBCs", count: 124, link: "/categories/compute" },
    { id: "05", name: "Communication", desc: "Telemetry, Radios, LTE, Wi-Fi", count: 290, link: "/categories/communication" },
    { id: "06", name: "Navigation", desc: "GNSS, RTK, Compass, Optical flow", count: 185, link: "/categories/navigation" },
    { id: "07", name: "Airframe", desc: "Frames, Landing gear, Mounts", count: 540, link: "/categories/airframe" },
    { id: "08", name: "Payload", desc: "Gimbals, Cameras, LiDAR, Thermal", count: 210, link: "/categories/payload" },
  ];

  return (
    <CapabilityGuard featureKey="catalog.categories">

    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
      
      {/* HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mb-4 block">
          Engineering Taxonomy
        </span>
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
          Browse by <span className="text-[var(--primary)]">Engineering</span> System
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl mb-8">
          Browse components by engineering system, interface, specification and application.
        </p>
      </section>

      {/* CATEGORY BLOCKS */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link key={cat.id} href={cat.link} className="bg-white border border-[var(--border)] p-8 flex flex-col h-full min-h-[320px] relative group hover:bg-[var(--primary)] transition-colors duration-fast">
            <div className="flex justify-between items-start mb-8">
              <span className="font-sans text-[14px] font-bold text-[var(--muted-foreground)] group-hover:text-white/85 transition-colors duration-fast">{cat.id}</span>
              <span className="font-sans text-[12px] font-bold text-[var(--muted-foreground)] opacity-70 group-hover:opacity-100 transition-opacity duration-fast group-hover:text-white/85">{cat.count.toLocaleString()} components</span>
            </div>
            
            <h2 className="font-heading font-bold text-[28px] tracking-tight uppercase mb-4 group-hover:text-white transition-colors duration-fast">{cat.name}</h2>
            
            <div className="font-sans text-[15px] text-[var(--muted-foreground)] leading-relaxed mb-6 flex-1 group-hover:text-white/90 transition-colors duration-fast">
              {cat.desc.split(', ').map((item, i) => (
                <span key={i} className="block mb-1">• {item}</span>
              ))}
            </div>
            
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-[var(--border)] group-hover:border-white/20 transition-colors duration-fast">
              <span className="font-sans font-bold text-[14px] flex items-center gap-2 group-hover:text-white transition-colors duration-fast">
                Explore
                <svg className="w-4 h-4 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  
    </CapabilityGuard>
);
}
