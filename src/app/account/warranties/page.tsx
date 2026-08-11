"use client";
import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function AccountWarrantiesPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="commerce.warranties">
<div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Active Component Warranties</h1>
        <p className="text-xs text-[#777777]">Track manufacturer warranties, coverage policies, and expiration dates.</p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#111111] text-sm">Cube Pilot Cube Orange+ Autopilot</span>
              <span className="px-2 py-0.5 border border-[#138808] text-[#138808] bg-[#138808]/5 font-semibold text-[10px]">WARRANTY ACTIVE</span>
            </div>
            <div className="text-[#777777]">Manufacturer: CubePilot • Serial: <span className="font-mono text-[#111111]">SN-CUBE-881920</span></div>
            <div className="text-[#777777]">Coverage: 24 Months Hardware Guarantee • Valid until Aug 9, 2028</div>
          </div>
          <button onClick={() => _showToast('Action will be available when backend is connected')} className="px-4 py-2 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-semibold text-xs transition-colors shrink-0">
            Download Policy PDF
          </button>
        </div>
      </div>
    </div>
    </CapabilityGuard>
  );
}
