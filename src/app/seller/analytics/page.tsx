"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { TrendingUp, TrendingDown, IndianRupee, Eye, ShoppingCart, Download, Filter } from 'lucide-react';

export default function AnalyticsPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="seller.analytics">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Store Analytics</h1>
            <p className="text-xs text-[#777777] mt-1">Track your gross merchandise value (GMV), conversion rates, and catalog performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Last 30 Days
            </button>
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-[#138808] text-white hover:bg-[#0f6c06] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xs text-[#777777] uppercase tracking-wider">Total GMV</h2>
              <IndianRupee className="w-4 h-4 text-[#138808]" />
            </div>
            <div className="font-mono text-3xl font-black text-[#111111]">₹4,25,000</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-[#22C55E]">
              <TrendingUp className="w-3.5 h-3.5" /> +14.5% vs last period
            </div>
          </div>
          
          <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xs text-[#777777] uppercase tracking-wider">Orders</h2>
              <ShoppingCart className="w-4 h-4 text-[#305CDE]" />
            </div>
            <div className="font-mono text-3xl font-black text-[#111111]">128</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-[#22C55E]">
              <TrendingUp className="w-3.5 h-3.5" /> +8.2% vs last period
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xs text-[#777777] uppercase tracking-wider">Page Views</h2>
              <Eye className="w-4 h-4 text-[#777777]" />
            </div>
            <div className="font-mono text-3xl font-black text-[#111111]">12.4k</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-red-500">
              <TrendingDown className="w-3.5 h-3.5" /> -2.4% vs last period
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xs text-[#777777] uppercase tracking-wider">Conversion</h2>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-mono text-3xl font-black text-[#111111]">3.2%</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-[#22C55E]">
              <TrendingUp className="w-3.5 h-3.5" /> +0.5% vs last period
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-bold text-sm text-[#111111] mb-6">Revenue Trend (30 Days)</h2>
            <div className="h-[250px] flex items-center justify-center bg-[#F5F5F5] rounded-lg border border-dashed border-[#E5E5E5]">
              <p className="text-sm text-[#777777] font-medium">Chart visualization component mounts here</p>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E5E5] font-semibold text-sm">
              Top Selling Products
            </div>
            <div className="flex-1 overflow-auto">
              <ul className="divide-y divide-[#E5E5E5]">
                {[
                  { name: "T-Motor MN4014 KV330", sales: 45, rev: 292500 },
                  { name: "Pixhawk 6C Flight Controller", sales: 12, rev: 222000 },
                  { name: "Here3 GPS Module", sales: 24, rev: 196800 },
                  { name: "Hobbywing X-Rotor 40A ESC", sales: 88, rev: 184800 },
                ].map((item, i) => (
                  <li key={i} className="p-4 hover:bg-[#FAFAFA] transition-colors">
                    <div className="font-medium text-sm text-[#111111] line-clamp-1 mb-1">{item.name}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#777777]">{item.sales} units sold</span>
                      <span className="font-mono font-bold text-[#138808]">₹{item.rev.toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CapabilityGuard>
  );
}
