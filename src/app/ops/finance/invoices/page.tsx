"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Download, FileText, Search, Plus } from 'lucide-react';

export default function InvoicesPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="finance.invoices">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Invoices</h1>
            <p className="text-xs text-[#777777] mt-1">Platform tax invoices and B2B billing documentation.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Generate Manual Invoice
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F5F5] p-3 rounded-lg border border-[#E5E5E5]">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search by Invoice ID, Order ID, or Entity Name..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm outline-none focus:border-black transition-colors"
            />
          </div>
          <select className="bg-white border border-[#E5E5E5] rounded-md text-sm px-3 py-2 outline-none focus:border-black">
            <option>All Types</option>
            <option>Tax Invoice</option>
            <option>Commission Invoice</option>
            <option>Proforma</option>
          </select>
          <select className="bg-white border border-[#E5E5E5] rounded-md text-sm px-3 py-2 outline-none focus:border-black">
            <option>All Statuses</option>
            <option>Generated</option>
            <option>Sent</option>
            <option>Paid</option>
            <option>Overdue</option>
          </select>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Invoice ID</th>
                <th className="px-5 py-4 whitespace-nowrap">Date</th>
                <th className="px-5 py-4 whitespace-nowrap">Billed To</th>
                <th className="px-5 py-4 whitespace-nowrap">Type</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Amount (INR)</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { id: "INV-2026-0899", date: "Aug 10, 2026", entity: "AeroTech Drones Pvt Ltd", type: "Commission", amount: 12500, status: "GENERATED" },
                { id: "INV-2026-0898", date: "Aug 09, 2026", entity: "Garuda Aerospace", type: "Tax Invoice", amount: 450000, status: "PAID" },
                { id: "INV-2026-0897", date: "Aug 08, 2026", entity: "IdeaForge Technology", type: "Tax Invoice", amount: 89000, status: "PAID" },
                { id: "INV-2026-0896", date: "Aug 01, 2026", entity: "SkyNet Systems", type: "Commission", amount: 5600, status: "OVERDUE" },
                { id: "INV-2026-0895", date: "Jul 28, 2026", entity: "Hobbywing India", type: "Tax Invoice", amount: 120000, status: "PAID" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#777777]" />
                    {row.id}
                  </td>
                  <td className="px-5 py-4 text-[#777777] font-mono text-xs">{row.date}</td>
                  <td className="px-5 py-4 font-medium">{row.entity}</td>
                  <td className="px-5 py-4 text-xs text-[#777777]">{row.type}</td>
                  <td className="px-5 py-4 text-right font-mono text-sm font-bold">₹{row.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                      ${row.status === 'PAID' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                        row.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#777777] hover:text-[#111111] transition-colors" title="Download PDF">
                      <Download className="w-4 h-4 inline-block" />
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
