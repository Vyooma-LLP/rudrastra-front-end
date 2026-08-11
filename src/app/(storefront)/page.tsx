"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* 1. HERO + ENGINEERING SEARCH */}
      <section className="w-full px-6 lg:px-[72px] pt-[50px] pb-16 md:pt-[70px] md:pb-24 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 indian-engineering-line"></div>
        
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 mb-16 relative">
          <h1 className="font-heading font-extrabold text-[44px] md:text-[64px] lg:text-[80px] leading-[1] tracking-tighter text-left shrink-0">
            <span className="block">
              <span className="text-[var(--primary)]">India&apos;s</span> <span className="text-[var(--foreground)]">Drone</span>
            </span>
            <span className="block text-[var(--accent)]">Hardware</span>
            <span className="block text-[var(--success)]">Marketplace.</span>
          </h1>
          <Image 
            src="/images/make-in-india.png" 
            alt="Make in India" 
            width={545} 
            height={380} 
            className="w-auto h-[160px] md:h-[220px] lg:h-[260px] object-contain shrink-0" 
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8 text-center">
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

        <p className="font-sans text-[16px] md:text-[20px] text-[var(--muted-foreground)] max-w-3xl text-center mb-10 leading-relaxed">
          Find, evaluate, compare, and procure canonical engineering components for UAVs.
        </p>

        {/* Large Engineering Search Input */}
        <div className="w-full max-w-3xl relative flex items-center group mx-auto">
          <svg className="absolute left-5 w-5 h-5 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`; }}
            placeholder="Search MPN, manufacturer, KV, voltage, protocol..."
            className="w-full h-[64px] pl-14 pr-[120px] bg-white border border-[var(--border)] font-sans text-[16px] focus:outline-none focus:border-[var(--foreground)] transition-colors duration-fast placeholder:text-[var(--muted-foreground)] focus:placeholder:opacity-50"
          />
          <button
            onClick={() => { if (searchQuery.trim()) window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`; }}
            className="absolute right-2 top-2 bottom-2 bg-[var(--foreground)] text-white font-sans font-semibold text-[14px] px-6 hover:bg-[var(--primary)] transition-all duration-fast flex items-center gap-2 group/btn"
          >
            Search
            <svg className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Popular searches */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[13px] font-sans text-[var(--muted-foreground)] text-center mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[var(--border)] border border-[var(--border)]">
          {[
            { id: "01", name: "Airframe & Propulsion", sub: "Motors · ESCs · Propellers · Frames" },
            { id: "02", name: "Flight Control", sub: "Flight Controllers · Autopilots · IMUs" },
            { id: "03", name: "Power", sub: "Batteries · BMS · PDB · BEC" },
            { id: "04", name: "Communication", sub: "Telemetry · RC · ELRS · Antennas" },
            { id: "05", name: "Navigation", sub: "GNSS · RTK · Optical Flow · Rangefinders" },
            { id: "06", name: "Payload & Sensors", sub: "Cameras · Thermal · LiDAR · Gimbals" },
          ].map((cat, i) => (
            <Link key={cat.id} href={`/categories/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="group relative p-6 flex flex-col transition-colors duration-fast h-[160px] bg-white hover:bg-[var(--primary)]">
              <div className="flex justify-between items-start mb-4">
                <span className="font-sans text-[12px] text-[var(--muted-foreground)] group-hover:text-white">{cat.id}</span>
                <span className="font-sans text-[12px] font-bold text-[var(--foreground)] group-hover:text-white transition-colors duration-fast">Explore &rarr;</span>
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
              mpn: "MN4014-400KV",
              id: "RUD-MOT-MN4014",
              desc: "MN4014 Brushless Motor",
              specs: ["400 KV", "6S-12S", "8.2kg thrust"],
              img: "/images/products/rudrastra_motor_1785921295587.png",
              price: "₹8,450",
              isIndian: false
            },
            {
              mfg: "Darkmatter",
              mpn: "DM-FC-H7-PRO",
              id: "RUD-FC-DM-H7",
              desc: "H7 Pro Autopilot",
              specs: ["STM32H7", "Triple IMU", "CAN"],
              img: "/images/products/rudrastra_fc_1785921305227.png",
              price: "₹28,500",
              isIndian: true
            },
            {
              mfg: "Hobbywing",
              mpn: "XR-40A-G2",
              id: "RUD-ESC-XR40",
              desc: "XRotor 40A 4-in-1 ESC",
              specs: ["40A Cont.", "3-6S LiPo", "DSHOT600"],
              img: "/images/products/rudrastra_esc_1785921326270.png",
              price: "₹5,100",
              isIndian: false
            }
          ].map((prod, i) => (
            <Link key={i} href={`/products/${prod.id}`} className="group bg-white border border-[var(--border)] overflow-hidden flex flex-col hover:border-[#111111] transition-colors duration-fast relative">
              
              <div className="absolute top-0 left-0 bg-[var(--primary)] text-white font-sans font-bold text-[10px] tracking-widest px-3 py-1.5 z-20 flex items-center gap-2">
                <span>✓ VERIFIED SPEC</span>
                {prod.isIndian ? <span className="text-xs">🇮🇳 MADE IN INDIA</span> : <span className="text-xs">GLOBAL COMPONENT</span>}
              </div>

              {/* Compare checkbox mock */}
              <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-fast flex items-center gap-2 bg-white/90 backdrop-blur px-2 py-1 border border-[var(--border)] mt-6">
                <div className="w-3.5 h-3.5 border border-[var(--foreground)] flex items-center justify-center font-bold text-[10px]">+</div>
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
              <div className="p-6 flex flex-col bg-white transform group-hover:-translate-y-1 transition-transform duration-normal ease-uncover z-20 h-full">
                <div className="flex flex-col mb-4">
                  <span className="font-sans text-[12px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">{prod.mfg}</span>
                  <h3 className="font-heading font-bold text-[18px] text-[var(--foreground)] leading-tight mb-1">{prod.desc}</h3>
                  <p className="font-sans text-[13px] text-[var(--muted-foreground)]">MPN: {prod.mpn}</p>
                </div>
                
                <div className="flex gap-4 text-[12px] font-sans text-[var(--foreground)] border-t border-[var(--border)] pt-4 mb-4">
                  {prod.specs.map(spec => <span key={spec}>{spec}</span>)}
                </div>

                <div className="mt-auto flex flex-col gap-1">
                  <span className="font-sans font-bold text-[16px] text-[var(--foreground)]">{prod.price}</span>
                  <span className="font-sans text-[13px] text-[var(--muted-foreground)]">Multiple sellers available</span>
                  <span className="font-sans text-[12px] font-semibold text-[var(--success)] mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--success)] inline-block"></span>
                    Live Stock: Available
                  </span>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
                  <span className="font-sans text-[12px] font-bold text-[var(--foreground)]">View Specs</span>
                  <span className="font-sans text-[12px] font-bold text-[var(--foreground)]">Compare</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3.5. B2B PROCUREMENT PIPELINE */}
      <section className="w-full px-6 lg:px-10 py-24 bg-[#FAFAFA] border-b border-[var(--border)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
          <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--accent)] mb-4 block">PROCUREMENT AUTOMATION</span>
          <h2 className="font-heading font-extrabold text-[36px] tracking-tight mb-4 text-[var(--foreground)]">Turn your <span className="text-[var(--primary)]">BOM</span> into a <span className="text-[var(--success)]">procurement plan.</span></h2>
          <p className="font-sans text-[16px] text-[var(--muted-foreground)]">
            Upload your spreadsheet. We match components to our canonical graph, aggregate supplier offers, and generate an RFQ instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto relative z-10">
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-px bg-[var(--border)] z-0"></div>

          {[
            { step: "01", title: "Upload BOM", desc: "CSV containing manufacturer and MPNs." },
            { step: "02", title: "Parse & Match", desc: "Maps directly to canonical engineering definitions." },
            { step: "03", title: "Compare Sellers", desc: "Evaluate real-time lead times, MOQs, and terms." },
            { step: "04", title: "Generate RFQ", desc: "Submit directly to our Indian supplier network." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-14 h-14 bg-white border-2 border-[var(--border)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] transition-colors duration-fast flex items-center justify-center font-heading font-bold text-[18px] mb-6 shadow-sm">
                {item.step}
              </div>
              <h4 className="font-sans font-bold text-[16px] mb-2 text-[var(--foreground)]">{item.title}</h4>
              <p className="font-sans text-[13px] text-[var(--muted-foreground)] max-w-[200px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center relative z-10">
          <Link href="/bom" className="group inline-flex items-center gap-2 bg-[var(--foreground)] text-white font-sans font-bold px-8 py-4 hover:bg-[var(--primary)] transition-all duration-fast relative overflow-hidden">
            <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-fast"></span>
            <span className="relative z-10 flex items-center gap-2">
              Upload BOM (CSV)
              <svg className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
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
              Check compatibility
              <svg className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Interactive Tree Graph Mock */}
          <div className="bg-[#1A1A1A] border border-[#333] p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)]"></div>
            
            <div className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#666] mb-8 flex justify-between">
              <span>System Validator</span>
              <span className="text-[var(--success)]">Live</span>
            </div>

            <div className="font-mono text-[14px] flex flex-col gap-4">
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-500 fill-mode-both">
                <span className="font-bold text-white uppercase tracking-wider text-[12px] w-24">MOTOR</span>
                <span className="text-[#CCC]">T-Motor MN4014</span>
              </div>
              <div className="flex items-center gap-4 ml-6 animate-in fade-in slide-in-from-top-2 duration-500 fill-mode-both delay-100">
                <span className="text-[#666]">│</span>
              </div>
              <div className="flex items-center gap-4 ml-6 animate-in fade-in slide-in-from-left-2 duration-500 fill-mode-both delay-200">
                <span className="text-[#666]">├──</span>
                <span className="text-[var(--success)] flex-shrink-0">✓</span>
                <span className="font-bold text-white uppercase tracking-wider text-[12px] w-20">ESC</span>
                <span className="text-[#888]">Hobbywing 40A</span>
              </div>
              <div className="flex items-center gap-4 ml-6 animate-in fade-in slide-in-from-left-2 duration-500 fill-mode-both delay-300">
                <span className="text-[#666]">├──</span>
                <span className="text-[var(--success)] flex-shrink-0">✓</span>
                <span className="font-bold text-white uppercase tracking-wider text-[12px] w-20">BATTERY</span>
                <span className="text-[#888]">Tattu 6S 10000mAh</span>
              </div>
              <div className="flex items-center gap-4 ml-6 animate-in fade-in slide-in-from-left-2 duration-500 fill-mode-both delay-400">
                <span className="text-[#666]">├──</span>
                <span className="text-[var(--success)] flex-shrink-0">✓</span>
                <span className="font-bold text-white uppercase tracking-wider text-[12px] w-20">PROPELLER</span>
                <span className="text-[#888]">P22x6.6&quot;</span>
              </div>
              <div className="flex items-center gap-4 ml-6 p-2 bg-yellow-500/10 border border-yellow-500/20 animate-in fade-in slide-in-from-left-2 duration-500 fill-mode-both delay-500">
                <span className="text-[#666]">└──</span>
                <span className="text-yellow-500 flex-shrink-0">⚠</span>
                <span className="font-bold text-yellow-500 uppercase tracking-wider text-[12px] w-32">FLIGHT CONTROLLER</span>
                <span className="text-[#888] text-[12px]">Check firmware</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MANUFACTURERS GRID */}
      <section className="w-full px-6 lg:px-10 py-20 bg-white border-b border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--success)] mb-4 block">BUILT IN INDIA</span>
            <h2 className="font-heading font-bold text-[32px] tracking-tight text-[var(--foreground)]"><span className="text-[var(--accent)]">Indian</span> Manufacturers</h2>
          </div>
          <Link href="/manufacturers" className="group hidden md:inline-flex items-center gap-2 font-sans font-semibold text-[14px] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 transition-colors duration-fast hover:text-[var(--primary)] hover:border-[var(--primary)]">
            Explore manufacturer ecosystem
            <svg className="w-4 h-4 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Darkmatter", category: "Flight Controllers · ESCs", loc: "West Bengal, India", isIndian: true, products: 24 },
            { name: "T-Motor", category: "Propulsion Systems", loc: "Nanchang, China", isIndian: false, products: 182 },
            { name: "AeroIndia Systems", category: "Airframes", loc: "Bangalore, India", isIndian: true, products: 12 },
            { name: "Holybro", category: "Autopilots · Telemetry", loc: "Shenzhen, China", isIndian: false, products: 56 }
          ].map((mfg) => (
            <Link key={mfg.name} href={`/manufacturers/${mfg.name.toLowerCase().replace(/ /g, '-')}`} className="group bg-[#FAFAFA] border border-transparent p-6 hover:border-[#111111] hover:bg-white transition-all duration-fast flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-[20px] text-[var(--foreground)] transform transition-transform duration-fast group-hover:-translate-y-0.5">{mfg.name}</h3>
                  {mfg.isIndian && <span className="text-lg">🇮🇳</span>}
                </div>
                <div className="font-sans text-[12px] font-bold text-[var(--success)] flex items-center gap-1.5 mb-4">
                  <span className="w-3 h-3 rounded-full bg-[var(--success)]/20 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span></span>
                  Manufacturer
                </div>
                <p className="font-sans text-[13px] text-[var(--foreground)]">{mfg.category}</p>
                <p className="font-sans text-[13px] text-[var(--muted-foreground)] mt-1">{mfg.loc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--border)] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-[12px] text-[var(--muted-foreground)]">Technical Documentation</span>
                  <span className="font-sans text-[12px] font-semibold text-[var(--success)]">✓ Available</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-[12px] text-[var(--muted-foreground)]">Distributor Network</span>
                  <span className="font-sans text-[12px] font-semibold text-[var(--success)]">✓ Verified</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-sans text-[12px] font-bold text-[var(--foreground)]">Products</span>
                  <span className="font-sans text-[12px] font-bold text-[var(--foreground)]">{mfg.products}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* 5.5. TRUST ARCHITECTURE & ECOSYSTEM SIGNALS */}
      <section className="w-full py-24 bg-[#FAFAFA] border-b border-t border-[var(--border)] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--primary)] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center mb-16 px-6">
          <h2 className="font-heading font-extrabold text-[36px] tracking-tight mb-4 text-[var(--foreground)]">Every Component Has a <span className="text-[var(--primary)]">Source</span>.</h2>
          <p className="font-sans text-[16px] text-[var(--muted-foreground)]">
            Rudrastra is built on a unified engineering schema. We connect you directly with authorized distributors and OEMs.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[var(--border)] p-8 text-center flex flex-col items-center hover:border-black transition-colors duration-fast">
            <div className="w-12 h-12 bg-[#FAFAFA] border border-[var(--border)] rounded-full flex items-center justify-center mb-6">
              <span className="text-[20px]">📋</span>
            </div>
            <h3 className="font-heading font-bold text-[20px] mb-2 text-[var(--foreground)]">Canonical PIM</h3>
            <p className="font-sans text-[14px] text-[var(--muted-foreground)]">Structured technical specifications, CAD models, and manufacturer part numbers.</p>
          </div>
          <div className="bg-white border border-[var(--border)] p-8 text-center flex flex-col items-center hover:border-black transition-colors duration-fast">
            <div className="w-12 h-12 bg-[#FAFAFA] border border-[var(--border)] rounded-full flex items-center justify-center mb-6">
              <span className="text-[20px]">🔗</span>
            </div>
            <h3 className="font-heading font-bold text-[20px] mb-2 text-[var(--foreground)]">Direct Sourcing</h3>
            <p className="font-sans text-[14px] text-[var(--muted-foreground)]">Bypass unverified traders. Access inventory from authorized partners and original manufacturers.</p>
          </div>
          <div className="bg-white border border-[var(--border)] p-8 text-center flex flex-col items-center hover:border-black transition-colors duration-fast">
            <div className="w-12 h-12 bg-[#FAFAFA] border border-[var(--border)] rounded-full flex items-center justify-center mb-6">
              <span className="text-[20px]">🛡️</span>
            </div>
            <h3 className="font-heading font-bold text-[20px] mb-2 text-[var(--foreground)]">Compatibility Graph</h3>
            <p className="font-sans text-[14px] text-[var(--muted-foreground)]">Ensure electrical and mechanical compatibility before finalizing your Bill of Materials.</p>
          </div>
        </div>
      </section>

      {/* 5.6. ENGINEERING CONFIGURATOR (FIND THE RIGHT HARDWARE) */}
      <section className="w-full px-6 lg:px-10 py-24 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full">
            <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--accent)] mb-4 block">COMPONENT MATCHING</span>
            <h2 className="font-heading font-extrabold text-[36px] tracking-tight mb-6 text-[var(--foreground)]">Find the right <span className="text-[var(--primary)]">hardware.</span></h2>
            <p className="font-sans text-[16px] leading-relaxed text-[var(--muted-foreground)] mb-10 max-w-lg">
              Stop guessing. Input your drone&apos;s parameters, and our engineering configurator will filter the canonical graph to find compatible propulsion systems, power distribution, and flight controllers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link href="/configurator" className="bg-[var(--foreground)] text-white font-sans font-bold px-8 py-4 text-center hover:bg-[var(--primary)] transition-colors duration-fast w-full sm:w-auto">
                Launch Configurator
              </Link>
              <Link href="/search" className="border border-[var(--border)] bg-[#FAFAFA] text-[var(--foreground)] font-sans font-bold px-8 py-4 text-center hover:border-[#111] hover:bg-white transition-colors duration-fast w-full sm:w-auto">
                Browse Directory
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full bg-[#FAFAFA] border border-[var(--border)] p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)]"></div>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
                <span className="font-heading font-bold text-[18px]">Payload Requirement</span>
                <span className="font-mono text-[14px] text-[var(--primary)] font-bold">5.0 KG</span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
                <span className="font-heading font-bold text-[18px]">Architecture</span>
                <span className="font-mono text-[14px] text-[var(--accent)] font-bold">HEXACOPTER</span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
                <span className="font-heading font-bold text-[18px]">System Voltage</span>
                <span className="font-mono text-[14px] text-[var(--success)] font-bold">12S LIPO (44.4V)</span>
              </div>
              
              <div className="mt-4 p-4 bg-[var(--success)]/10 border border-[var(--success)]/20">
                <div className="font-sans text-[12px] font-bold text-[var(--success)] mb-2 uppercase tracking-wider">Recommended Propulsion</div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[14px] text-[var(--foreground)]">MN505-S 380KV</span>
                  <span className="font-sans text-[12px] font-bold text-[var(--success)]">✓ 100% MATCH</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-mono text-[14px] text-[var(--foreground)]">FLAME 60A 12S</span>
                  <span className="font-sans text-[12px] font-bold text-[var(--success)]">✓ 100% MATCH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.7. TECHNICAL TRUST */}
      <section className="w-full px-6 lg:px-10 py-16 bg-[#111111] text-white border-b border-[#222]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="flex gap-4">
            <div className="text-[var(--primary)] mt-1">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-heading font-bold text-[16px] mb-1">Defense-Grade Sourcing</h4>
              <p className="font-sans text-[13px] text-[#A0A0A0] leading-relaxed">Vendors undergo strict compliance checks for Indian defense procurement standards.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-[var(--accent)] mt-1">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h4 className="font-heading font-bold text-[16px] mb-1">Authoritative Data</h4>
              <p className="font-sans text-[13px] text-[#A0A0A0] leading-relaxed">No arbitrary seller descriptions. All specifications are strictly governed PIM data.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-[var(--success)] mt-1">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-heading font-bold text-[16px] mb-1">Live Inventory & Quotes</h4>
              <p className="font-sans text-[13px] text-[#A0A0A0] leading-relaxed">Access real-time stock levels and automated volume pricing from Indian distributors.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-white mt-1">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-heading font-bold text-[16px] mb-1">Native CAD Integration</h4>
              <p className="font-sans text-[13px] text-[#A0A0A0] leading-relaxed">Download STEP and IGES files instantly to validate mechanical fit in your assembly.</p>
            </div>
          </div>
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

      {/* 8. FOOTER */}
      <footer className="w-full bg-[#111] text-white">
        <div className="px-6 lg:px-10 py-20 flex flex-col items-center text-center border-b border-[#222]">
          <h2 className="font-heading font-bold text-[32px] tracking-tight mb-4">Stay ahead of the <span className="text-[var(--accent)]">hardware stack.</span></h2>
          <p className="font-sans text-[15px] text-[#A0A0A0] max-w-md mb-8">
            Weekly updates on new canonical components, firmware compatibility notes, and supply chain lead times.
          </p>
          <div className="flex w-full max-w-md relative group">
            <input 
              type="email"
              value={subEmail}
              onChange={e => setSubEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && subEmail.includes('@')) { setSubscribed(true); setSubEmail(''); } }}
              placeholder="engineering@company.com" 
              className="w-full h-[56px] pl-6 pr-32 bg-[#1A1A1A] border border-[#333] font-sans text-[14px] text-white focus:outline-none focus:border-[var(--primary)] transition-colors duration-fast placeholder:text-[#555]"
            />
            {subscribed ? (
              <span className="absolute right-2 top-2 bottom-2 flex items-center px-4 text-green-400 font-bold text-[12px]">✓ Subscribed!</span>
            ) : (
              <button
                onClick={() => { if (subEmail.includes('@')) { setSubscribed(true); setSubEmail(''); } }}
                className="absolute right-2 top-2 bottom-2 bg-white text-black font-sans font-bold text-[13px] px-6 hover:bg-[var(--primary)] hover:text-white transition-all duration-fast"
              >
                Subscribe
              </button>
            )}
          </div>
        </div>

        <div className="px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="col-span-1">
            <Link href="/" className="font-heading font-bold text-[24px] tracking-tight mb-4 block">
              RUDR<span className="text-[var(--primary)]">ASTRA</span>
            </Link>
            <p className="font-sans text-[13px] text-[#A0A0A0] leading-relaxed mb-6">
              India&apos;s canonical drone hardware marketplace and engineering discovery engine.
            </p>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333] transition-colors cursor-pointer">
                <span className="text-[12px]">𝕏</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333] transition-colors cursor-pointer">
                <span className="text-[12px] font-bold">in</span>
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="font-sans text-[12px] font-bold text-white uppercase tracking-wider mb-6">Directory</h4>
            <ul className="flex flex-col gap-3 font-sans text-[14px] text-[#888]">
              <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/manufacturers" className="hover:text-white transition-colors">Manufacturers</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Component Search</Link></li>
              <li><Link href="/bom" className="hover:text-white transition-colors">BOM Procurement</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-sans text-[12px] font-bold text-white uppercase tracking-wider mb-6">Engineering</h4>
            <ul className="flex flex-col gap-3 font-sans text-[14px] text-[#888]">
              <li><Link href="/engineering/calculators" className="hover:text-white transition-colors">System Calculators</Link></li>
              <li><Link href="/engineering/compatibility" className="hover:text-white transition-colors">Compatibility Matrix</Link></li>
              <li><Link href="/engineering/cad" className="hover:text-white transition-colors">CAD Library</Link></li>
              <li><Link href="/engineering/api" className="hover:text-white transition-colors">Developer API</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-sans text-[12px] font-bold text-white uppercase tracking-wider mb-6">Company</h4>
            <ul className="flex flex-col gap-3 font-sans text-[14px] text-[#888]">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/sell" className="hover:text-white transition-colors">Become a Seller</Link></li>
              <li><Link href="/defense" className="hover:text-white transition-colors">Defense & Govt</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="px-6 lg:px-10 py-6 border-t border-[#222] flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left max-w-7xl mx-auto">
          <p className="font-sans text-[12px] text-[#666]">
            © {new Date().getFullYear()} Rudrastra Technologies. All rights reserved.
          </p>
          <div className="flex gap-6 font-sans text-[12px] text-[#666]">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
