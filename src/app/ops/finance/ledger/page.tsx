"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { ArrowDownRight, ArrowUpRight, Activity, Filter, Download } from 'lucide-react';

export default function LedgerPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="finance.ledger">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Financial Ledger</h1>
            <p className="text-xs text-[#777777] mt-1">Immutable double-entry ledger for all platform transactions.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4" />
              Total Processing Volume
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">₹1,204,500.00</div>
            <div className="text-xs text-[#22C55E] font-medium inline-flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +14.2% from last month
            </div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <ArrowDownRight className="w-4 h-4" />
              Platform Fees Collected
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">₹45,200.00</div>
            <div className="text-xs text-[#22C55E] font-medium inline-flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +5.1% from last month
            </div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <ArrowUpRight className="w-4 h-4" />
              Pending Settlements
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">₹89,450.00</div>
            <div className="text-xs text-[#777777] font-medium mt-1">
              34 transactions awaiting clearance
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-4 whitespace-nowrap">Transaction ID</th>
                  <th className="px-5 py-4 whitespace-nowrap">Timestamp</th>
                  <th className="px-5 py-4 whitespace-nowrap">Description</th>
                  <th className="px-5 py-4 whitespace-nowrap">Account</th>
                  <th className="px-5 py-4 whitespace-nowrap text-right">Debit (INR)</th>
                  <th className="px-5 py-4 whitespace-nowrap text-right">Credit (INR)</th>
                  <th className="px-5 py-4 whitespace-nowrap text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
                {[
                  { id: "TXN-88921-A", time: "2026-08-10 10:24", desc: "Order Payment Capture #ORD-551", acc: "1010-CASH-RAZORPAY", dr: 45000, cr: null, status: "POSTED" },
                  { id: "TXN-88921-B", time: "2026-08-10 10:24", desc: "Order Payment Capture #ORD-551", acc: "2010-SELLER-PAYABLE", dr: null, cr: 42000, status: "POSTED" },
                  { id: "TXN-88921-C", time: "2026-08-10 10:24", desc: "Platform Fee Commission", acc: "4010-REVENUE-FEES", dr: null, cr: 3000, status: "POSTED" },
                  { id: "TXN-88920-A", time: "2026-08-10 09:15", desc: "Seller Settlement Payout #SET-12", acc: "2010-SELLER-PAYABLE", dr: 120000, cr: null, status: "PENDING" },
                  { id: "TXN-88920-B", time: "2026-08-10 09:15", desc: "Seller Settlement Payout #SET-12", acc: "1010-CASH-RAZORPAY", dr: null, cr: 120000, status: "PENDING" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs">{row.id}</td>
                    <td className="px-5 py-4 text-[#777777] font-mono text-xs">{row.time}</td>
                    <td className="px-5 py-4 font-medium">{row.desc}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[#555]">{row.acc}</td>
                    <td className="px-5 py-4 text-right font-mono text-xs font-semibold">{row.dr ? `₹${row.dr.toLocaleString()}` : '-'}</td>
                    <td className="px-5 py-4 text-right font-mono text-xs font-semibold">{row.cr ? `₹${row.cr.toLocaleString()}` : '-'}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${row.status === 'POSTED' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 border-t border-[#E5E5E5] bg-[#F5F5F5] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Showing 5 of 14,204 entries
            </span>
            <div className="flex gap-1">
              <button onClick={() => _showToast('Action will be available when backend is connected')} className="px-3 py-1 bg-white border border-[#E5E5E5] rounded text-xs font-bold text-[#777777] opacity-50 cursor-not-allowed">PREV</button>
              <button onClick={() => _showToast('Action will be available when backend is connected')} className="px-3 py-1 bg-white border border-[#E5E5E5] rounded text-xs font-bold text-[#111111] hover:bg-[#F5F5F5]">NEXT</button>
            </div>
          </div>
        </div>
      </div>
    </CapabilityGuard>
  );
}
