"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Search, Database, FileCog, FileText, CheckCircle, SlidersHorizontal, Eye } from 'lucide-react';

export default function SpecificationAnalysisPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="engineering.specification-analysis">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Specification Analysis</h1>
            <p className="text-xs text-[#777777] mt-1">Validate catalog data structures and normalized PIM technical specifications.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <FileCog className="w-3.5 h-3.5" />
              Define New Schema
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Database className="w-4 h-4 text-[#305CDE]" />
              Active Schemas
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">24</div>
            <div className="text-xs text-[#777777] mt-1">Categories with strict validation</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Pending Validation
            </div>
            <div className="font-mono text-3xl font-bold text-amber-600">14</div>
            <div className="text-xs text-[#777777] mt-1">Products needing schema mapping</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              Catalog Health
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">98.2%</div>
            <div className="text-xs text-[#777777] mt-1">Products fully normalized</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F5F5] p-3 rounded-lg border border-[#E5E5E5]">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search category schemas (e.g., 'Motors', 'ESC')..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm outline-none focus:border-black transition-colors"
            />
          </div>
          <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-9 px-4 inline-flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Category Schema</th>
                <th className="px-5 py-4 whitespace-nowrap">Mapped Products</th>
                <th className="px-5 py-4 whitespace-nowrap">Required Fields</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Data Integrity</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { cat: "Brushless Motors (BLDC)", products: 450, fields: ["KV Rating", "Stator Size", "Max Thrust"], health: 99 },
                { cat: "Electronic Speed Controllers", products: 120, fields: ["Continuous Current", "Burst Current", "Input Voltage"], health: 95 },
                { cat: "Flight Controllers", products: 85, fields: ["MCU", "IMU", "Barometer", "Firmware"], health: 100 },
                { cat: "Telemetry & GPS", products: 45, fields: ["Constellations", "Protocol", "Update Rate"], health: 88 },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-bold text-[#111111] text-xs">{row.cat}</td>
                  <td className="px-5 py-4 font-mono text-xs">{row.products.toLocaleString()}</td>
                  <td className="px-5 py-4 text-xs text-[#777777]">
                    <div className="flex flex-wrap gap-1">
                      {row.fields.map(f => (
                        <span key={f} className="px-1.5 py-0.5 bg-[#F5F5F5] rounded text-[10px] border border-[#E5E5E5]">{f}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                      ${row.health >= 98 ? 'text-[#22C55E]' : row.health > 90 ? 'text-amber-500' : 'text-red-600'}`}>
                      {row.health}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#A1A1AA] hover:text-[#111111] transition-colors">
                      <Eye className="w-4 h-4 inline-block" />
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
