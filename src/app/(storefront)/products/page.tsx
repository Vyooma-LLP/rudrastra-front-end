"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CapabilityGuard } from "@/components/layout/CapabilityGuard";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => {
      if (data.products) setProducts(data.products);
    }).catch(console.error);
  }, []);

  return (
    <CapabilityGuard featureKey="catalog.products">
      <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* 1. HERO & SEARCH */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <span className="font-sans text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mb-4 block">
          Drone Hardware Catalog
        </span>
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
          Find the exact <span className="text-[var(--primary)]">component.</span>
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl mb-8">
          Search by manufacturer, MPN, specification, category or engineering requirement.
        </p>

        {/* Large Search Input */}
        <CapabilityGuard featureKey="engineering.search" hideCompletely>
          <div className="w-full max-w-4xl relative flex items-center group">
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
              className="absolute right-2 top-2 bottom-2 bg-[var(--foreground)] text-white font-sans font-semibold text-[14px] px-8 hover:bg-[var(--primary)] transition-colors duration-fast flex items-center gap-2 group/btn"
            >
              Search
              <svg className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </CapabilityGuard>

        {/* Popular Tags */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] font-sans text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--foreground)]">Popular:</span>
          <span className="hover:text-[var(--primary)] cursor-pointer transition-colors duration-fast">MN4014</span>
          <span>·</span>
          <span className="hover:text-[var(--primary)] cursor-pointer transition-colors duration-fast">Pixhawk 6X</span>
          <span>·</span>
          <span className="hover:text-[var(--primary)] cursor-pointer transition-colors duration-fast">45A ESC</span>
          <span>·</span>
          <span className="hover:text-[var(--primary)] cursor-pointer transition-colors duration-fast">M10 GNSS</span>
          <span>·</span>
          <span className="hover:text-[var(--primary)] cursor-pointer transition-colors duration-fast">6S LiPo</span>
        </div>
      </section>

      {/* 2. MAIN CATALOG LAYOUT */}
      <section className="w-full px-6 lg:px-10 py-12 flex flex-col md:flex-row gap-10">
        
        {/* LEFT: ENGINEERING FILTERS */}
        <CapabilityGuard featureKey="engineering.search" fallback={<aside className="w-full md:w-[280px] shrink-0 p-4 border border-red-200 bg-red-50 text-red-600 rounded text-sm font-bold">Engineering Search Filters Offline</aside>}>
          <aside className="w-full md:w-[280px] shrink-0">
            <h2 className="font-heading font-bold text-[18px] mb-6">Filters</h2>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="font-sans text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Category</h3>
              <div className="flex flex-wrap gap-2">
                {["Propulsion", "Flight Control", "Power", "Compute & AI", "Airframe", "Communication"].map((item, i) => (
                  <label key={i} className={`flex items-center px-3 py-1.5 cursor-pointer border transition-colors duration-fast ${i === 0 ? 'bg-black text-white border-black' : 'bg-white border-[var(--border)] text-[var(--foreground)] hover:bg-[#F5F5F5]'}`}>
                    <span className="font-sans text-[13px] font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Electrical Filter */}
            <div className="mb-8 border-t border-[var(--border)] pt-6">
              <h3 className="font-sans text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Electrical</h3>
              <div className="flex flex-wrap gap-2">
                {["Voltage", "Current", "KV", "Power", "Capacity"].map((item, i) => (
                  <label key={i} className="flex items-center px-3 py-1.5 cursor-pointer bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[#F5F5F5] transition-colors duration-fast">
                    <span className="font-sans text-[13px] font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interface Filter */}
            <div className="mb-8 border-t border-[var(--border)] pt-6">
              <h3 className="font-sans text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Interface</h3>
              <div className="flex flex-wrap gap-2">
                {["CAN", "UART", "I2C", "SPI", "PWM", "Ethernet"].map((item, i) => (
                  <label key={i} className="flex items-center px-3 py-1.5 cursor-pointer bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[#F5F5F5] transition-colors duration-fast">
                    <span className="font-sans text-[13px] font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Commercial Filter */}
            <div className="mb-8 border-t border-[var(--border)] pt-6">
              <h3 className="font-sans text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Commercial</h3>
              <div className="flex flex-wrap gap-2">
                {["Price", "MOQ", "Lead time", "Stock"].map((item, i) => (
                  <label key={i} className="flex items-center px-3 py-1.5 cursor-pointer bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[#F5F5F5] transition-colors duration-fast">
                    <span className="font-sans text-[13px] font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
        </CapabilityGuard>

        {/* RIGHT: RESULTS GRID */}
        <div className="flex-1">
          {/* Results header */}
          <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
            <span className="font-sans font-bold text-[14px]">1,284 COMPONENTS</span>
            <div className="flex items-center gap-2 font-sans text-[14px]">
              <span className="text-[var(--muted-foreground)]">Sort:</span>
              <select className="bg-transparent font-semibold focus:outline-none cursor-pointer">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>KV: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {products.map((prod: any, i: number) => (
              <Link key={i} href={`/products/${prod.id}`} className="group bg-white border border-[var(--border)] overflow-hidden flex flex-col hover:border-[#111111] transition-colors duration-fast relative h-full">
                
                {/* COMPARE CHECKBOX HOVER */}
                <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-fast flex items-center gap-2 bg-white/90 backdrop-blur px-2 py-1 border border-[var(--border)] cursor-pointer hover:bg-black hover:text-white group/check">
                  <div className="w-3.5 h-3.5 border border-[var(--foreground)] group-hover/check:border-white"></div>
                  <span className="font-sans text-[11px] font-semibold tracking-wider uppercase">Compare</span>
                </div>

                {/* IMAGE */}
                <div className="w-full h-[240px] bg-white flex items-center justify-center p-6 overflow-hidden relative border-b border-[var(--border)]">
                  <Image 
                    src={prod.imageUrl || "/images/products/rudrastra_motor_1785921295587.png"} 
                    alt={`${prod.title} ${prod.mpn || ''}`} 
                    width={200} 
                    height={200} 
                    className="object-contain transform group-hover:scale-[1.03] transition-transform duration-slow ease-uncover"
                  />
                </div>

                {/* METADATA */}
                <div className="p-5 flex flex-col flex-1 transform group-hover:-translate-y-1 transition-transform duration-normal ease-uncover z-10 bg-white">
                  <span className="font-sans text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 px-2 py-0.5 bg-[#F5F5F5] self-start">{prod.category}</span>
                  
                  <div className="flex justify-between items-start mt-2 mb-1">
                    <h3 className="font-heading font-bold text-[18px] text-[var(--foreground)]">{prod.mpn || prod.title}</h3>
                    <svg className="w-5 h-5 text-[var(--primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  
                  <p className="font-sans text-[13px] text-[var(--muted-foreground)] mb-4">{prod.description}</p>
                  
                  {/* Price & Commercials */}
                  <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-end">
                    <div>
                      <div className="font-heading font-bold text-[18px] leading-none mb-1">{(prod.price/100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
                      <div className="font-sans text-[11px] text-[var(--muted-foreground)]">3 verified sellers</div>
                    </div>
                    <div className="flex items-center gap-1.5 font-sans text-[11px] font-semibold text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      In Stock
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 border border-[var(--border)] flex items-center justify-center hover:border-[#111] transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {[1, 2, 3].map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-10 h-10 border flex items-center justify-center font-sans font-bold text-[13px] transition-colors duration-fast ${currentPage === p ? 'border-[#111] bg-[#111] text-white' : 'border-[var(--border)] hover:border-[#111]'}`}
                >
                  {p}
                </button>
              ))}
              <span className="mx-2 text-[var(--muted-foreground)]">...</span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-10 h-10 border border-[var(--border)] flex items-center justify-center hover:border-[#111] transition-colors duration-fast"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </CapabilityGuard>
  );
}
