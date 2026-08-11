"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Clock, Download, TrendingUp, History, Filter } from 'lucide-react';

export default function ProcurementHistoryPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="procurement.procurement-history">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Procurement History</h1>
            <p className="text-xs text-[#777777] mt-1">Analytics and historical logs of all enterprise spending and purchasing cycles.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Filter className="w-3.5 h-3.5" />
              YTD 2026
            </button>
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-sm text-[#777777] uppercase tracking-wider">Total Spend (YTD)</h2>
              <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div className="font-mono text-3xl font-black text-[#111111]">₹1,24,50,000</div>
            <div className="text-xs text-[#777777] mt-2">+12% vs last year</div>
          </div>
          
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-sm text-[#777777] uppercase tracking-wider">Top Category</h2>
              <History className="w-4 h-4 text-[#305CDE]" />
            </div>
            <div className="font-sans text-xl font-black text-[#111111]">Brushless Motors (BLDC)</div>
            <div className="text-xs text-[#777777] mt-2">Accounting for 45% of total spend</div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-sm text-[#777777] uppercase tracking-wider">Avg Lead Time</h2>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-mono text-3xl font-black text-[#111111]">14 Days</div>
            <div className="text-xs text-[#22C55E] mt-2">-2 days vs last year</div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E5E5E5] font-semibold text-sm">
            Recent Procurement Cycles
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Cycle Ref</th>
                <th className="px-5 py-4 whitespace-nowrap">Completion Date</th>
                <th className="px-5 py-4 whitespace-nowrap">Primary Category</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Volume</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Total Value (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { ref: "PRC-2026-Q3-01", date: "Aug 01, 2026", cat: "Propulsion Systems", vol: "420 Units", val: 3450000 },
                { ref: "PRC-2026-Q2-05", date: "Jun 15, 2026", cat: "Flight Controllers", vol: "150 Units", val: 1250000 },
                { ref: "PRC-2026-Q2-02", date: "May 10, 2026", cat: "Telemetry Radios", vol: "300 Units", val: 890000 },
                { ref: "PRC-2026-Q1-08", date: "Mar 22, 2026", cat: "Carbon Fiber Frames", vol: "50 Units", val: 450000 },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-[#111111]">{row.ref}</td>
                  <td className="px-5 py-4 font-mono text-xs text-[#777777]">{row.date}</td>
                  <td className="px-5 py-4 font-medium text-xs">{row.cat}</td>
                  <td className="px-5 py-4 text-right font-mono text-xs">{row.vol}</td>
                  <td className="px-5 py-4 text-right font-mono text-sm font-bold">₹{row.val.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CapabilityGuard>
  );
}
