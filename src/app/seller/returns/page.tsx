"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Wrench, CheckCircle, Search, PackageX, RefreshCcw } from 'lucide-react';

export default function ReturnsPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="seller.returns">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Returns & Warranty Claims</h1>
            <p className="text-xs text-[#777777] mt-1">Manage RMA requests, warranty claims, and return shipments.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <PackageX className="w-4 h-4 text-amber-500" />
              Pending Review
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">12</div>
            <div className="text-xs text-[#777777] mt-1">Require authorization</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <RefreshCcw className="w-4 h-4 text-[#305CDE]" />
              In Transit
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">4</div>
            <div className="text-xs text-[#777777] mt-1">Returning to your facility</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              Resolved (30d)
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">28</div>
            <div className="text-xs text-[#777777] mt-1">Successfully processed</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F5F5] p-3 rounded-lg border border-[#E5E5E5]">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search RMA ID, Order ID, or Customer..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm outline-none focus:border-[#138808] transition-colors"
            />
          </div>
          <select className="bg-white border border-[#E5E5E5] rounded-md text-sm px-3 py-2 outline-none focus:border-[#138808]">
            <option>All Returns</option>
            <option>Pending Auth</option>
            <option>In Transit</option>
            <option>Received - Inspecting</option>
            <option>Resolved</option>
          </select>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">RMA ID</th>
                <th className="px-5 py-4 whitespace-nowrap">Order Ref</th>
                <th className="px-5 py-4 whitespace-nowrap">Product</th>
                <th className="px-5 py-4 whitespace-nowrap">Reason</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { rma: "RMA-2026-081", order: "ORD-9981-A", item: "Holybro Pixhawk 6C", reason: "Defective out of box", status: "PENDING_AUTH" },
                { rma: "RMA-2026-080", order: "ORD-9942-B", item: "T-Motor MN4014", reason: "Wrong item received", status: "IN_TRANSIT" },
                { rma: "RMA-2026-079", order: "ORD-9811-C", item: "Here3 GPS", reason: "Warranty claim (No lock)", status: "INSPECTING" },
                { rma: "RMA-2026-075", order: "ORD-9755-A", item: "Hobbywing 40A ESC", reason: "Burnt on first flight", status: "REFUNDED" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-[#111111] flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#A1A1AA]" />
                    {row.rma}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[#777777] hover:text-[#305CDE] cursor-pointer">{row.order}</td>
                  <td className="px-5 py-4 font-medium text-xs truncate max-w-[150px]">{row.item}</td>
                  <td className="px-5 py-4 text-xs text-[#777777]">{row.reason}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                      ${row.status === 'REFUNDED' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                        row.status === 'PENDING_AUTH' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#138808] hover:text-[#0f6c06] text-xs font-bold uppercase tracking-wider transition-colors">
                      {row.status === 'PENDING_AUTH' ? 'Review' : 'Details'}
                    </button>
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
