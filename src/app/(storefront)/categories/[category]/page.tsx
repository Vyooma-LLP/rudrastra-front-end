import Link from "next/link";
import Image from "next/image";

/**
 * P0: Subcategory Page
 * Includes the contextual Engineering Calculator module.
 */
export default async function SubcategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  // We mock the content assuming it's the "propulsion" route.
  const title = resolvedParams.category === "propulsion" ? "Propulsion" : "Category";
  
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
      
      {/* Breadcrumbs */}
      <div className="w-full px-6 lg:px-10 py-4 font-sans text-[12px] text-[var(--muted-foreground)] flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-[var(--foreground)] transition-colors">Categories</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-semibold uppercase">{title}</span>
      </div>

      {/* 1. HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4 capitalize">
          <span className="text-[var(--accent)]">{title}</span> Components
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl mb-8">
          Motors, ESCs and propellers for multirotor, fixed-wing and heavy-lift platforms.
        </p>
        <span className="font-sans font-bold text-[14px]">1,420 COMPONENTS</span>
      </section>

      {/* 2. SUBCATEGORY EXPLORATION & CALCULATOR */}
      <section className="w-full px-6 lg:px-10 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Left: Subcategories & Filters */}
        <div className="flex-1">
          <h2 className="font-heading font-bold text-[24px] mb-6">Subcategories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {["Motors", "ESCs", "Propellers", "Motor Accessories"].map((sub) => (
              <Link key={sub} href={`/products?category=${sub.toLowerCase()}`} className="bg-white border border-[var(--border)] p-6 text-center hover:border-[#111] hover:bg-[#FAFAFA] transition-colors duration-fast">
                <span className="font-sans font-semibold text-[14px]">{sub}</span>
              </Link>
            ))}
          </div>

          <h2 className="font-heading font-bold text-[24px] mb-6">Top Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Minimal product cards for the category view */}
            {[
              { mfg: "T-Motor", mpn: "MN4014", id: "RUD-MOT-MN4014", price: "₹12,450", img: "/images/products/rudrastra_motor_1785921295587.png" },
              { mfg: "Hobbywing", mpn: "XRotor 40A", id: "RUD-ESC-XR40", price: "₹6,800", img: "/images/products/rudrastra_esc_1785921326270.png" },
              { mfg: "APC", mpn: "15x5E", id: "RUD-PRP-15X5E", price: "₹850", img: "/images/products/rudrastra_propeller_1785921366443.png" },
            ].map((prod, i) => (
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
        </div>

        {/* Right: The Engineering Tool Teaser */}
        <aside className="w-full lg:w-[320px] shrink-0">
          <div className="bg-[#111111] text-white p-8 sticky top-24">
            <h3 className="font-heading font-bold text-[20px] mb-2">Propulsion matching</h3>
            <p className="font-sans text-[13px] text-[#888] mb-8">Size your power system accurately before purchasing components.</p>
            
            <div className="flex flex-col items-center gap-1 font-mono text-[13px] font-bold text-center mb-8">
              <div className="w-full py-2 bg-[#222] border border-[#333]">Motor KV</div>
              <svg className="w-4 h-4 text-[#666] my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              <div className="w-full py-2 bg-[#222] border border-[#333]">Battery voltage</div>
              <svg className="w-4 h-4 text-[#666] my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              <div className="w-full py-2 bg-[#222] border border-[#333]">ESC current</div>
              <svg className="w-4 h-4 text-[#666] my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              <div className="w-full py-2 bg-[#222] border border-[#333]">Propeller size</div>
              <svg className="w-4 h-4 text-[#666] my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              <div className="w-full py-2 bg-[var(--primary)] text-black border border-orange-500">Expected thrust</div>
            </div>

            <Link href="/engineering/calculators" className="w-full inline-flex justify-center items-center gap-2 bg-white text-black font-sans font-bold px-4 py-3 hover:bg-[var(--primary)] hover:text-white transition-colors duration-fast">
              Open Propulsion Calculator
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
