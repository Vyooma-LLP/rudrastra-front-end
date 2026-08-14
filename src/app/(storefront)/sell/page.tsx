import React from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, ArrowRight, Layers, Landmark } from 'lucide-react';

export default function BecomeSellerPage() {
  return (
    
<div className="min-h-screen bg-[#F5F5F5] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-[#138808]/10 border border-[#138808]/30 text-[#138808] rounded-full flex items-center justify-center mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-[#111111]">Become a Verified Seller on Rudraastra</h1>
          <p className="text-xs text-[#777777] max-w-xl mx-auto">
            Sell drone components directly to India&apos;s top defense contractors, UAV manufacturers, and robotics labs with automated Razorpay Route split payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3 shadow-sm">
            <div className="p-2.5 bg-[#F35C27]/10 text-[#F35C27] rounded w-fit">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#111111] text-sm">PIM SKU Mapping</h3>
            <p className="text-[#777777]">Map your seller SKUs directly to canonical MPNs with custom prices, GST rates, and lead times.</p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3 shadow-sm">
            <div className="p-2.5 bg-[#138808]/10 text-[#138808] rounded w-fit">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#111111] text-sm">Automated Split Payouts</h3>
            <p className="text-[#777777]">Get settled directly into your linked bank account via Razorpay Route upon delivery confirmation.</p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3 shadow-sm">
            <div className="p-2.5 bg-[#305CDE]/10 text-[#305CDE] rounded w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#111111] text-sm">Quarantine & RMA Rules</h3>
            <p className="text-[#777777]">Clear diagnostic evidence and serial matching rules protect sellers against fraudulent returns.</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-8 text-center space-y-4 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-[#111111]">Ready to register your merchant account?</h2>
          <p className="text-xs text-[#777777]">Setup takes less than 5 minutes with corporate GSTIN verification.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/signup?role=seller" className="px-6 py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider">
              <span>Register Seller Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="px-6 py-3 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-bold text-xs transition-colors">
              Already a Seller? Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
    
  );
}
