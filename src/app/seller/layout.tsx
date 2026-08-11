import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Store, Tag, PackageCheck, Layers, Landmark, User, Building2, ShieldAlert, FileBox, LineChart, Wrench } from 'lucide-react';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-8 gap-8">
        <aside className="w-full md:w-64 bg-white border border-[#E5E5E5] p-6 flex flex-col justify-between shrink-0 space-y-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-3 pb-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#138808]/10 border border-[#138808]/30 text-[#138808] rounded-lg flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#111111] text-sm">Robouav India</h3>
                  <p className="text-[11px] text-[#138808] font-mono font-semibold">VERIFIED SELLER</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-medium">
              <Link href="/seller/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111111] hover:bg-[#F5F5F5] font-semibold transition-colors">
                <Store className="w-4 h-4 text-[#138808]" /> Seller Dashboard
              </Link>
              <Link href="/seller/offers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <Tag className="w-4 h-4 text-[#138808]" /> Offers & SKU Mapping
              </Link>
              <Link href="/seller/inventory" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <Layers className="w-4 h-4 text-[#138808]" /> Inventory Stock Levels
              </Link>
              <Link href="/seller/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <PackageCheck className="w-4 h-4 text-[#138808]" /> Fulfillment & Orders
              </Link>
              <Link href="/seller/payouts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <Landmark className="w-4 h-4 text-[#138808]" /> Razorpay Payouts
              </Link>
              <div className="pt-2 pb-1 text-[10px] font-bold text-[#777777] uppercase tracking-wider px-3">Extended Hub</div>
              <Link href="/seller/catalog" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <FileBox className="w-4 h-4 text-[#138808]" /> Catalog & Pricing
              </Link>
              <Link href="/seller/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <LineChart className="w-4 h-4 text-[#138808]" /> Store Analytics
              </Link>
              <Link href="/seller/returns" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <Wrench className="w-4 h-4 text-[#138808]" /> Returns & Warranty
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-[#E5E5E5] text-[11px] space-y-2">
            <div className="text-[#777777] font-semibold uppercase tracking-wider text-[10px]">Switch Portal Context</div>
            <div className="space-y-1">
              <Link href="/account" className="flex items-center gap-1.5 text-[#F35C27] font-semibold hover:underline">
                <User className="w-3.5 h-3.5" /> Customer Account
              </Link>
              <Link href="/organization/dashboard" className="flex items-center gap-1.5 text-[#305CDE] font-semibold hover:underline">
                <Building2 className="w-3.5 h-3.5" /> Organization Workspace
              </Link>
              <Link href="/ops" className="flex items-center gap-1.5 text-rose-600 font-semibold hover:underline">
                <ShieldAlert className="w-3.5 h-3.5" /> Ops Mission Control
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 bg-white border border-[#E5E5E5] p-6 md:p-8 shadow-sm">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
