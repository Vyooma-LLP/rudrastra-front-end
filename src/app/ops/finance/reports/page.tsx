"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="finance.financial-reports">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Financial Reports & Taxes</h1>
            <p className="text-xs text-[#777777] mt-1">Tax liability (GST/TDS) and overall platform revenue reports.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Calendar className="w-3.5 h-3.5" />
              August 2026
            </button>
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg text-[#111111]">Platform Revenue</h2>
              <TrendingUp className="w-5 h-5 text-[#22C55E]" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[#E5E5E5] pb-2">
                <span className="text-sm font-semibold text-[#777777]">Commission Fees (Gross)</span>
                <span className="font-mono text-lg font-bold">₹124,500</span>
              </div>
              <div className="flex justify-between items-end border-b border-[#E5E5E5] pb-2">
                <span className="text-sm font-semibold text-[#777777]">Logistics Markup</span>
                <span className="font-mono text-lg font-bold">₹18,200</span>
              </div>
              <div className="flex justify-between items-end border-b border-[#E5E5E5] pb-2">
                <span className="text-sm font-semibold text-[#777777]">Refunds Processed</span>
                <span className="font-mono text-lg font-bold text-red-600">-₹4,500</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-sm font-bold text-[#111111] uppercase tracking-wider">Net Platform Revenue</span>
                <span className="font-mono text-2xl font-black text-[#111111]">₹138,200</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg text-[#111111]">Tax Liabilities (GST/TDS)</h2>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[#E5E5E5] pb-2">
                <span className="text-sm font-semibold text-[#777777]">CGST Collected (9%)</span>
                <span className="font-mono text-lg font-bold">₹45,210</span>
              </div>
              <div className="flex justify-between items-end border-b border-[#E5E5E5] pb-2">
                <span className="text-sm font-semibold text-[#777777]">SGST Collected (9%)</span>
                <span className="font-mono text-lg font-bold">₹45,210</span>
              </div>
              <div className="flex justify-between items-end border-b border-[#E5E5E5] pb-2">
                <span className="text-sm font-semibold text-[#777777]">IGST Collected (18%)</span>
                <span className="font-mono text-lg font-bold">₹89,450</span>
              </div>
              <div className="flex justify-between items-end border-b border-[#E5E5E5] pb-2">
                <span className="text-sm font-semibold text-[#777777]">TDS Withheld (194O)</span>
                <span className="font-mono text-lg font-bold text-blue-700">₹12,450</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-sm font-bold text-[#111111] uppercase tracking-wider">Total Tax Payable</span>
                <span className="font-mono text-2xl font-black text-[#111111]">₹192,320</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CapabilityGuard>
  );
}
