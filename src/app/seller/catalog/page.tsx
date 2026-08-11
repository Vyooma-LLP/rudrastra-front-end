"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Plus, List, Search, Database, CheckCircle, AlertTriangle, FileBox } from 'lucide-react';

export default function CatalogSubmissionsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); };
  return (
    <CapabilityGuard featureKey="seller.catalog-submissions">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Catalog & Pricing</h1>
            <p className="text-xs text-[#777777] mt-1">Submit new products, map variants, and manage your bulk pricing tiers.</p>
          </div>
          <div className="flex items-center gap-2">
            {toast && (
              <span className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1 rounded-md">{toast}</span>
            )}
            <button
              onClick={() => showToast('New submission form will open when backend is ready')}
              className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#138808] text-white hover:bg-[#0f6c06] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Submission
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Database className="w-4 h-4 text-[#138808]" />
              Active Listings
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">142</div>
            <div className="text-xs text-[#777777] mt-1">Synced to master catalog</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <List className="w-4 h-4 text-amber-500" />
              In Review
            </div>
            <div className="font-mono text-3xl font-bold text-amber-600">8</div>
            <div className="text-xs text-[#777777] mt-1">Pending engineering validation</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Needs Attention
            </div>
            <div className="font-mono text-3xl font-bold text-red-600">3</div>
            <div className="text-xs text-[#777777] mt-1">Rejected or missing details</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <FileBox className="w-4 h-4 text-[#305CDE]" />
              Drafts
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">12</div>
            <div className="text-xs text-[#777777] mt-1">Unpublished submissions</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F5F5] p-3 rounded-lg border border-[#E5E5E5]">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search by SKU, MPN, or Title..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm outline-none focus:border-[#138808] transition-colors"
            />
          </div>
          <select className="bg-white border border-[#E5E5E5] rounded-md text-sm px-3 py-2 outline-none focus:border-[#138808]">
            <option>All Statuses</option>
            <option>Active</option>
            <option>In Review</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Product Details</th>
                <th className="px-5 py-4 whitespace-nowrap">My SKU</th>
                <th className="px-5 py-4 whitespace-nowrap">Base Price (INR)</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">B2B Tiers</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { name: "T-Motor MN4014 KV330", sku: "TM-MN4014-330", price: 6500, tiers: 3, status: "ACTIVE" },
                { name: "Pixhawk 6C Flight Controller", sku: "PX-6C-BASE", price: 18500, tiers: 2, status: "IN_REVIEW" },
                { name: "Here3 GPS Module", sku: "HR-3-GPS-01", price: 8200, tiers: 1, status: "ACTIVE" },
                { name: "Hobbywing X-Rotor 40A ESC", sku: "HW-XR40-V2", price: 2100, tiers: 4, status: "REJECTED" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-medium">{row.name}</td>
                  <td className="px-5 py-4 font-mono text-xs text-[#777777]">{row.sku}</td>
                  <td className="px-5 py-4 font-mono text-sm font-bold">₹{row.price.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F5F5F5] text-xs font-bold border border-[#E5E5E5]">
                      {row.tiers}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                      ${row.status === 'ACTIVE' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                        row.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {row.status === 'ACTIVE' && <CheckCircle className="w-3 h-3" />}
                      {row.status === 'REJECTED' && <AlertTriangle className="w-3 h-3" />}
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => showToast(`Editing ${row.sku} — form opens when backend is ready`)} className="text-[#138808] hover:text-[#0f6c06] text-xs font-bold uppercase tracking-wider transition-colors">
                      Edit
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
