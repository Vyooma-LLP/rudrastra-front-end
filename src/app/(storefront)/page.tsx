import Link from "next/link";
import Image from "next/image";

/**
 * Rudrastra Homepage
 * 
 * Hierarchy:
 * Hero -> Engineering Search -> Taxonomy -> Featured Components -> Compatibility Intelligence -> Manufacturers -> BOM/RFQ -> Engineering Resources -> Newsletter
 */
export default function HomePage() {
  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* 1. HERO + ENGINEERING SEARCH */}
      <section className="w-full px-6 lg:px-10 pt-3 pb-16 md:pt-4 md:pb-24 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-8">
          <h1 className="font-heading font-extrabold text-[40px] md:text-[72px] leading-[1.05] tracking-tight max-w-5xl text-center md:text-left">
            <span className="text-[var(--primary)]">India's</span> Drone <span className="text-[var(--accent)]">Hardware</span> <span className="text-[var(--success)]">Marketplace.</span>
          </h1>
          <Image 
            src="/images/make-in-india.png" 
            alt="Make in India" 
            width={412} 
            height={288} 
            className="w-auto h-[160px] md:h-[288px] object-contain shrink-0" 
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--primary)] border-[var(--primary)] bg-white px-4 py-1.5 inline-flex items-center gap-2 border">
                  <svg className="w-3.5 h-3.5 text-[var(--primary)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  MADE IN INDIA
                </span>
                <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--accent)] border-[var(--accent)] bg-white px-4 py-1.5 inline-flex items-center border">
                  INDIAN DRONE HARDWARE
                </span>
                <span className="hidden sm:inline-flex font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--success)] border-[var(--success)] bg-white px-4 py-1.5 items-center border">
                  BUILT FOR GLOBAL OPERATIONS
                </span>
        </div>

        <p className="font-sans text-[16px] md:text-[20px] text-[var(--muted-foreground)] max-w-3xl mb-12 leading-relaxed">
          Find, evaluate, compare, and procure canonical engineering components for UAVs.
        </p>

        {/* Large Engineering Search Input */}
        <div className="w-full max-w-3xl relative flex items-center group">
          <svg className="absolute left-5 w-5 h-5 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search MPN, manufacturer, KV, voltage, protocol..."
            className="w-full h-[64px] pl-14 pr-[120px] bg-white border border-[var(--border)] font-sans text-[16px] focus:outline-none focus:border-[var(--foreground)] transition-colors duration-fast placeholder:text-[var(--muted-foreground)] focus:placeholder:opacity-50"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-[var(--foreground)] text-white font-sans font-semibold text-[14px] px-6 hover:bg-[var(--primary)] transition-all duration-fast flex items-center gap-2 group/btn">
            Search
            <svg className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Popular searches */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[13px] font-sans text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--foreground)]">Popular:</span>
          <Link href="/products?q=MN4014" className="hover:text-[var(--foreground)] transition-colors duration-fast border-b border-transparent hover:border-[var(--foreground)]">MN4014</Link>
          <span>·</span>
          <Link href="/products?q=Pixhawk+6X" className="hover:text-[var(--foreground)] transition-colors duration-fast border-b border-transparent hover:border-[var(--foreground)]">Pixhawk 6X</Link>
          <span>·</span>
          <Link href="/products?q=45A+ESC" className="hover:text-[var(--foreground)] transition-colors duration-fast border-b border-transparent hover:border-[var(--foreground)]">45A ESC</Link>
          <span>·</span>
          <Link href="/products?q=M10+GNSS" className="hover:text-[var(--foreground)] transition-colors duration-fast border-b border-transparent hover:border-[var(--foreground)]">M10 GNSS</Link>
        </div>
      </section>



      {/* 2. ENGINEERING TAXONOMY (CATEGORY GRID) */}
      <section className="w-full px-6 lg:px-10 py-20 bg-white border-y border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-heading font-bold text-[32px] tracking-tight mb-3 text-[var(--foreground)]"><span className="text-[var(--accent)]">System</span> Architecture</h2>
            <p className="font-sans text-[15px] text-[var(--muted-foreground)] max-w-xl">
              Browse components by engineering system and application.
            </p>
          </div>
          <Link href="/categories" className="group hidden md:inline-flex items-center gap-2 font-sans font-semibold text-[14px] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 mt-6 transition-colors duration-fast hover:text-[var(--primary)] hover:border-[var(--primary)]">
            View all categories
            <svg className="w-4 h-4 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[var(--border)] border border-[var(--border)]">
          {[
            { id: "01", name: "Propulsion", sub: "Motors, ESCs, Propellers", count: 412 },
            { id: "02", name: "Flight Control", sub: "FCs, IMUs, Sensors", count: 85 },
            { id: "03", name: "Power", sub: "Batteries, BMS, PDBs", count: 124 },
            { id: "04", name: "Compute & AI", sub: "Companion PCs, Accelerators", count: 32 },
            { id: "05", name: "Communication", sub: "Telemetry, Radios, LTE", count: 96 },
            { id: "06", name: "Navigation", sub: "GNSS, RTK, Optical Flow", count: 48 },
            { id: "07", name: "Airframe", sub: "Frames, Landing Gear, Mounts", count: 215 },
            { id: "08", name: "Payload", sub: "Gimbals, Cameras, LiDAR", count: 67 },
          ].map((cat, i) => (
            <Link key={cat.id} href={`/categories/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="group relative p-6 flex flex-col transition-colors duration-fast h-[160px] bg-white hover:bg-[var(--primary)]">
              <div className="flex justify-between items-start mb-4">
                <span className="font-sans text-[12px] text-[var(--muted-foreground)] group-hover:text-white">{cat.id}</span>
                <span className="font-sans text-[11px] opacity-70 group-hover:opacity-100 transition-opacity duration-fast text-[var(--muted-foreground)] group-hover:text-white/80">{cat.count} items</span>
              </div>
              <h3 className="font-heading text-[20px] tracking-tight mb-2 transition-colors duration-fast group-hover:text-white">{cat.name}</h3>
              <p className="font-sans text-[13px] text-[var(--muted-foreground)] group-hover:text-white/90">{cat.sub}</p>
              
              <div className="absolute bottom-6 right-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CANONICAL PRODUCT DISCOVERY */}
      <section className="w-full px-6 lg:px-10 py-24 bg-[#FAFAFA]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2 className="font-heading font-bold text-[36px] tracking-tight mb-4 leading-[1.1] text-[var(--foreground)]">
              Technical <span className="text-[var(--primary)]">Components</span>
            </h2>
            <p className="font-sans text-[16px] text-[var(--muted-foreground)] leading-relaxed">
              <span className="text-[var(--accent)]">Canonical</span> hardware records with aggregated multi-seller pricing and <span className="text-[var(--success)]">stock availability.</span>
            </p>
          </div>
          <Link href="/products" className="group hidden md:inline-flex items-center gap-2 font-sans font-semibold text-[14px] text-[var(--foreground)] mt-6 border-b border-[var(--foreground)] pb-1 transition-colors duration-fast hover:text-[var(--primary)] hover:border-[var(--primary)]">
            Explore catalog
            <svg className="w-4 h-4 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              mfg: "T-Motor",
              mpn: "MN4014",
              id: "RUD-MOT-MN4014",
              desc: "400KV Brushless Motor",
              specs: ["6S-12S", "8.2kg Max Thrust"],
              img: "/images/products/rudrastra_motor_1785921295587.png",
              price: "₹8,450"
            },
            {
              mfg: "Holybro",
              mpn: "Pixhawk 6X",
              id: "RUD-FC-PX6X",
              desc: "Pro Autopilot Controller",
              specs: ["STM32H753", "Triple IMU"],
              img: "/images/products/rudrastra_fc_1785921305227.png",
              price: "₹34,200"
            },
            {
              mfg: "Hobbywing",
              mpn: "XRotor 40A",
              id: "RUD-ESC-XR40",
              desc: "4-in-1 BLHeli_32 ESC",
              specs: ["40A Cont.", "3-6S LiPo"],
              img: "/images/products/rudrastra_esc_1785921326270.png",
              price: "₹5,100"
            }
          ].map((prod, i) => (
            <Link key={i} href={`/products/${prod.id}`} className="group bg-white border border-[var(--border)] overflow-hidden flex flex-col hover:border-[#111111] transition-colors duration-fast relative">
              
              {i === 0 && (
                <div className="absolute top-0 left-0 bg-[var(--primary)] text-white font-sans font-bold text-[11px] px-3 py-1.5 z-20">New</div>
              )}

              {/* Compare checkbox mock */}
              <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-fast flex items-center gap-2 bg-white/90 backdrop-blur px-2 py-1 border border-[var(--border)] mt-6">
                <div className="w-3.5 h-3.5 border border-[var(--foreground)]"></div>
                <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-[var(--foreground)]">Compare</span>
              </div>

              {/* Image Container with SLOW scaling */}
              <div className="w-full h-[280px] bg-[#F9F9F9] flex items-center justify-center p-8 overflow-hidden relative">
                <Image 
                  src={prod.img} 
                  alt={`${prod.mfg} ${prod.mpn}`} 
                  width={250} 
                  height={250} 
                  className="object-contain transform group-hover:scale-[1.03] transition-transform duration-slow ease-uncover"
                />
              </div>

              {/* Metadata Container with NORMAL shift (-4px) */}
              <div className="p-6 flex flex-col bg-white transform group-hover:-translate-y-1 transition-transform duration-normal ease-uncover z-20">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="font-sans text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">{prod.mfg}</span>
                    <h3 className="font-heading font-bold text-[18px] text-[var(--foreground)]">{prod.mpn}</h3>
                  </div>
                  <svg className="w-5 h-5 text-[var(--primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="flex gap-3 text-[12px] font-sans text-[var(--muted-foreground)]">
                    {prod.specs.map(spec => <span key={spec}>{spec}</span>)}
                  </div>
                  <span className="font-sans font-bold text-[15px]">{prod.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. COMPATIBILITY INTELLIGENCE (B2B VALUE PROP) */}
      <section className="w-full px-6 lg:px-10 py-24 bg-[#111111] text-white overflow-hidden relative">
        {/* Subtle grid pattern bg */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--primary)] mb-4 block">Compatibility Graph</span>
            <h2 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight mb-6 text-white">
              <span className="text-[var(--primary)]">Validate</span> before <span className="text-[var(--success)]">you build.</span>
            </h2>
            <p className="font-sans text-[16px] text-[#A0A0A0] leading-relaxed max-w-lg mb-10">
              Check electrical bounds, mechanical mounts, and protocol compatibility across your entire component stack instantly.
            </p>
            <Link href="/compatibility" className="group inline-flex items-center gap-3 bg-white text-black font-sans font-bold px-7 py-3.5 hover:bg-[var(--primary)] hover:text-white transition-colors duration-fast">
              Run System Check
              <svg className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Interactive Terminal/Validator Mock */}
          <div className="bg-[#1A1A1A] border border-[#333] p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)]"></div>
            
            <div className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#666] mb-6 flex justify-between">
              <span>System Validator</span>
              <span className="text-[var(--success)]">Live</span>
            </div>

            <div className="space-y-4 font-mono text-[13px]">
              <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both delay-100">
                <span className="text-[var(--success)] mt-0.5">✓</span>
                <div>
                  <div className="text-white">Electrical</div>
                  <div className="text-[#888] mt-1">Voltage ranges overlap (6S 22.2V - 25.2V).</div>
                </div>
              </div>
              <div className="w-px h-4 bg-[#333] ml-[5px] animate-in fade-in duration-500 fill-mode-both delay-200"></div>
              
              <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both delay-300">
                <span className="text-[var(--success)] mt-0.5">✓</span>
                <div>
                  <div className="text-white">Protocol</div>
                  <div className="text-[#888] mt-1">DSHOT600 supported by both FC and ESC.</div>
                </div>
              </div>
              <div className="w-px h-4 bg-[#333] ml-[5px] animate-in fade-in duration-500 fill-mode-both delay-400"></div>

              <div className="flex items-start gap-4 p-3 bg-yellow-500/10 border border-yellow-500/20 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both delay-500">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                <div>
                  <div className="text-yellow-500 font-bold">Mechanical Firmware</div>
                  <div className="text-[#888] mt-1">PX4 v1.15+ required for exact telemetry mapping.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MANUFACTURERS GRID */}
      <section className="w-full px-6 lg:px-10 py-20 bg-white border-b border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <h2 className="font-heading font-bold text-[32px] tracking-tight text-[var(--foreground)]"><span className="text-[var(--accent)]">Canonical</span> Manufacturers</h2>
          <Link href="/manufacturers" className="group hidden md:inline-flex items-center gap-2 font-sans font-semibold text-[14px] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 transition-colors duration-fast hover:text-[var(--primary)] hover:border-[var(--primary)]">
            All manufacturers
            <svg className="w-4 h-4 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["T-Motor", "Hobbywing", "Holybro", "Matek Systems", "Foxeer", "Radiomaster", "Skydroid", "KDE Direct"].map((mfg) => (
            <Link key={mfg} href={`/manufacturers/${mfg.toLowerCase().replace(/ /g, '-')}`} className="group bg-[#FAFAFA] border border-transparent p-6 hover:border-[#111111] hover:bg-white transition-all duration-fast flex justify-between items-center">
              <span className="font-heading font-bold text-[16px] transform transition-transform duration-fast group-hover:-translate-y-0.5">{mfg}</span>
              <svg className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ))}
        </div>
      </section>
      
      {/* 5.5. REVIEWS / TESTIMONIALS */}
      <section className="w-full py-24 bg-[#FAFAFA] border-b border-t border-[var(--border)] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--primary)] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center mb-16 px-6">
          <h2 className="font-heading font-extrabold text-[36px] tracking-tight mb-4 text-[var(--foreground)]"><span className="text-[var(--primary)]">Trusted</span> by Indian Defense & <span className="text-[var(--accent)]">Commercial Operators</span>.</h2>
          <p className="font-sans text-[16px] text-[var(--muted-foreground)]">
            Procurement engineers rely on Rudrastra's canonical hardware graph for accurate technical sourcing.
          </p>
        </div>

        {/* Row 1: Scrolling Left */}
        <div className="w-full relative flex mb-6 group before:absolute before:left-0 before:top-0 before:bottom-0 before:w-32 before:bg-gradient-to-r before:from-[#FAFAFA] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-32 after:bg-gradient-to-l after:from-[#FAFAFA] after:to-transparent after:z-10">
          <div className="flex animate-[infinite-scroll-left_40s_linear_infinite] group-hover:[animation-play-state:paused] shrink-0">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 px-3 shrink-0">
                {[
                  { quote: "The compatibility graph saved us hours. We no longer have to cross-reference multiple PDFs to check ESC and Motor pairing.", author: "Lead Engineer", company: "Aerospace Defence Labs" },
                  { quote: "We source our entire prototyping BOM directly through Rudrastra. Lead times are accurate and localized.", author: "Procurement Head", company: "National Drone Corp" },
                  { quote: "Finally, a platform built for hardware engineers instead of hobbyists. The CAD models and datasheets are perfectly organized.", author: "Hardware Architect", company: "Vayu Dynamics" },
                  { quote: "Rudrastra's RFQ process reduced our sourcing turnaround from weeks to just 48 hours for large military orders.", author: "Supply Chain Manager", company: "Tactical UAV Systems" }
                ].map((review, j) => (
                  <div key={j} className="w-[400px] shrink-0 bg-white border border-[var(--border)] p-8 flex flex-col justify-between h-[200px] hover:border-black transition-colors duration-fast">
                    <p className="font-sans text-[15px] leading-relaxed text-[var(--foreground)]">"{review.quote}"</p>
                    <div className="flex flex-col mt-4">
                      <span className="font-sans font-bold text-[14px]">{review.author}</span>
                      <span className="font-sans text-[13px] text-[var(--muted-foreground)]">{review.company}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="w-full relative flex group before:absolute before:left-0 before:top-0 before:bottom-0 before:w-32 before:bg-gradient-to-r before:from-[#FAFAFA] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-32 after:bg-gradient-to-l after:from-[#FAFAFA] after:to-transparent after:z-10">
          <div className="flex animate-[infinite-scroll-right_40s_linear_infinite] group-hover:[animation-play-state:paused] shrink-0">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 px-3 shrink-0">
                {[
                  { quote: "Having canonical MPNs and proper stock tracking from multiple Indian vendors is a game-changer.", author: "R&D Director", company: "Skywatch Technologies" },
                  { quote: "The transparency in pricing and technical validation checks prevented two major procurement errors last quarter.", author: "Chief Technical Officer", company: "Garuda Aerial Ops" },
                  { quote: "We manufacture indigenous flight controllers, and listing them on Rudrastra instantly connected us with B2B buyers.", author: "Founder", company: "Indigenous Flight Systems" },
                  { quote: "I can upload an entire spreadsheet BOM and get matching components in seconds. Extremely efficient.", author: "Integration Engineer", company: "AeroIndia Systems" }
                ].map((review, j) => (
                  <div key={j} className="w-[400px] shrink-0 bg-white border border-[var(--border)] p-8 flex flex-col justify-between h-[200px] hover:border-black transition-colors duration-fast">
                    <p className="font-sans text-[15px] leading-relaxed text-[var(--foreground)]">"{review.quote}"</p>
                    <div className="flex flex-col mt-4">
                      <span className="font-sans font-bold text-[14px]">{review.author}</span>
                      <span className="font-sans text-[13px] text-[var(--muted-foreground)]">{review.company}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. B2B PROCUREMENT PIPELINE */}
      <section className="w-full px-6 lg:px-10 py-24 bg-[#FAFAFA] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-heading font-extrabold text-[36px] tracking-tight mb-4 text-[var(--foreground)]">Turn your <span className="text-[var(--primary)]">BOM</span> into a <span className="text-[var(--success)]">procurement plan.</span></h2>
          <p className="font-sans text-[16px] text-[var(--muted-foreground)]">
            Upload your CSV. We match components to our canonical graph, aggregate supplier offers, and generate an RFQ instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-px bg-[var(--border)] z-0"></div>

          {[
            { step: "01", title: "Upload BOM", desc: "CSV containing manufacturer and MPNs." },
            { step: "02", title: "Parse & Match", desc: "Maps directly to canonical definitions." },
            { step: "03", title: "Compare Sellers", desc: "Evaluate lead time, MOQ, and terms." },
            { step: "04", title: "Generate RFQ", desc: "Submit directly to supplier network." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 bg-white border-2 border-[var(--foreground)] flex items-center justify-center font-heading font-bold text-[18px] mb-6">
                {item.step}
              </div>
              <h4 className="font-sans font-bold text-[16px] mb-2">{item.title}</h4>
              <p className="font-sans text-[13px] text-[var(--muted-foreground)] max-w-[180px]">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Link href="/bom" className="group inline-flex items-center gap-2 bg-[var(--foreground)] text-white font-sans font-bold px-8 py-3.5 hover:bg-[var(--primary)] transition-all duration-fast relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Upload BOM
              <svg className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* 7. ENGINEERING RESOURCES */}
      <section className="w-full px-6 lg:px-10 py-24 bg-white border-b border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-heading font-bold text-[32px] tracking-tight mb-3 text-[var(--foreground)]"><span className="text-[var(--accent)]">Engineering</span> Resources</h2>
            <p className="font-sans text-[15px] text-[var(--muted-foreground)] max-w-xl">
              Technical documentation, calculators, and system architecture guides.
            </p>
          </div>
          <Link href="/engineering" className="group hidden md:inline-flex items-center gap-2 font-sans font-semibold text-[14px] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 mt-6 transition-colors duration-fast hover:text-[var(--primary)] hover:border-[var(--primary)]">
            View all resources
            <svg className="w-4 h-4 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tag: "Calculator", title: "Motor KV Selection Engine", desc: "Calculate optimal RPM based on payload weight, propeller pitch, and voltage." },
            { tag: "Guide", title: "Drone Electrical Architecture", desc: "Reference schematics for redundant power delivery in heavy-lift UAVs." },
            { tag: "Reference", title: "Telemetry Protocol Matrix", desc: "Cross-compatibility table for Mavlink, CRSF, and SBUS implementations." }
          ].map((res, i) => (
            <Link key={i} href="/engineering" className="group p-8 border border-[var(--border)] bg-[#FAFAFA] hover:bg-white hover:border-[#111] transition-colors duration-fast flex flex-col h-full">
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] mb-4">{res.tag}</span>
              <h3 className="font-heading font-bold text-[20px] mb-3 text-[var(--foreground)] leading-tight">{res.title}</h3>
              <p className="font-sans text-[14px] text-[var(--muted-foreground)] leading-relaxed mt-auto">{res.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER (TECHNICAL) */}
      <section className="w-full px-6 lg:px-10 py-20 bg-[#111] text-white flex flex-col items-center text-center">
        <h2 className="font-heading font-bold text-[32px] tracking-tight mb-4">Stay ahead of the <span className="text-[var(--accent)]">hardware stack.</span></h2>
        <p className="font-sans text-[15px] text-[#A0A0A0] max-w-md mb-8">
          Weekly updates on new canonical components, firmware compatibility notes, and supply chain lead times.
        </p>
        <div className="flex w-full max-w-md relative group">
          <input 
            type="email" 
            placeholder="engineering@company.com" 
            className="w-full h-[56px] pl-6 pr-32 bg-[#1A1A1A] border border-[#333] font-sans text-[14px] text-white focus:outline-none focus:border-[var(--primary)] transition-colors duration-fast placeholder:text-[#555]"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-white text-black font-sans font-bold text-[13px] px-6 hover:bg-[var(--primary)] hover:text-white transition-all duration-fast">
            Subscribe
          </button>
        </div>
      </section>
      
    </div>
  );
}
