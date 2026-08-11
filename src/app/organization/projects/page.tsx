"use client";
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function OrgProjectsPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="procurement.projects">
<div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Engineering Projects</h1>
          <p className="text-xs text-[#777777]">Allocate purchases and component BOMs to specific engineering drone builds.</p>
        </div>
        <button onClick={() => _showToast('Action will be available when backend is connected')} className="px-4 py-2 bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors">
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[10px] text-[#305CDE] border border-[#305CDE] bg-[#305CDE]/5 px-2 py-0.5 font-bold">PRJ-882</span>
              <h3 className="font-bold text-[#111111] text-base mt-1">Autonomous FOD Detection Drone V2</h3>
            </div>
            <span className="px-2 py-0.5 border border-[#138808] text-[#138808] bg-[#138808]/5 font-semibold text-[10px]">ACTIVE</span>
          </div>
          <p className="text-[#777777]">Target Build: Octaquad 6S Airframe • Lead: Praneeth K.</p>
          <div className="border-t border-[#E5E5E5] pt-3 flex justify-between text-[#111111] font-mono font-semibold">
            <span>BOM Allocated: ₹1,82,400</span>
            <span>Items: 14 Components</span>
          </div>
        </div>
      </div>
    </div>
    </CapabilityGuard>
  );
}
