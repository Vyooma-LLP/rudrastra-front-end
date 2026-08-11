"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Database, AlertCircle, Search, Link as LinkIcon, Check, X } from 'lucide-react';

export default function MpnResolutionPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="catalog.mpn-resolution">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">MPN Resolution Desk</h1>
            <p className="text-xs text-[#777777] mt-1">Resolve manufacturer part number (MPN) conflicts and deduplicate catalog entries.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Database className="w-3.5 h-3.5" />
              Run Auto-Deduplication
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center">
              <h2 className="font-heading font-bold text-sm text-[#111111]">Pending MPN Conflicts</h2>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">12 Issues</span>
            </div>
            <div className="flex-1 overflow-auto bg-[#F5F5F5] p-4 space-y-4">
              
              <div className="bg-white border border-red-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-red-600 mb-2 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" /> Conflict Detected
                </div>
                <p className="text-sm font-medium mb-3">Two different sellers submitted products with the same MPN but different specifications.</p>
                <div className="space-y-2">
                  <div className="p-2 border border-[#E5E5E5] rounded bg-[#FAFAFA] flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-[#111111]">Seller A (Robouav)</div>
                      <div className="text-[#777777] font-mono mt-0.5">MPN: TM-MN4014-330 | KV: 330</div>
                    </div>
                    <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#305CDE] font-bold hover:underline">Select as Canonical</button>
                  </div>
                  <div className="p-2 border border-[#E5E5E5] rounded bg-[#FAFAFA] flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-[#111111]">Seller B (DroneParts)</div>
                      <div className="text-[#777777] font-mono mt-0.5">MPN: TM-MN4014-330 | KV: 400</div>
                    </div>
                    <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#305CDE] font-bold hover:underline">Select as Canonical</button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center">
              <h2 className="font-heading font-bold text-sm text-[#111111]">Orphaned SKUs</h2>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777777]" />
                <input type="text" placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 bg-[#F5F5F5] border-none rounded text-xs outline-none" />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#E5E5E5] text-sm">
                  {[
                    { sku: "SKU-HBY-099", name: "Generic 40A ESC" },
                    { sku: "SKU-FOX-212", name: "Foxeer 5G8 VTX (Old)" },
                    { sku: "SKU-TMO-111", name: "T-Motor Prop 15x5 Carbon" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-xs text-[#111111]">{row.name}</div>
                        <div className="font-mono text-[10px] text-[#777777] mt-0.5">{row.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => _showToast('Action will be available when backend is connected')} className="inline-flex items-center gap-1 text-[10px] font-bold text-[#305CDE] uppercase tracking-wider hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                          <LinkIcon className="w-3 h-3" /> Map to MPN
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CapabilityGuard>
  );
}
