import React from 'react';
import Link from 'next/link';
import { Package, Wrench, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function AccountDashboardPage() {
  return (
    <CapabilityGuard featureKey="platform.account">
<div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Engineering Account Overview</h1>
        <p className="text-xs text-[#777777]">Manage orders, active warranties, support tickets, and hardware returns.</p>
      </div>

      {/* Metrics Row - Clean Light Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-[#F35C27]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">12</div>
          <div className="text-[11px] text-[#777777]">Last order placed today</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Active Warranties</span>
            <ShieldCheck className="w-4 h-4 text-[#138808]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">18</div>
          <div className="text-[11px] text-[#138808] font-semibold">All components in policy</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Active Support Tickets</span>
            <Headphones className="w-4 h-4 text-[#F35C27]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">1</div>
          <div className="text-[11px] text-[#F35C27] font-semibold">SLA: 4h remaining</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>RMA Claims</span>
            <Wrench className="w-4 h-4 text-[#305CDE]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">0</div>
          <div className="text-[11px] text-[#777777]">0 pending returns</div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <h2 className="font-heading text-base font-bold text-[#111111] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#F35C27]" /> Recent Component Orders
          </h2>
          <Link href="/account/orders" className="text-xs font-semibold text-[#F35C27] hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-white border border-[#E5E5E5] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#F35C27]">#RUD-2026-88941</span>
                <span className="px-2 py-0.5 border border-[#138808] text-[#138808] bg-[#138808]/5 font-semibold text-[10px]">PROCESSING</span>
              </div>
              <p className="text-[#777777] mt-1">Project: Autonomous FOD Drone V2 • 2 Seller Split Orders</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-[#111111] text-sm">₹58,174.00</span>
              <Link href="/account/orders/RUD-2026-88941" className="px-3 py-1.5 bg-[#111111] text-white font-semibold hover:bg-black transition-colors">
                Track Shipment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </CapabilityGuard>
  );
}
