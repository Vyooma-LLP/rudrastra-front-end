"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { CheckSquare, XSquare, Clock, Filter, AlertTriangle } from 'lucide-react';

export default function ApprovalsPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="procurement.approvals">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">PO & RFQ Approvals</h1>
            <p className="text-xs text-[#777777] mt-1">Multi-level approval workflows for enterprise procurement requests.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filter By Department
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Pending My Approval
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">12</div>
            <div className="text-xs text-[#777777] mt-1">Total value: ₹8,45,000</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckSquare className="w-4 h-4 text-[#22C55E]" />
              Approved This Month
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">45</div>
            <div className="text-xs text-[#777777] mt-1">Total value: ₹32,10,000</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Rejected / Blocked
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">3</div>
            <div className="text-xs text-[#777777] mt-1">Budget exceeded or missing justification</div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Request ID</th>
                <th className="px-5 py-4 whitespace-nowrap">Requester</th>
                <th className="px-5 py-4 whitespace-nowrap">Department</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Amount (INR)</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { id: "REQ-2026-081", req: "R&D Team Alpha", dept: "Engineering", amt: 250000, status: "PENDING_L2" },
                { id: "REQ-2026-080", req: "Manufacturing Hub", dept: "Operations", amt: 89000, status: "PENDING_L1" },
                { id: "REQ-2026-079", req: "Flight Testing", dept: "QA", amt: 45000, status: "APPROVED" },
                { id: "REQ-2026-078", req: "Prototyping Lab", dept: "Engineering", amt: 1200000, status: "REJECTED" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-[#111111]">{row.id}</td>
                  <td className="px-5 py-4 font-medium">{row.req}</td>
                  <td className="px-5 py-4 text-xs text-[#777777]">{row.dept}</td>
                  <td className="px-5 py-4 text-right font-mono text-sm font-bold">₹{row.amt.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                      ${row.status === 'APPROVED' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                        row.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {row.status.includes('PENDING') ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-red-600 hover:text-red-800 transition-colors" title="Reject">
                          <XSquare className="w-5 h-5" />
                        </button>
                        <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#22C55E] hover:text-green-700 transition-colors" title="Approve">
                          <CheckSquare className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-bold">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CapabilityGuard>
  );
}
