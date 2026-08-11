"use client";
import React, { useState } from 'react';
import { Wrench, UploadCloud, AlertTriangle, ArrowRight } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function AccountRmaPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="operations.rma">
<div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Technical RMA & Returns Portal</h1>
        <p className="text-xs text-[#777777]">Manage hardware diagnostics, return evidence submission, and serial-verified replacements.</p>
      </div>

      <div className="bg-[#F5F5F5] border border-[#F35C27]/40 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#F35C27] shrink-0 mt-0.5" />
        <div className="text-xs text-[#111111] space-y-1">
          <span className="font-bold text-[#F35C27]">Technical RMA Diagnostic Policy (Controls RET-001 to RET-006):</span>
          <p className="text-[#777777]">
            Drone electronics (ESCs, Flight Controllers, Motors) require electrical evidence (wiring photographs, voltage measurements, and flight controller logs) prior to return authorization. Serial numbers are strictly verified upon arrival in Quarantine.
          </p>
        </div>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 space-y-6">
        <h2 className="font-heading text-base font-bold text-[#111111] border-b border-[#E5E5E5] pb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[#F35C27]" /> Initiate New Technical RMA Request
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[#777777] font-semibold mb-1 block">Select Order & Item</label>
            <select className="w-full bg-white border border-[#E5E5E5] rounded p-2.5 text-[#111111]">
              <option>#RUD-2026-88941 • Holybro Tekko32 60A ESC (Serial: SN-TEK-9920)</option>
              <option>#RUD-2026-88941 • T-Motor Navigator MN4014 400KV</option>
            </select>
          </div>
          <div>
            <label className="text-[#777777] font-semibold mb-1 block">RMA Reason & Category</label>
            <select className="w-full bg-white border border-[#E5E5E5] rounded p-2.5 text-[#111111]">
              <option>Electrical Failure / No Power Output (DOA)</option>
              <option>Firmware Flashing / CAN Communication Error</option>
              <option>Physical / Mechanical Defect Upon Arrival</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-[#777777] font-semibold mb-1 block">Diagnostic Notes & Operating Conditions (Voltage, Battery S Rating)</label>
            <textarea rows={3} placeholder="Describe exact battery voltage (e.g. 6S 22.2V), flight controller FC build version..." className="w-full bg-white border border-[#E5E5E5] rounded p-2.5 text-[#111111]" />
          </div>
          <div className="col-span-2">
            <label className="text-[#777777] font-semibold mb-1 block">Upload Technical Evidence (Wiring Photos, FC Log Files)</label>
            <div className="border-2 border-dashed border-[#E5E5E5] hover:border-[#111111] bg-white p-6 text-center cursor-pointer">
              <UploadCloud className="w-8 h-8 text-[#777777] mx-auto mb-2" />
              <span className="text-xs text-[#777777]">Click to upload wiring photos or .bin log file</span>
            </div>
          </div>
        </div>

        <button onClick={() => _showToast('Action will be available when backend is connected')} className="px-6 py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs flex items-center gap-2">
          <span>Submit RMA for Technical Inspection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    </CapabilityGuard>
  );
}
