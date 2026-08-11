import React from 'react';
import { Clock } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function AccountTicketsPage() {
  return (
    <CapabilityGuard featureKey="operations.tickets">
<div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Support Tickets & Binding SLAs</h1>
        <p className="text-xs text-[#777777]">View active technical support tickets, SLA countdown timers, and escalation status.</p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-5 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E5E5E5] pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#F35C27] text-sm">#TCK-RUD-48392</span>
                <span className="px-2 py-0.5 border border-[#F35C27] text-[#F35C27] bg-[#F35C27]/5 font-semibold text-[10px]">OPEN • TECHNICAL SUPPORT</span>
              </div>
              <h3 className="font-bold text-[#111111] text-sm">Holybro Tekko32 ESC DShot Telemetry Protocol Mismatch</h3>
            </div>
            <div className="flex items-center gap-2 bg-white border border-[#F35C27]/40 px-3 py-1.5 text-[#F35C27] font-mono font-bold">
              <Clock className="w-3.5 h-3.5" /> SLA Timer: 03h 42m Remaining
            </div>
          </div>

          <div className="text-[#777777]">
            Assigned to: <strong className="text-[#111111]">L2 Senior Technical Engineer (Mahesh V.)</strong> • Order: <strong className="text-[#111111]">#RUD-2026-88941</strong>
          </div>
        </div>
      </div>
    </div>
    </CapabilityGuard>
  );
}
