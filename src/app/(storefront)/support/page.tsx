import React from 'react';
import Link from 'next/link';
import { Headphones, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function SupportPage() {
  return (
    <CapabilityGuard featureKey="operations.customer-support">
<div className="min-h-screen bg-[#F5F5F5] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-[#111111] flex items-center gap-3">
            <Headphones className="w-8 h-8 text-[#F35C27]" />
            Technical Engineering Support & RMA Desk
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Get technical assistance from hardware engineers, report non-conformance, or open binding SLA tickets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 bg-[#F35C27]/10 border border-[#F35C27]/30 text-[#F35C27] rounded flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#111111] text-sm">Hardware Technical Support</h3>
            <p className="text-[#777777]">Open a ticket for motor timing, flight controller wiring, or CAN bus troubleshooting.</p>
            <Link href="/account/tickets" className="inline-flex items-center gap-1 text-[#F35C27] font-bold hover:underline">
              Open Ticket <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 bg-[#305CDE]/10 border border-[#305CDE]/30 text-[#305CDE] rounded flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#111111] text-sm">Technical RMA & Returns</h3>
            <p className="text-[#777777]">Submit evidence photos and flight logs for hardware replacement under diagnostic policies.</p>
            <Link href="/account/rma" className="inline-flex items-center gap-1 text-[#305CDE] font-bold hover:underline">
              File RMA Claim <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 bg-[#138808]/10 border border-[#138808]/30 text-[#138808] rounded flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#111111] text-sm">Warranty Claim & Coverage</h3>
            <p className="text-[#777777]">Check manufacturer warranty status and active policy guarantees for your serial numbers.</p>
            <Link href="/account/warranties" className="inline-flex items-center gap-1 text-[#138808] font-bold hover:underline">
              Check Warranties <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
    </CapabilityGuard>
  );
}
