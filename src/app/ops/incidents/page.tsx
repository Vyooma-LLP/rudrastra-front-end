"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { AlertTriangle, Clock, Headphones, RefreshCcw, Search, Flag, CheckCircle } from 'lucide-react';

export default function IncidentsPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="operations.incident-management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Incident & SLA Management</h1>
            <p className="text-xs text-[#777777] mt-1">Escalated support tickets, fulfillment breaches, and platform anomalies.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <AlertTriangle className="w-3.5 h-3.5" />
              Declare P0 Incident
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Flag className="w-4 h-4 text-red-500" />
              Active Escalations
            </div>
            <div className="font-mono text-3xl font-bold text-red-600">24</div>
            <div className="text-xs text-[#777777] mt-1">Requiring immediate L3 intervention</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Approaching SLA Breach
            </div>
            <div className="font-mono text-3xl font-bold text-amber-600">18</div>
            <div className="text-xs text-[#777777] mt-1">&lt; 4 hours remaining on response time</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              SLA Adherence (7d)
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">94.2%</div>
            <div className="text-xs text-[#22C55E] mt-1">Target: 98.0%</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F5F5] p-3 rounded-lg border border-[#E5E5E5]">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search Incident ID, Order ID, or User Email..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm outline-none focus:border-black transition-colors"
            />
          </div>
          <select className="bg-white border border-[#E5E5E5] rounded-md text-sm px-3 py-2 outline-none focus:border-black">
            <option>All Priorities</option>
            <option>P0 - Critical</option>
            <option>P1 - High</option>
            <option>P2 - Medium</option>
            <option>P3 - Low</option>
          </select>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Incident ID</th>
                <th className="px-5 py-4 whitespace-nowrap">Reporter</th>
                <th className="px-5 py-4 whitespace-nowrap">Issue Category</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Priority</th>
                <th className="px-5 py-4 whitespace-nowrap">SLA Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { id: "INC-2294", email: "procurement@aerotech.in", cat: "Fulfillment SLA Breach", p: "P1", sla: "BREACHED" },
                { id: "INC-2293", email: "seller@hobbywing.in", cat: "Payout Failure", p: "P0", sla: "AT_RISK" },
                { id: "INC-2292", email: "system.monitor", cat: "Typesense Node Down", p: "P0", sla: "RESOLVED" },
                { id: "INC-2289", email: "buyer@skynet.com", cat: "RMA Rejection Dispute", p: "P2", sla: "ON_TRACK" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-[#111111]">
                    <div className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-[#A1A1AA]" />
                      {row.id}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[#777777]">{row.email}</td>
                  <td className="px-5 py-4 font-medium text-sm">{row.cat}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider 
                      ${row.p === 'P0' ? 'bg-red-600 text-white' : 
                        row.p === 'P1' ? 'bg-amber-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
                      {row.p}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider
                      ${row.sla === 'BREACHED' ? 'text-red-600' : 
                        row.sla === 'AT_RISK' ? 'text-amber-500' : 
                        row.sla === 'RESOLVED' ? 'text-[#777777]' : 'text-[#22C55E]'}`}>
                      {row.sla === 'BREACHED' ? <AlertTriangle className="w-3.5 h-3.5" /> : 
                       row.sla === 'AT_RISK' ? <Clock className="w-3.5 h-3.5" /> : 
                       row.sla === 'RESOLVED' ? <CheckCircle className="w-3.5 h-3.5" /> : <RefreshCcw className="w-3.5 h-3.5" />}
                      {row.sla}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-xs font-bold text-[#111111] hover:text-[#305CDE] transition-colors uppercase tracking-wider">
                      Review
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
