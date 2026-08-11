"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Wallet, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PayoutsPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="finance.payouts">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Seller Payouts & Settlements</h1>
            <p className="text-xs text-[#777777] mt-1">Manage Razorpay Route transfers, commissions, and seller net settlements.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              Execute Batch Payout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 p-5 bg-black text-white rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-[#A1A1AA] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-white" />
                Escrow Balance
              </div>
              <div className="font-mono text-3xl font-bold">₹8,450,000</div>
              <div className="text-xs text-[#A1A1AA] mt-1">Held in Nodal Account</div>
            </div>
          </div>
          
          <div className="lg:col-span-3 grid grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
              <div className="text-[#777777] text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Pending Settlements
              </div>
              <div className="font-mono text-2xl font-bold text-[#111111]">₹450,000</div>
              <div className="text-xs text-[#777777]">12 sellers awaiting payout</div>
            </div>
            
            <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
              <div className="text-[#777777] text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                Cleared Today
              </div>
              <div className="font-mono text-2xl font-bold text-[#111111]">₹1,240,000</div>
              <div className="text-xs text-[#777777]">Across 42 transactions</div>
            </div>
            
            <div className="p-5 bg-white border border-red-100 bg-red-50/30 rounded-xl flex flex-col gap-1">
              <div className="text-red-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Failed Transfers
              </div>
              <div className="font-mono text-2xl font-bold text-red-900">₹85,000</div>
              <div className="text-xs text-red-700">2 transfers require attention</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E5E5E5] flex gap-4">
            <div className="font-semibold text-sm">Settlement Queue</div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Seller</th>
                <th className="px-5 py-4 whitespace-nowrap">Linked Account</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Gross Sales</th>
                <th className="px-5 py-4 whitespace-nowrap text-right text-red-600">Commission (5%)</th>
                <th className="px-5 py-4 whitespace-nowrap text-right text-[#22C55E]">Net Payout</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { name: "AeroTech Drones", acc: "acc_Jk9Lp...", gross: 125000, status: "READY" },
                { name: "SkyNet Systems", acc: "acc_M12Xq...", gross: 45000, status: "PROCESSING" },
                { name: "Hobbywing India", acc: "acc_B88Np...", gross: 320000, status: "FAILED" },
                { name: "Holybro Official", acc: "acc_Z10Kj...", gross: 8500, status: "READY" },
              ].map((row, i) => {
                const commission = row.gross * 0.05;
                const net = row.gross - commission;
                return (
                  <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-4 font-bold text-xs">{row.name}</td>
                    <td className="px-5 py-4 font-mono text-[10px] text-[#777777]">{row.acc}</td>
                    <td className="px-5 py-4 text-right font-mono text-sm">₹{row.gross.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono text-sm text-red-600">-₹{commission.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono text-sm font-bold text-[#22C55E]">₹{net.toLocaleString()}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                        ${row.status === 'READY' ? 'bg-blue-100 text-blue-700' : 
                          row.status === 'PROCESSING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {row.status === 'READY' ? (
                        <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider inline-flex items-center gap-1">
                          Settle <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : row.status === 'FAILED' ? (
                        <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider">
                          Retry
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">Wait</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </CapabilityGuard>
  );
}
