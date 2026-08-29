"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Truck, Headphones, Wrench } from "lucide-react";

/**
 * Footer — Rudrastra Architecture Universal Light Footer
 * Conditionally hides value proposition strip on profile and portal pages.
 */
export function Footer({ hideValueProp }: { hideValueProp?: boolean }) {
  const pathname = usePathname();
  
  // Hide value prop strip on Account/Profile, Org, Seller, and Ops portal pages
  const isPortalPage = 
    hideValueProp || 
    pathname?.startsWith("/account") || 
    pathname?.startsWith("/organization") || 
    pathname?.startsWith("/seller") || 
    pathname?.startsWith("/ops");

  return (
    <footer className="w-full bg-[#F5F5F5] border-t border-[#E5E5E5] text-[#111111] font-sans mt-auto">
      
      {/* High-Trust Value Proposition Strip (Hidden on Profile / Account & Portal pages) */}
      {!isPortalPage && (
        <div className="border-b border-[#E5E5E5] bg-white py-8 px-6 lg:px-10">
          <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F35C27]/10 border border-[#F35C27]/30 text-[#F35C27] rounded-lg shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[#111111]">Canonical MPN Identity</div>
                <div className="text-[#777777] text-[11px]">Strict PIM validation prevents counterfeit listings</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#305CDE]/10 border border-[#305CDE]/30 text-[#305CDE] rounded-lg shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[#111111]">Technical RMA Diagnostics</div>
                <div className="text-[#777777] text-[11px]">Serial verification & electrical evidence logs</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#138808]/10 border border-[#138808]/30 text-[#138808] rounded-lg shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[#111111]">Insured Express Logistics</div>
                <div className="text-[#777777] text-[11px]">ESD-safe transit with granular FSM tracking</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F35C27]/10 border border-[#F35C27]/30 text-[#F35C27] rounded-lg shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[#111111]">SLA-Guaranteed Support</div>
                <div className="text-[#777777] text-[11px]">Direct L2/L3 technical engineer assignment</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className="px-6 lg:px-10 py-12 w-full max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <svg width="34" height="26" viewBox="0 0 36 28" fill="none" className="text-[#111111]">
              <path d="M0 0L12 14L0 28H6L18 14L6 0H0Z" fill="currentColor" />
              <path d="M14 0L26 14L14 28H20L32 14L20 0H14Z" fill="currentColor" />
            </svg>
            <span className="font-heading font-extrabold text-[18px] tracking-tight text-[#111111]">RUDRAASTRA</span>
          </Link>
          <p className="text-xs text-[#777777] leading-relaxed max-w-sm">
            India&apos;s canonical Technical B2B Marketplace & Engineering Discovery Engine for Drone Hardware. Made in India. Built for the people who build India.
          </p>
          <div className="pt-2 text-xs font-mono text-[#138808] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse"></span>
            <span>Operations & Ledger Status: 100% Operational</span>
          </div>
        </div>

        {/* Directory */}
        <div>
          <h4 className="font-sans font-bold text-[13px] text-[#111111] uppercase tracking-wider mb-4">Directory</h4>
          <ul className="space-y-2.5 text-xs text-[#777777]">
            <li><Link href="/categories" className="hover:text-[#111111] transition-colors">Categories</Link></li>
            <li><Link href="/products" className="hover:text-[#111111] transition-colors">Component Catalog</Link></li>
            <li><Link href="/manufacturers" className="hover:text-[#111111] transition-colors">Manufacturers</Link></li>
            <li><span onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: "BOM Procurement — Coming Soon" })) }} className="cursor-pointer hover:text-[#111111] transition-colors">BOM Procurement</span></li>
          </ul>
        </div>

        {/* Engineering */}
        <div>
          <h4 className="font-sans font-bold text-[13px] text-[#111111] uppercase tracking-wider mb-4">Engineering</h4>
          <ul className="space-y-2.5 text-xs text-[#777777]">
            <li><span onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: "System Calculators — Coming Soon" })) }} className="cursor-pointer hover:text-[#111111] transition-colors">System Calculators</span></li>
            <li><span onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: "Compatibility Matrix — Coming Soon" })) }} className="cursor-pointer hover:text-[#111111] transition-colors">Compatibility Matrix</span></li>
            <li><span onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: "CAD Library — Coming Soon" })) }} className="cursor-pointer hover:text-[#111111] transition-colors">CAD Library</span></li>
            <li><span onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: "Developer API — Coming Soon" })) }} className="cursor-pointer hover:text-[#111111] transition-colors">Developer API</span></li>
          </ul>
        </div>

        {/* Company & Support */}
        <div>
          <h4 className="font-sans font-bold text-[13px] text-[#111111] uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2.5 text-xs text-[#777777]">
            <li><span onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: "About Us — Coming Soon" })) }} className="cursor-pointer hover:text-[#111111] transition-colors">About Us</span></li>
            <li><span onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: "Become a Seller — Coming Soon" })) }} className="cursor-pointer hover:text-[#111111] transition-colors">Become a Seller</span></li>
            <li><span onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: "Defense & Govt — Coming Soon" })) }} className="cursor-pointer hover:text-[#111111] transition-colors">Defense & Govt</span></li>
            <li><Link href="/account/support" className="hover:text-[#111111] transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Account & Portals */}
        <div>
          <h4 className="font-sans font-bold text-[13px] text-[#111111] uppercase tracking-wider mb-4">Account & Portals</h4>
          <ul className="space-y-2.5 text-xs text-[#777777]">
            <li><Link href="/cart" className="hover:text-[#111111] transition-colors">Procurement Cart</Link></li>
            <li><Link href="/account" className="hover:text-[#111111] transition-colors">Account Dashboard</Link></li>
            <li><Link href="/quote-request" className="hover:text-[#111111] transition-colors">Request a Quote</Link></li>
            <li><span onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: "Orders & RMA — Coming Soon" })) }} className="cursor-pointer hover:text-[#111111] transition-colors">Orders & RMA</span></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="px-6 lg:px-10 py-6 border-t border-[#E5E5E5] flex flex-col md:flex-row items-center justify-between text-xs text-[#777777] w-full max-w-[1600px] mx-auto">
        <p>&copy; {new Date().getFullYear()} Rudraastra Marketplace. Architecture v1.0 Frozen.</p>
        <div className="flex gap-6 mt-3 md:mt-0 font-medium">
          <Link href="/privacy" className="hover:text-[#111111]">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#111111]">Terms of Service</Link>
          <span title="Coming Soon" className="cursor-default opacity-50">Audit Logs</span>
        </div>
      </div>
    </footer>
  );
}
