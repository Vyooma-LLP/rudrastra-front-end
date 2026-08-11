"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Package, Truck, Box, CheckCircle, AlertTriangle, ArrowRight, MapPin, Search } from 'lucide-react';

export default function FulfillmentPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="operations.fulfillment">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Fulfillment & Logistics</h1>
            <p className="text-xs text-[#777777] mt-1">Global operations control for shipping, warehouse routing, and delivery SLAs.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Truck className="w-3.5 h-3.5" />
              Sync Shiprocket Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Box className="w-4 h-4 text-blue-500" />
              Pending Processing
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">1,204</div>
            <div className="text-xs text-[#777777] mt-1">Orders awaiting packing</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Truck className="w-4 h-4 text-amber-500" />
              In Transit
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">452</div>
            <div className="text-xs text-[#777777] mt-1">Active shipments</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              SLA Breaches
            </div>
            <div className="font-mono text-3xl font-bold text-red-600">14</div>
            <div className="text-xs text-red-600 mt-1">Delayed past 48 hours</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              Delivered Today
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">892</div>
            <div className="text-xs text-[#22C55E] mt-1">99.2% success rate</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F5F5] p-3 rounded-lg border border-[#E5E5E5]">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search AWB, Order ID, or Courier..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm outline-none focus:border-black transition-colors"
            />
          </div>
          <select className="bg-white border border-[#E5E5E5] rounded-md text-sm px-3 py-2 outline-none focus:border-black">
            <option>All Carriers</option>
            <option>Delhivery</option>
            <option>BlueDart</option>
            <option>FedEx</option>
          </select>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">AWB / Courier</th>
                <th className="px-5 py-4 whitespace-nowrap">Order Details</th>
                <th className="px-5 py-4 whitespace-nowrap">Origin</th>
                <th className="px-5 py-4 whitespace-nowrap">Destination</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { awb: "DEL123456789", courier: "Delhivery Surface", order: "ORD-8922", seller: "AeroTech Drones", origin: "Bangalore (KA)", dest: "Mumbai (MH)", status: "IN_TRANSIT" },
                { awb: "BLU987654321", courier: "BlueDart Air", order: "ORD-8921", seller: "IdeaForge", origin: "Pune (MH)", dest: "Chennai (TN)", status: "DELIVERED" },
                { awb: "FDX112233445", courier: "FedEx Priority", order: "ORD-8919", seller: "SkyNet Systems", origin: "Delhi (DL)", dest: "Hyderabad (TG)", status: "DELAYED" },
                { awb: "AWAITING_AWB", courier: "Unassigned", order: "ORD-8925", seller: "Hobbywing India", origin: "Gurugram (HR)", dest: "Bangalore (KA)", status: "PROCESSING" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-mono text-xs font-bold text-[#111111]">{row.awb}</div>
                    <div className="text-[11px] text-[#777777] uppercase tracking-wider mt-0.5">{row.courier}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-xs text-[#111111]">{row.order}</div>
                    <div className="text-xs text-[#777777] mt-0.5">{row.seller}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#A1A1AA]" /> {row.origin}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#305CDE]" /> {row.dest}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                      ${row.status === 'DELIVERED' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                        row.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' : 
                        row.status === 'DELAYED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#111111] hover:text-[#305CDE] transition-colors text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
                      Track <ArrowRight className="w-3 h-3" />
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
