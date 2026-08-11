import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function OrderSuccessPage() {
  return (
    <CapabilityGuard featureKey="commerce.checkout">
<div className="min-h-screen bg-[#F5F5F5] text-[#111111] py-16 px-4 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-white border border-[#E5E5E5] p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-[#138808]/10 text-[#138808] border border-[#138808]/30 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold text-[#305CDE] border border-[#305CDE] bg-[#305CDE]/5 px-2.5 py-1">#RUD-2026-88941</span>
          <h1 className="font-heading text-2xl font-bold text-[#111111] mt-3">Order Confirmed & Placed</h1>
          <p className="text-xs text-[#777777] mt-1">
            Your payment/net terms credit has been authorized. Seller fulfillment orders have been emitted to Robouav India and Vyooma Systems.
          </p>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 text-xs font-mono space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-[#777777]">Total Amount Paid:</span>
            <span className="font-bold text-[#111111]">₹58,174.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#777777]">Fulfillment Sub-Orders:</span>
            <span className="font-bold text-[#138808]">2 Seller Shipments</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#777777]">Guaranteed Delivery:</span>
            <span className="font-bold text-[#111111]">By Aug 12, 2026</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/account/orders/RUD-2026-88941" className="flex-1 py-3 bg-[#111111] text-white hover:bg-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
            <span>Track Order FSM</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/products" className="px-6 py-3 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-bold text-xs transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
    </CapabilityGuard>
  );
}
