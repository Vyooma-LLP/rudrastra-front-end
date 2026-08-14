"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "@/components/commerce/CartContext";
import { CapabilityGuard } from "@/components/layout/CapabilityGuard";
import { toast } from "@/components/ui/Toast";

function getQuickStats(specs: any, category: string = "") {
  const cat = category.toLowerCase();
  
  // Flatten specs into a simple array
  const flatSpecs: { label: string, val: string }[] = [];
  if (specs && typeof specs === 'object') {
    Object.keys(specs).forEach((section) => {
      if (Array.isArray(specs[section])) {
        specs[section].forEach((item: any) => {
          flatSpecs.push({
            label: item.label || '',
            val: item.val || ''
          });
        });
      }
    });
  }

  const findSpec = (keywords: string[]) => {
    const found = flatSpecs.find(s => 
      keywords.some(k => s.label.toLowerCase().includes(k))
    );
    return found ? found.val : null;
  };

  // 1. Voltage / Power Input
  const voltage = findSpec(["operating voltage", "input voltage", "voltage", "working voltage"]) || "N/A";

  // 2. Weight
  const weight = findSpec(["weight", "mass"]) || "N/A";

  // 3. Primary Metric
  let primaryLabel = "Metric";
  let primaryVal = "N/A";
  if (cat.includes("motor") || cat.includes("propulsion")) {
    primaryLabel = "KV Rating";
    primaryVal = findSpec(["kv rating", "kv"]) || "N/A";
  } else if (cat.includes("esc") || cat.includes("power")) {
    primaryLabel = "Continuous Current";
    primaryVal = findSpec(["continuous current", "current rating", "amps"]) || "N/A";
  } else if (cat.includes("flight") || cat.includes("control") || cat.includes("fc") || cat.includes("autopilot") || cat.includes("avionics")) {
    primaryLabel = "MCU";
    primaryVal = findSpec(["mcu", "processor", "chip"]) || "N/A";
  } else {
    // Default to the first specification in the list if available
    if (flatSpecs.length > 0) {
      primaryLabel = flatSpecs[0].label;
      primaryVal = flatSpecs[0].val;
    }
  }

  // 4. Secondary Metric
  let secondaryLabel = "Features";
  let secondaryVal = "N/A";
  if (cat.includes("motor") || cat.includes("propulsion")) {
    secondaryLabel = "Max Thrust";
    secondaryVal = findSpec(["max thrust", "thrust"]) || "8.2kg"; // Fallback to original mock value
  } else if (cat.includes("esc") || cat.includes("power")) {
    secondaryLabel = "BEC Output";
    secondaryVal = findSpec(["bec output", "bec", "peak current"]) || "N/A";
  } else if (cat.includes("flight") || cat.includes("control") || cat.includes("fc") || cat.includes("autopilot") || cat.includes("avionics")) {
    secondaryLabel = "PWM Outputs";
    secondaryVal = findSpec(["pwm outputs", "pwm", "uarts", "uart ports"]) || "N/A";
  } else {
    // Default to the second specification in the list if available
    if (flatSpecs.length > 1) {
      secondaryLabel = flatSpecs[1].label;
      secondaryVal = flatSpecs[1].val;
    }
  }

  return [
    { label: "Voltage", val: voltage },
    { label: primaryLabel, val: primaryVal },
    { label: secondaryLabel, val: secondaryVal },
    { label: "Weight", val: weight },
  ];
}

/**
 * P0: Canonical Product Detail Page (PDP)
 * Focuses on Canonical Data -> Compatibility Graph -> Multi-Seller Offers.
 */
export default function ProductDetailPage({ params }: { params: React.Usable<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'compatibility' | 'sellers'>('overview');
  const [product, setProduct] = useState<any>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const { addToCart } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        mpn: product.mpn,
        sellerId: product.sellerId || null,
        productId: product.id,
        quantity: 1
      });
      toast("Added to cart successfully!");
    } catch (e: any) {
      toast(e.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuickQuote = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        mpn: product.mpn,
        sellerId: product.sellerId || null,
        productId: product.id,
        quantity: 1
      });
      window.location.href = "/quote-request";
    } catch (e: any) {
      toast(e.message || "Failed to add to cart");
      setIsAdding(false);
    }
  };

  React.useEffect(() => {
    fetch(`/api/products/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          // Parse data.product.imageUrl if it is a JSON array
          let imagesList: string[] = [];
          if (data.product.imageUrl) {
            try {
              const url = data.product.imageUrl.trim();
              if (url.startsWith('[') && url.endsWith(']')) {
                imagesList = JSON.parse(url);
              } else {
                imagesList = [url];
              }
            } catch {
              imagesList = [data.product.imageUrl];
            }
          }
          if (imagesList.length === 0) {
            imagesList = ["/images/products/rudrastra_motor_1785921295587.png"];
          }

          // Get specs from specifications column in database
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

          // If no specifications are in the database, define a template/fallback based on the category
          if (!parsedSpecs || Object.keys(parsedSpecs).length === 0) {
            const cat = (data.product.category || "").toLowerCase();
            if (cat.includes("esc") || cat.includes("power")) {
              parsedSpecs = {
                electrical: [
                  { label: "Continuous Current", val: "40A" },
                  { label: "Peak Current (10s)", val: "60A" },
                  { label: "Input Voltage", val: "3S-6S LiPo" },
                  { label: "BEC Output", val: "5.2V @ 4A" }
                ],
                mechanical: [
                  { label: "Dimensions", val: "48x35x12 mm" },
                  { label: "Weight", val: "36g" }
                ]
              };
            } else if (cat.includes("flight") || cat.includes("control") || cat.includes("fc") || cat.includes("autopilot") || cat.includes("avionics")) {
              parsedSpecs = {
                hardware: [
                  { label: "MCU", val: "STM32H753" },
                  { label: "IMU", val: "Triple IMU system" },
                  { label: "Barometer", val: "BMP388" },
                  { label: "Input Voltage", val: "5V" }
                ],
                interface: [
                  { label: "PWM Outputs", val: "8" },
                  { label: "UART Ports", val: "6" }
                ]
              };
            } else {
              // Fallback default: Motor specifications template
              parsedSpecs = {
                electrical: [
                  { label: "KV Rating", val: "400" },
                  { label: "Operating Voltage", val: "6S-12S LiPo" },
                  { label: "Max Continuous Current (180S)", val: "30A" },
                  { label: "Max Continuous Power (180S)", val: "900W" },
                  { label: "Internal Resistance", val: "67mΩ" },
                  { label: "Idle Current (10V)", val: "1.1A" }
                ],
                mechanical: [
                  { label: "Stator Size", val: "40x14 mm" },
                  { label: "Motor Dimensions", val: "Φ44.8 x 34.5 mm" },
                  { label: "Weight", val: "168g" },
                  { label: "Shaft Diameter", val: "4.0 mm" },
                  { label: "Mounting Pattern", val: "25x25mm, M3" },
                  { label: "Bearing", val: "EZO 694ZZ" }
                ]
              };
            }
          }

          // Merge API data with mock specs for UI presentation
          setProduct({
            ...data.product,
            mfg: "Verified Manufacturer",
            desc: data.product.description,
            img: imagesList[0],
            images: imagesList,
            aggPrice: (data.product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
            sellers: 3,
            overview: data.product.description,
            specs: parsedSpecs,
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
    <div className="w-full min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center font-sans px-6">
      <div className="bg-white border border-[var(--border)] p-10 max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 border-2 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin mx-auto" id="pdp-loading-spinner" />
        <p className="text-[var(--muted-foreground)] text-sm" id="pdp-loading-text">Loading product details...</p>
      </div>
    </div>
  );

  return (
    
      <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
        
        {/* Breadcrumbs */}
      <div className="w-full px-6 lg:px-10 py-4 font-sans text-[12px] text-[var(--muted-foreground)] flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[var(--foreground)] transition-colors">Products</Link>
        <span>/</span>
        <Link href="/categories/propulsion" className="hover:text-[var(--foreground)] transition-colors">Propulsion</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-semibold">{product.mpn}</span>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Media */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="w-full aspect-square bg-white border border-[var(--border)] flex items-center justify-center p-8 relative">
            <span className="absolute top-4 left-4 font-sans text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-2 py-1 bg-[#F5F5F5]">
              {product.id}
            </span>
            <Image 
              src={product.images ? product.images[activeImageIdx] : product.img} 
              alt={product.mpn || product.title || "Product Image"} 
              width={400} 
              height={400} 
              className="object-contain max-h-[350px]"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((imgUrl: string, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-square border ${idx === activeImageIdx ? 'border-[var(--foreground)] border-2' : 'border-[var(--border)]'} bg-white flex items-center justify-center cursor-pointer hover:border-[var(--foreground)] transition-all duration-fast`}
                >
                  <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} width={50} height={50} className="object-contain opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Core Data */}
        <div className="lg:col-span-7 flex flex-col">
          
          <div className="border-b border-[var(--border)] pb-8 mb-8">
            <span className="font-sans text-[13px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2 block">{product.mfg}</span>
            <h1 className="font-heading font-extrabold text-[40px] md:text-[48px] leading-none tracking-tight text-[var(--foreground)] mb-3">
              {product.mpn}
            </h1>
            <p className="font-sans text-[18px] text-[var(--muted-foreground)] mb-6">
              {product.desc}
            </p>
            
            <div className="flex items-center gap-2 font-sans text-[13px] font-medium text-[var(--foreground)] mb-8">
              <div className="flex text-[var(--foreground)]">
                {/* 5 Stars */}
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <span className="px-2 py-0.5 bg-[var(--border)] text-[10px] font-bold uppercase tracking-wider">Verified specification</span>
            </div>

            <div className="flex items-end gap-6 mb-8">
              <div className="font-heading font-bold text-[36px] leading-none">{product.aggPrice}</div>
              <div className="font-sans text-[13px] text-[var(--muted-foreground)] pb-1">Available from {product.sellers} sellers</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 flex justify-center items-center bg-white border border-[var(--border)] text-[var(--foreground)] font-sans font-bold text-[14px] h-[52px] hover:border-[var(--foreground)] transition-colors duration-fast cursor-pointer disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>
              <button 
                onClick={handleQuickQuote}
                disabled={isAdding}
                className="flex-1 flex justify-center items-center bg-[var(--foreground)] text-white font-sans font-bold text-[14px] h-[52px] hover:bg-black transition-colors duration-fast cursor-pointer disabled:opacity-50"
              >
                Request Quote
              </button>
              <CapabilityGuard featureKey="coming.soon" inline>
                <button className="w-full flex justify-center items-center bg-white border border-[var(--border)] text-[var(--foreground)] font-sans font-bold text-[14px] h-[52px]">
                  Compare Options
                </button>
              </CapabilityGuard>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {getQuickStats(product.specs, product.category).map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-heading font-bold text-[20px]">{stat.val}</span>
                <span className="font-sans text-[12px] text-[var(--muted-foreground)]">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="w-full mb-8">
            <div className="flex border-b border-[var(--border)] font-sans text-[14px] font-semibold">
              {(['overview', 'specifications', 'compatibility', 'sellers'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 border-b-2 capitalize transition-colors duration-fast ${
                    activeTab === tab
                      ? 'border-[var(--foreground)] text-[var(--foreground)]'
                      : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* OVERVIEW CONTENT */}
          {activeTab === 'overview' && (
          <div className="font-sans text-[15px] leading-relaxed text-[#333] mb-12 max-w-3xl">
            <p>{product.overview}</p>
          </div>
          )}

          {/* SPECIFICATIONS */}
          {activeTab === 'specifications' && (
            <div className="mb-16">
              <h3 className="font-heading font-bold text-[24px] tracking-tight mb-6">Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {Object.keys(product.specs || {}).map((sectionKey) => {
                  const sectionItems = product.specs[sectionKey];
                  if (!Array.isArray(sectionItems) || sectionItems.length === 0) return null;
                  
                  return (
                    <div key={sectionKey}>
                      <h4 className="font-sans text-[13px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 capitalize">
                        {sectionKey}
                      </h4>
                      <div className="flex flex-col">
                        {sectionItems.map((s: any, i: number) => (
                          <div key={i} className="flex justify-between py-3 border-b border-[var(--border)] font-sans text-[14px]">
                            <span className="text-[var(--muted-foreground)]">{s.label}</span>
                            <span className="font-semibold text-right">{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* COMPATIBILITY */}
          {activeTab === 'compatibility' && (
          <div className="mb-16 bg-white border border-[var(--border)] p-8">
            <h3 className="font-heading font-bold text-[24px] tracking-tight mb-2">Works with</h3>
            <p className="font-sans text-[14px] text-[var(--muted-foreground)] mb-6">
              Compatibility is evaluated against voltage, current, interface and mechanical constraints.
            </p>

            <div className="font-mono text-[14px] bg-[#FAFAFA] border border-[var(--border)] p-6 mb-8">
              <div className="font-bold text-[var(--foreground)] mb-2">{product.mpn}</div>
              <div className="ml-2 border-l border-[var(--border)] pl-4 flex flex-col gap-3 relative py-2">
                {product.compatibility.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 relative">
                    {/* Horizontal connector line */}
                    <div className="absolute -left-4 w-4 h-px bg-[var(--border)] top-1/2"></div>
                    <span className={`text-[12px] flex items-center justify-center font-bold ${item.status === 'match' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {item.status === 'match' ? '✓' : '⚠'}
                    </span>
                    <span className="text-[var(--foreground)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <CapabilityGuard featureKey="coming.soon">
              <Link href={`/compatibility?component=${product.id}`} className="inline-flex items-center gap-2 font-sans font-bold text-[14px] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-fast w-full">
                Run Compatibility Check
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </CapabilityGuard>
          </div>
          )}

          {/* SELLERS SECTION */}
          {activeTab === 'sellers' && (
          <div>
            <h3 className="font-heading font-bold text-[24px] tracking-tight mb-2">Available from verified sellers</h3>
            <div className="w-full overflow-x-auto mt-6 border border-[var(--border)] bg-white">
              <table className="w-full text-left font-sans text-[14px] whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[#FAFAFA] text-[12px] uppercase text-[var(--muted-foreground)] tracking-wider">
                    <th className="px-6 py-4 font-semibold">Seller</th>
                    <th className="px-6 py-4 font-semibold text-right">Price</th>
                    <th className="px-6 py-4 font-semibold text-right">MOQ</th>
                    <th className="px-6 py-4 font-semibold text-right">Lead time</th>
                    <th className="px-6 py-4 font-semibold">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {product.offers.map((offer: any, i: number) => (
                    <tr
                      key={i}
                      onClick={() => window.location.href = `/rfq?mpn=${product.mpn}&seller=${encodeURIComponent(offer.name)}`}
                      className="group hover:bg-[#FAFAFA] transition-all duration-fast hover:translate-x-[2px] cursor-pointer"
                    >
                      <td className="px-6 py-5 font-semibold text-[var(--foreground)] flex items-center gap-2 relative">
                        {offer.name}
                        {offer.verified && (
                          <svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {/* Hover Arrow */}
                        <svg className="w-4 h-4 text-[var(--primary)] absolute -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
                        </svg>
                      </td>
                      <td className="px-6 py-5 text-right font-bold">{offer.price}</td>
                      <td className="px-6 py-5 text-right text-[var(--muted-foreground)]">{offer.moq}</td>
                      <td className="px-6 py-5 text-right text-[var(--muted-foreground)]">{offer.lead}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${offer.stock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-[12px]">{offer.stock ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
            <CapabilityGuard featureKey="coming.soon">
              <Link href={`/compare?add=${product.id}`} className="font-sans font-bold text-[14px] text-[var(--foreground)] flex items-center gap-2 hover:text-[var(--primary)] transition-colors duration-fast w-full">
                Compare offers
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </CapabilityGuard>
            </div>
          </div>
          )}
        </div>
      </div>
      </div>
    
  );
}
