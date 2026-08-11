"use client";
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function SellerOffersPage() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); };
  return (
    <CapabilityGuard featureKey="seller.offers">
<div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Active Seller Offers & SKU Mapping</h1>
          <p className="text-xs text-[#777777]">Set unit prices, lead times, MOQs, and GST HSN codes for canonical product variants.</p>
        </div>
        <div className="flex items-center gap-2">
          {toast && <span className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1 rounded-md">{toast}</span>}
          <button onClick={() => showToast('Map Offer SKU form opens when backend is ready')} className="px-4 py-2 bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors">
            <Plus className="w-4 h-4" /> Map New Offer SKU
          </button>
        </div>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Seller SKU Code</th>
              <th className="p-4">Canonical Variant MPN</th>
              <th className="p-4">Unit Price (excl. GST)</th>
              <th className="p-4">Lead Time</th>
              <th className="p-4">MOQ</th>
              <th className="p-4">GST Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
            <tr>
              <td className="p-4 font-bold text-[#138808]">SKU-ROBU-MN4014-400</td>
              <td className="p-4 font-sans font-semibold">T-Motor MN4014 400KV</td>
              <td className="p-4 font-bold">₹8,499.00</td>
              <td className="p-4 font-sans">2 Business Days</td>
              <td className="p-4">1 Unit</td>
              <td className="p-4 text-[#138808]">18% GST</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </CapabilityGuard>
  );
}
