import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, or, ilike } from "drizzle-orm";
import { getProductImage } from "@/utils/image";

const CATEGORY_SLUG_MAP: Record<string, { name: string; desc: string; subcategories: string[] }> = {
  "propulsion": {
    name: "Propulsion",
    desc: "Motors, ESCs, Propellers, and Propulsion Accessories for heavy lift UAVs.",
    subcategories: ["Motors", "ESCs", "Propellers", "Motor accessories"]
  },
  "flight-control": {
    name: "Flight Control",
    desc: "Autopilots, flight controllers, IMUs, companion compute interfaces, and sensor suites.",
    subcategories: ["Flight controllers", "IMUs", "Sensors"]
  },
  "power": {
    name: "Power",
    desc: "LiPo batteries, solid-state batteries, intelligent BMS, power distribution boards, and power modules.",
    subcategories: ["Batteries", "BMS", "Power modules", "PDB"]
  },
  "compute": {
    name: "Compute & AI",
    desc: "High-performance companion computers, edge AI accelerators, and single board computers.",
    subcategories: ["Companion computers", "AI accelerators", "SBCs"]
  },
  "communication": {
    name: "Communication",
    desc: "Telemetry modems, high-power radios, LTE links, and Wi-Fi transceivers.",
    subcategories: ["Telemetry", "Radios", "LTE", "Wi-Fi"]
  },
  "navigation": {
    name: "Navigation",
    desc: "GNSS receivers, RTK base/rover modules, external compasses, and optical flow sensors.",
    subcategories: ["GNSS", "RTK", "Compass", "Optical flow"]
  },
  "airframe": {
    name: "Airframe",
    desc: "Carbon fiber frames, retractable landing gear, damping mounts, and structural hardware.",
    subcategories: ["Frames", "Landing gear", "Mounts"]
  },
  "payload": {
    name: "Payload",
    desc: "Stabilized camera gimbals, optical/thermal cameras, LiDAR scanners, and release mechanisms.",
    subcategories: ["Gimbals", "Cameras", "LiDAR", "Thermal"]
  }
};

export default async function SubcategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.category.toLowerCase();
  
  const categoryData = CATEGORY_SLUG_MAP[slug] || {
    name: resolvedParams.category.replace("-", " "),
    desc: "High performance engineering components.",
    subcategories: []
  };

  // Fetch products from database that belong to this category or subcategories
  const dbProducts = await db.select().from(products).where(
    or(
      eq(products.category, categoryData.name),
      ilike(products.category, `${categoryData.name} > %`)
    )
  );

  const resolvedProducts = dbProducts.map((p) => {
    let mfg = "Verified Brand";
    if (p.title) {
      const parts = p.title.trim().split(' ');
      if (parts[0]) mfg = parts[0];
    }
    return {
      id: p.id,
      mfg: mfg,
      mpn: p.mpn || p.title,
      price: `₹${(p.price / 100).toLocaleString('en-IN')}`,
      img: getProductImage(p.imageUrl),
    };
  });

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
      
      {/* Breadcrumbs */}
      <div className="w-full px-6 lg:px-10 py-4 font-sans text-[12px] text-[var(--muted-foreground)] flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-[var(--foreground)] transition-colors">Categories</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-semibold uppercase">{categoryData.name}</span>
      </div>

      {/* 1. HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4 capitalize">
          <span className="text-[var(--primary)]">{categoryData.name}</span> Components
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl mb-8">
          {categoryData.desc}
        </p>
        <span className="font-sans font-bold text-[14px] uppercase tracking-wider bg-black text-white px-3 py-1 text-[11px]">
          {resolvedProducts.length} {resolvedProducts.length === 1 ? 'Component' : 'Components'} Found
        </span>
      </section>

      {/* 2. SUBCATEGORY EXPLORATION & CALCULATOR */}
      <section className="w-full px-6 lg:px-10 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Left: Subcategories & Filters */}
        <div className="flex-1">
          {categoryData.subcategories.length > 0 && (
            <>
              <h2 className="font-heading font-bold text-[24px] mb-6">Subcategories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {categoryData.subcategories.map((sub) => (
                  <Link key={sub} href={`/products?category=${encodeURIComponent(categoryData.name + " > " + sub)}`} className="bg-white border border-[var(--border)] p-6 text-center hover:border-[#111] hover:bg-[#FAFAFA] transition-colors duration-fast">
                    <span className="font-sans font-semibold text-[14px]">{sub}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 className="font-heading font-bold text-[24px] mb-6">Explore Products</h2>
          
          {resolvedProducts.length === 0 ? (
            <div className="bg-white border border-[var(--border)] p-12 text-center font-sans text-[15px] text-[var(--muted-foreground)]">
              No products found in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resolvedProducts.map((prod, i) => (
                <Link key={i} href={`/products/${prod.id}`} className="group bg-white border border-[var(--border)] p-4 flex flex-col hover:border-[#111] transition-colors duration-fast">
                  <div className="w-full h-[180px] bg-[#F9F9F9] flex items-center justify-center p-4 mb-4 relative overflow-hidden">
                    <Image src={prod.img} alt={prod.mpn} width={120} height={120} className="object-contain transform group-hover:scale-[1.03] transition-transform duration-slow" />
                  </div>
                  <span className="font-sans text-[10px] font-bold text-[var(--muted-foreground)] uppercase">{prod.mfg}</span>
                  <span className="font-heading font-bold text-[16px]">{prod.mpn}</span>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-sans font-semibold text-[14px]">{prod.price}</span>
                    <svg className="w-4 h-4 text-[var(--primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: The Engineering Tool Teaser */}
        <aside className="w-full lg:w-[320px] shrink-0">
          <div className="bg-[#111111] text-white p-8 sticky top-24">
            <h3 className="font-heading font-bold text-[20px] mb-2">{categoryData.name} sizing</h3>
            <p className="font-sans text-[13px] text-[#888] mb-8">Utilize our engineering suites to model compatibility prior to purchase.</p>
            
            <div className="flex flex-col items-center gap-1 font-mono text-[13px] font-bold text-center mb-8">
              <div className="w-full py-2 bg-[#222] border border-[#333]">System Constraints</div>
              <svg className="w-4 h-4 text-[#666] my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              <div className="w-full py-2 bg-[#222] border border-[#333]">Voltage & Currents</div>
              <svg className="w-4 h-4 text-[#666] my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              <div className="w-full py-2 bg-[#222] border border-[#333]">Signal Protocol</div>
              <svg className="w-4 h-4 text-[#666] my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              <div className="w-full py-2 bg-[#222] border border-[#333]">Operating Envelope</div>
              <svg className="w-4 h-4 text-[#666] my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              <div className="w-full py-2 bg-[var(--primary)] text-black border border-orange-500">Optimized Spec Sheet</div>
            </div>

            <Link href="/engineering/calculator" className="w-full inline-flex justify-center items-center gap-2 bg-white text-black font-sans font-bold px-4 py-3 hover:bg-[var(--primary)] hover:text-white transition-colors duration-fast">
              Open Discovery Engine
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </aside>

      </section>
    </div>
  );
}
