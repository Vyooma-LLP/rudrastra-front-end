"use client";
import React, { useState } from 'react';

export default function OpsDisputesPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Buyer / Seller Dispute Resolution</h1>
        <p className="text-xs text-[#777777]">Arbitrate non-conformance, delivery delays, and refund disputes.</p>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-5 space-y-3 text-xs">
        <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-3">
          <div>
            <span className="font-mono font-bold text-rose-600 text-sm">Dispute #DSP-88192</span>
            <div className="text-[#111111] font-bold">Delivery Delay & Alleged Specification Non-Conformance</div>
          </div>
          <span className="px-2 py-0.5 border border-amber-600 text-amber-600 bg-amber-50 font-semibold text-[10px]">UNDER ARBITRATION</span>
        </div>
        <div className="flex justify-between items-center text-[#777777]">
          <span>Buyer: Vyooma Tech • Seller: Robouav India</span>
          <button onClick={() => _showToast('Action will be available when backend is connected')} className="px-3 py-1.5 bg-[#111111] text-white hover:bg-black font-bold">Issue Final Ruling</button>
        </div>
      </div>
    </div>
  );
}
