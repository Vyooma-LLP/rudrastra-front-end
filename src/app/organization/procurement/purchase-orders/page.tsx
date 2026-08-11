"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { FileText, Plus, Search, MapPin, ExternalLink } from 'lucide-react';

export default function PurchaseOrdersPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="procurement.purchase-orders">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Purchase Orders</h1>
            <p className="text-xs text-[#777777] mt-1">Manage active and historical B2B Purchase Orders.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Create Draft PO
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F5F5] p-3 rounded-lg border border-[#E5E5E5]">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search PO Number, Vendor Name, or MPN..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm outline-none focus:border-black transition-colors"
            />
          </div>
          <select className="bg-white border border-[#E5E5E5] rounded-md text-sm px-3 py-2 outline-none focus:border-black">
            <option>All Statuses</option>
            <option>Draft</option>
            <option>Sent</option>
            <option>Accepted</option>
            <option>Fulfilled</option>
          </select>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">PO Number</th>
                <th className="px-5 py-4 whitespace-nowrap">Date Issued</th>
                <th className="px-5 py-4 whitespace-nowrap">Vendor</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Total Amount (INR)</th>
                <th className="px-5 py-4 whitespace-nowrap">Delivery Site</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { po: "PO-4459-VT", date: "Aug 09, 2026", vendor: "T-Motor Official", amt: 1250000, site: "Bangalore Factory", status: "ACCEPTED" },
                { po: "PO-4458-VT", date: "Aug 05, 2026", vendor: "Holybro Global", amt: 345000, site: "Pune R&D Center", status: "FULFILLED" },
                { po: "PO-4457-VT", date: "Aug 01, 2026", vendor: "Hobbywing India", amt: 89000, site: "Bangalore Factory", status: "FULFILLED" },
                { po: "PO-4460-VT", date: "Aug 10, 2026", vendor: "Foxeer Tech", amt: 45000, site: "Chennai Hub", status: "DRAFT" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-[#111111] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#A1A1AA]" />
                    {row.po}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[#777777]">{row.date}</td>
                  <td className="px-5 py-4 font-medium">{row.vendor}</td>
                  <td className="px-5 py-4 text-right font-mono text-sm font-bold">₹{row.amt.toLocaleString()}</td>
                  <td className="px-5 py-4 text-xs text-[#777777] flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {row.site}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                      ${row.status === 'FULFILLED' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                        row.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' : 'bg-[#E5E5E5] text-[#555]'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#A1A1AA] hover:text-[#111111] transition-colors">
                      <ExternalLink className="w-4 h-4 inline-block" />
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
