"use client";
import React, { useState } from 'react';

export default function OpsCatalogPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">PIM Catalog Verification Desk</h1>
        <p className="text-xs text-[#777777]">Review candidate canonical MPNs, categories, and technical specifications.</p>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">MPN / Model</th>
              <th className="p-4">Manufacturer</th>
              <th className="p-4">Category</th>
              <th className="p-4">Submission Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
            <tr>
              <td className="p-4 font-bold">MN4014-400KV</td>
              <td className="p-4 font-sans">T-Motor</td>
              <td className="p-4 font-sans">Brushless Motors</td>
              <td className="p-4 text-[#F35C27] font-sans font-semibold">PENDING REVIEW</td>
              <td className="p-4">
                <button onClick={() => _showToast('Action will be available when backend is connected')} className="px-3 py-1 bg-[#111111] text-white hover:bg-black text-[11px] font-sans font-bold">Verify Specs</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
