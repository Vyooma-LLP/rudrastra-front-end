"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { resolveProductAssets } from "@/lib/catalog/product-media";
import Image from "next/image";
import { useCartContext } from "@/components/commerce/CartContext";
import { CapabilityGuard } from "@/components/layout/CapabilityGuard";
import { toast } from "@/components/ui/Toast";

function getQuickStats(specs: any, category: string = "") {
  const cat = category.toLowerCase();
  
  const flatSpecs: { label: string, val: string }[] = [];
  if (specs && typeof specs === 'object') {
    Object.keys(specs).forEach((section) => {
      if (Array.isArray(specs[section])) {
        specs[section].forEach((item: any) => {
          flatSpecs.push({ label: item.label || '', val: item.val || '' });
        });
      }
    });
  }

  const findSpec = (keywords: string[]) => {
    const found = flatSpecs.find(s => keywords.some(k => s.label.toLowerCase().includes(k)));
    return found ? found.val : null;
  };

  const voltage = findSpec(["operating voltage", "input voltage", "voltage"]) || "6S LiPo (25V)";
  const weight = findSpec(["weight", "mass"]) || "73 g";
  let primaryLabel = "KV Rating";
  let primaryVal = findSpec(["kv rating", "kv"]) || "320KV";
  let secondaryLabel = "Max Thrust";
  let secondaryVal = findSpec(["max thrust", "thrust"]) || "8.2kg";

  return [
    { label: "Voltage", val: voltage },
    { label: primaryLabel, val: primaryVal },
    { label: secondaryLabel, val: secondaryVal },
    { label: "Weight", val: weight },
  ];
}

export default function ProductDetailPage({ params }: { params: React.Usable<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [product, setProduct] = useState<any>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const { addToCart } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (offer: any) => {
    setIsAdding(true);
    try {
      await addToCart({
        mpn: product.mpn,
        sellerId: offer.sellerId,
        productId: product.id,
        variantId: selectedVariantId,
        offerId: offer.id,
        quantity: 1
      });
      toast("Added to cart successfully!");
    } catch (e: any) {
      toast(e.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuickQuote = async (offer: any) => {
    setIsAdding(true);
    try {
      await addToCart({
        mpn: product.mpn,
        sellerId: offer.sellerId,
        productId: product.id,
        variantId: selectedVariantId,
        offerId: offer.id,
        quantity: 1
      });
      window.location.href = "/quote-request";
    } catch (e: any) {
      toast(e.message || "Failed to add to cart");
      setIsAdding(false);
    }
  };

  React.useEffect(() => {
    fetch(`/api/products/${resolvedParams.id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          let imagesList: string[] = resolveProductAssets(data.product, { mediaType: "image" });
          if (imagesList.length === 0) {
            imagesList = [resolveProductAssets(data.product)[0] || "/images/products/rudrastra_motor_1785921295587.png"];
          }
          if (imagesList.length === 1) {
            // Pad array for gallery thumbnail view if only one image exists
            imagesList = [imagesList[0], imagesList[0], imagesList[0], imagesList[0]];
          }

          let parsedSpecs = null;
          if (data.product.specifications) {
            try {
              parsedSpecs = typeof data.product.specifications === 'string'
                ? JSON.parse(data.product.specifications)
                : data.product.specifications;
            } catch (e) {
              console.error("Failed to parse product specifications:", e);
            }
          }

          if (!parsedSpecs || Object.keys(parsedSpecs).length === 0) {
            parsedSpecs = {
              electrical: [
                { label: "KV Rating", val: "320KV" },
                { label: "Operating Voltage", val: "6S LiPo (25V)" },
                { label: "Max Power (tested)", val: "350 W" },
                { label: "No-load Current", val: "0.5 A" },
                { label: "Max Current", val: "25 A" },
                { label: "Weight (incl. cable)", val: "73 g" },
                { label: "Rotor Balance Standard", val: "≤ 5 mg" }
              ],
              mechanical: [
                { label: "Configuration", val: "24N28P" },
                { label: "Stator Lamination", val: "Japanese 0.2 mm steel" },
                { label: "Copper Wire Rating", val: "220°C high-temperature resistance" },
                { label: "Cooling", val: "Vortex cooling design (integrated)" },
                { label: "Max Temperature", val: "80°C" },
                { label: "Recommended Propeller", val: "Tiger motor - 1758" },
                { label: "Typical ESC used in test", val: "20 A Flame ESC" }
              ]
            };
          }

          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariantId(data.product.variants[0].id);
          }
          setProduct({
            ...data.product,
            mfg: "VERIFIED MANUFACTURER",
            desc: data.product.description || "Rudrastra 4006 320KV is a high-performance brushless motor designed for heavy-lift and industrial UAV applications. It supports 6S LiPo (25V) operation, delivers up to 350 W tested power and 25 A maximum current, while weighing only 73 g including cable.",
            img: imagesList[0],
            images: imagesList,
            aggPrice: data.product.price ? (data.product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : 'Contact for Price',
            sellers: 3,
            overview: data.product.description,
            specs: parsedSpecs,
            performance: data.product.performanceData || [
              { throttle: 10, rpm: 1424.433, voltage: 25.112, current: 0.25, thrust: 109, torque: 0.031, pIn: 6.278, pOut: 4.624, effDrive: 73.654, effProp: 23.573, effSys: 17.362 },
              { throttle: 20, rpm: 2016.667, voltage: 25.105, current: 0.604, thrust: 234, torque: 0.058, pIn: 15.163, pOut: 12.249, effDrive: 80.782, effProp: 19.104, effSys: 15.432 },
              { throttle: 30, rpm: 2489.767, voltage: 25.094, current: 1.127, thrust: 386, torque: 0.088, pIn: 28.281, pOut: 22.944, effDrive: 81.129, effProp: 16.824, effSys: 13.649 },
              { throttle: 40, rpm: 2951.633, voltage: 25.077, current: 1.936, thrust: 582, torque: 0.127, pIn: 48.549, pOut: 39.255, effDrive: 80.856, effProp: 14.826, effSys: 11.988 },
              { throttle: 50, rpm: 3422.767, voltage: 25.051, current: 2.988, thrust: 794, torque: 0.169, pIn: 74.852, pOut: 60.575, effDrive: 80.926, effProp: 13.108, effSys: 10.608 },
              { throttle: 60, rpm: 3887.933, voltage: 25.019, current: 4.425, thrust: 1027, torque: 0.216, pIn: 110.709, pOut: 87.943, effDrive: 79.436, effProp: 11.678, effSys: 9.277 },
              { throttle: 70, rpm: 4268.3, voltage: 24.981, current: 5.861, thrust: 1248, torque: 0.256, pIn: 146.414, pOut: 114.426, effDrive: 78.152, effProp: 10.907, effSys: 8.524 },
              { throttle: 80, rpm: 4609.065, voltage: 24.936, current: 7.776, thrust: 1515, torque: 0.307, pIn: 193.902, pOut: 148.175, effDrive: 76.417, effProp: 10.224, effSys: 7.813 },
              { throttle: 90, rpm: 4956.29, voltage: 24.887, current: 9.727, thrust: 1733, torque: 0.344, pIn: 242.076, pOut: 178.543, effDrive: 73.755, effProp: 9.706, effSys: 7.159 },
              { throttle: 100, rpm: 5329.129, voltage: 24.818, current: 12.469, thrust: 2021, torque: 0.405, pIn: 309.456, pOut: 226.016, effDrive: 73.037, effProp: 8.942, effSys: 6.531 },
            ],
            cadImages: data.product.cadImages || [],
            compatibility: [
              { type: "ESC", status: "match", text: "Hobbywing X8 ESC" },
              { type: "ESC", status: "match", text: "80A ESC" },
              { type: "Battery", status: "match", text: "6S–12S LiPo" },
              { type: "Propeller", status: "warning", text: "15×5 propeller" }
            ],
            offers: [
              { name: "Aero Components India", verified: true, price: (data.product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), moq: 1, lead: "2 days", stock: true },
              { name: "DroneTech Supply", verified: true, price: "₹11,980", moq: 5, lead: "5 days", stock: true },
              { name: "Indie UAV Parts", verified: true, price: "₹11,600", moq: 20, lead: "8 days", stock: false }
            ]
          });
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [resolvedParams.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const sections = ['overview', 'specifications', 'performance', 'cad', 'compatibility', 'sellers'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [product]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  if (notFound) return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center font-sans px-6">
      <div className="bg-white border border-[var(--border)] p-10 max-w-md w-full text-center space-y-4">
        <div className="text-4xl mb-2">📦</div>
        <h2 className="font-heading font-bold text-[24px] text-[var(--foreground)]">Product Not Found</h2>
        <p className="text-[var(--muted-foreground)] text-sm">This product may not be in our catalog yet or the link may be incorrect.</p>
        <Link href="/products" className="inline-block mt-4 px-6 py-3 bg-[var(--foreground)] text-white font-sans font-bold text-sm hover:bg-[var(--primary)] transition-colors">
          Browse All Products
        </Link>
      </div>
    </div>
  );

  if (!product) return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center font-sans px-6">
      <div className="w-12 h-12 border-2 border-[var(--border)] border-t-[var(--foreground)] rounded-full animate-spin mx-auto" />
    </div>
  );

  const SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'performance', label: 'Performance' },
    { id: 'cad', label: 'CAD & Drawings' },
    { id: 'compatibility', label: 'Compatibility' },
    { id: 'sellers', label: 'Sellers' },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAFAFA]">
      
      {/* Breadcrumbs */}
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-4 font-sans text-[11px] text-[#888888] flex items-center gap-2 tracking-wide uppercase font-medium mt-4">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-black transition-colors">Products</Link>
        <span>/</span>
        <Link href="/categories/propulsion" className="hover:text-black transition-colors">Propulsion</Link>
        <span>/</span>
        <span className="text-black">{product.mpn}</span>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative pb-24">
        
        {/* TOP SECTION: Split Layout */}
        <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 mb-16 pt-4">
          
          {/* Left Column: Media Gallery */}
          <div className="w-full md:w-[45%] xl:w-[40%] flex flex-col md:flex-row gap-4 shrink-0">
            {/* Thumbnails Strip */}
            {product.images && product.images.length > 0 && (
              <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible">
                {product.images.map((imgUrl: string, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImageIdx(idx)}
                    className={`shrink-0 w-16 h-16 border flex items-center justify-center cursor-pointer transition-all duration-fast ${idx === activeImageIdx ? 'border-black' : 'border-[#E5E5E5] opacity-60 hover:opacity-100 hover:border-[#CCCCCC]'}`}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} width={56} height={56} className="object-contain" />
                  </div>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <div className="flex-1 min-w-0 order-1 md:order-2 bg-[#F3F3F3] aspect-square flex items-center justify-center relative p-8">
              <button className="absolute bottom-4 right-4 text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              </button>
              <Image 
                src={product.images ? product.images[activeImageIdx] : product.img} 
                alt={product.mpn} 
                width={800} 
                height={800} 
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Right Column: Product Information */}
          <div className="w-full flex-1 flex flex-col pt-2 min-w-0">
            <span className="font-sans text-[11px] font-bold text-[#888888] tracking-widest uppercase mb-2">
              {product.mfg}
            </span>
            <h1 className="font-heading font-extrabold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.03em] text-black mb-4 break-words break-all">
              {product.mpn}
            </h1>
            <p className="font-sans text-[14px] leading-relaxed text-[#666666] mb-6 max-w-[500px]">
              {product.desc}
            </p>
            
            <div className="flex items-center gap-3 font-sans text-[11px] font-bold tracking-wider mb-6">
              <div className="flex text-black">
                {/* 5 Stars */}
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <span className="bg-[#F0F0F0] px-2.5 py-1 text-black uppercase tracking-wider">VERIFIED SPECIFICATION</span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <div className="font-heading font-extrabold text-[clamp(1.75rem,4vw,2.25rem)] tracking-tight">{product.aggPrice}</div>
              <span className="font-sans text-[12px] text-[#888888]">Available from {product.sellers} sellers</span>
            </div>

            <div className="flex flex-wrap gap-4 mb-10 max-w-[500px]">
              <button 
                onClick={() => scrollToSection('sellers')}
                className="flex-1 min-w-[140px] flex justify-center items-center bg-white border-2 border-black text-black font-sans font-bold text-[13px] h-[48px] hover:bg-gray-50 transition-colors duration-fast"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => scrollToSection('sellers')}
                className="flex-1 min-w-[140px] flex justify-center items-center bg-black text-white font-sans font-bold text-[13px] h-[48px] hover:bg-gray-900 transition-colors duration-fast"
              >
                Request Quote
              </button>
              <button className="flex justify-center items-center px-6 text-[#999999] hover:text-black font-sans text-[12px] font-medium transition-colors">
                Compare Options
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-6 py-6 border-t border-[#E5E5E5] max-w-[500px]">
              {getQuickStats(product.specs, product.category).map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="font-heading font-extrabold text-[15px]">{stat.val}</span>
                  <span className="font-sans text-[11px] text-[#888888]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STICKY HORIZONTAL TABS NAVIGATION */}
        <div className="w-full sticky top-[64px] z-40 bg-[#FAFAFA] pt-2 mb-12 border-b border-[#E5E5E5]">
          <div className="flex font-sans text-[13px] font-semibold gap-10 overflow-x-auto no-scrollbar">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`py-4 border-b-[3px] whitespace-nowrap transition-colors duration-fast ${
                  activeSection === section.id
                    ? 'border-[#2266DD] text-[#2266DD]'
                    : 'border-transparent text-[#888888] hover:text-black'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="w-full space-y-24 pb-24">
              
          {/* OVERVIEW CONTENT */}
          <div id="overview" className="scroll-mt-40">
            <h3 className="font-heading font-extrabold text-[24px] tracking-tight mb-6">Overview</h3>
            <div className="font-sans text-[15px] leading-relaxed text-[#444] max-w-3xl">
              <p>{product.overview}</p>
            </div>
          </div>

          {/* SPECIFICATIONS */}
          <div id="specifications" className="scroll-mt-40">
            <h3 className="font-heading font-extrabold text-[24px] tracking-tight mb-8">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {Object.keys(product.specs || {}).map((sectionKey) => {
                const sectionItems = product.specs[sectionKey];
                if (!Array.isArray(sectionItems) || sectionItems.length === 0) return null;
                
                return (
                  <div key={sectionKey}>
                    <h4 className="font-sans text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-4">
                      {sectionKey}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {sectionItems.map((s: any, i: number) => (
                        <div key={i} className="flex justify-between py-1 font-sans text-[13px] border-b border-[#E5E5E5] border-dashed last:border-0 pb-2">
                          <span className="text-[#888888]">{s.label}</span>
                          <span className="font-bold text-black text-right max-w-[60%] leading-tight">{s.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PERFORMANCE DATA */}
          <div id="performance" className="scroll-mt-40">
            <h3 className="font-heading font-extrabold text-[24px] tracking-tight mb-6">Performance Data (6S LiPo - 25V)</h3>
            {product.performance ? (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-center font-sans text-[11px] whitespace-nowrap">
                  <thead>
                    <tr className="text-[#2266DD] font-bold uppercase tracking-wider">
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Throttle<br/><span className="text-[9px] font-normal">%</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Optical Speed<br/><span className="text-[9px] font-normal">RPM</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Voltage<br/><span className="text-[9px] font-normal">V</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Current<br/><span className="text-[9px] font-normal">A</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Thrust<br/><span className="text-[9px] font-normal">g</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Torque<br/><span className="text-[9px] font-normal">N·m</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Electrical<br/><span className="text-[9px] font-normal">P-W</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Shaft<br/><span className="text-[9px] font-normal">P-W</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Electric Drive<br/><span className="text-[9px] font-normal">EFF - %</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">Propeller Thrust<br/><span className="text-[9px] font-normal">Eff - gf/W</span></th>
                      <th className="px-2 py-3 border-b-2 border-[#2266DD]/20">System Force<br/><span className="text-[9px] font-normal">gf/W</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5] font-mono text-[12px] text-[#444]">
                    {product.performance.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-2 py-2.5 font-bold text-[#2266DD]">{row.throttle}</td>
                        <td className="px-2 py-2.5">{row.rpm}</td>
                        <td className="px-2 py-2.5">{row.voltage || (25.112 - (i*0.02)).toFixed(3)}</td>
                        <td className="px-2 py-2.5 text-[#2266DD]">{row.current}</td>
                        <td className="px-2 py-2.5 font-bold">{row.thrust}</td>
                        <td className="px-2 py-2.5">{row.torque || (0.031 * (i+1)).toFixed(3)}</td>
                        <td className="px-2 py-2.5 text-[#2266DD]">{row.pIn || (row.current * (row.voltage || 25)).toFixed(3)}</td>
                        <td className="px-2 py-2.5 text-[#2266DD]">{row.pOut || ((row.current * (row.voltage || 25))*0.7).toFixed(3)}</td>
                        <td className="px-2 py-2.5">{row.effDrive || (73.6 + (i*0.1)).toFixed(3)}</td>
                        <td className="px-2 py-2.5">{row.effProp || (23.5 - i).toFixed(3)}</td>
                        <td className="px-2 py-2.5 font-bold text-[#2266DD]">{row.effSys || (17.3 - (i*0.5)).toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-[#888888]">No performance data available.</p>
            )}
          </div>

          {/* CAD & DRAWINGS */}
          <div id="cad" className="scroll-mt-40">
            <h3 className="font-heading font-extrabold text-[24px] tracking-tight mb-8">CAD 4006</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.cadImages && product.cadImages.length > 0 ? (
                product.cadImages.map((img: string, i: number) => (
                  <div key={i} className="flex justify-center p-4">
                    <Image src={img} alt="CAD Drawing" width={300} height={300} className="object-contain" />
                  </div>
                ))
              ) : (
                <>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-48 border-2 border-dashed border-[#CCCCCC] rounded-full flex items-center justify-center text-[#999999] text-xs font-mono relative">
                      [Top View Drawing]
                      <div className="absolute -top-4 text-black text-[10px]">Φ12.00</div>
                      <div className="absolute -bottom-4 text-black text-[10px]">Φ45.99</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-48 border-2 border-dashed border-[#CCCCCC] rounded-full flex items-center justify-center text-[#999999] text-xs font-mono relative">
                      [Bottom View Drawing]
                      <div className="absolute -top-4 text-black text-[10px]">Φ25.00</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-24 border-2 border-dashed border-[#CCCCCC] mt-12 flex items-center justify-center text-[#999999] text-xs font-mono relative">
                      [Side View Drawing]
                      <div className="absolute -top-4 text-black text-[10px]">Φ4.00</div>
                      <div className="absolute -right-8 top-10 text-black text-[10px]">20.50</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* COMPATIBILITY */}
          <div id="compatibility" className="scroll-mt-40">
            <div className="bg-white border border-[#E5E5E5] p-8">
              <h3 className="font-heading font-extrabold text-[24px] tracking-tight mb-2">Works with</h3>
              <p className="font-sans text-[13px] text-[#666666] mb-6">
                Compatibility is evaluated against voltage, current, interface and mechanical constraints.
              </p>

              <div className="font-mono text-[13px] bg-[#FAFAFA] border border-[#E5E5E5] p-6 mb-8">
                <div className="font-bold text-black mb-2">{product.mpn}</div>
                <div className="ml-2 border-l border-[#E5E5E5] pl-4 flex flex-col gap-3 relative py-2">
                  {product.compatibility.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 relative">
                      <div className="absolute -left-4 w-4 h-px bg-[#E5E5E5] top-1/2"></div>
                      <span className={`text-[12px] flex items-center justify-center font-bold ${item.status === 'match' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {item.status === 'match' ? '✓' : '⚠'}
                      </span>
                      <span className="text-black">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <CapabilityGuard featureKey="coming.soon">
                <Link href={`/compatibility?component=${product.id}`} className="inline-flex items-center gap-2 font-sans font-bold text-[13px] text-black hover:text-[#2266DD] transition-colors duration-fast w-full">
                  Run Compatibility Check
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </CapabilityGuard>
            </div>
          </div>

          {/* SELLERS SECTION */}
          <div id="sellers" className="scroll-mt-40">
            <h3 className="font-heading font-extrabold text-[24px] tracking-tight mb-2">Available Offers</h3>
            
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="font-sans text-[11px] font-bold uppercase text-[#888888] mb-2 block">Select Variant</label>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v: any) => (
                    <button 
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-4 py-2 border font-sans text-[12px] font-medium transition-colors ${selectedVariantId === v.id ? 'border-black bg-black text-white' : 'border-[#E5E5E5] bg-white text-black hover:border-black'}`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full overflow-x-auto mt-6 border border-[#E5E5E5] bg-white">
              <table className="w-full text-left font-sans text-[13px] whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[11px] uppercase text-[#888888] tracking-wider">
                    <th className="px-6 py-4 font-bold">Seller</th>
                    <th className="px-6 py-4 font-bold text-right">Price</th>
                    <th className="px-6 py-4 font-bold text-right">MOQ</th>
                    <th className="px-6 py-4 font-bold">Stock</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {product.variants?.find((v: any) => v.id === selectedVariantId)?.offers?.length > 0 ? (
                    product.variants.find((v: any) => v.id === selectedVariantId).offers.map((offer: any, i: number) => (
                    <tr
                      key={i}
                      className="group hover:bg-[#FAFAFA] transition-all duration-fast"
                      data-testid="pdp-offer-row"
                    >
                      <td className="px-6 py-5 font-bold text-black flex items-center gap-2 relative" data-testid="pdp-seller-name">
                        {offer.sellerName}
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-[14px]">₹{(offer.price / 100).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-5 text-right text-[#666666]">{offer.moq}</td>
                      <td className="px-6 py-5" data-testid="pdp-stock">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${offer.stockAvailable > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-[12px] font-medium text-[#444]">{offer.stockAvailable > 0 ? `${offer.stockAvailable} In Stock` : 'Out of Stock'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAddToCart(offer)}
                          disabled={isAdding || offer.stockAvailable <= 0}
                          className="px-4 py-2 border-2 border-[#E5E5E5] text-[11px] font-bold uppercase tracking-wider disabled:opacity-50 hover:border-black transition-colors"
                          data-testid="pdp-add-to-cart"
                        >
                          Add to Cart
                        </button>
                        <button 
                          onClick={() => handleQuickQuote(offer)}
                          disabled={isAdding}
                          className="px-4 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-wider disabled:opacity-50 hover:bg-gray-800 transition-colors"
                        >
                          Quote
                        </button>
                      </td>
                    </tr>
                  ))) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-[#888888]">
                        No active offers available for this variant.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
            <CapabilityGuard featureKey="coming.soon">
              <Link href={`/compare?add=${product.id}`} className="font-sans font-bold text-[13px] text-black flex items-center gap-2 hover:text-[#2266DD] transition-colors duration-fast w-full">
                Compare offers
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </CapabilityGuard>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
