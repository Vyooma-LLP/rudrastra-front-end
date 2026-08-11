import React from 'react';
import { ShieldCheck, Headphones, Wrench, Scale } from 'lucide-react';

export default function OpsOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Operations Mission Control</h1>
        <p className="text-xs text-[#777777]">Platform governance, PIM catalog verification, tickets, RMA inspection, and financial reconciliation.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Pending PIM Products</span>
            <ShieldCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">3</div>
          <div className="text-[11px] text-[#F35C27] font-semibold">Verification required</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Open Support Tickets</span>
            <Headphones className="w-4 h-4 text-[#F35C27]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">1</div>
          <div className="text-[11px] text-[#F35C27] font-semibold">1 Near SLA Breach</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Quarantine RMAs</span>
            <Wrench className="w-4 h-4 text-[#305CDE]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">0</div>
          <div className="text-[11px] text-[#138808] font-semibold">No pending inspections</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Financial Recon State</span>
            <Scale className="w-4 h-4 text-[#138808]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#138808]">BALANCED</div>
          <div className="text-[11px] text-[#138808] font-semibold">Zero variance</div>
        </div>
      </div>
    </div>
  );
}
