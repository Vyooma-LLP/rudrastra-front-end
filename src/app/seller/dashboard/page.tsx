import React from 'react';
import { IndianRupee, PackageCheck, AlertCircle } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function SellerDashboardPage() {
  return (
    <CapabilityGuard featureKey="seller.onboarding">
<div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Seller Merchant Dashboard</h1>
        <p className="text-xs text-[#777777]">Robouav India Private Limited • GSTIN: 27AABCR9910E1Z4</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>30-Day Sales Volume</span>
            <IndianRupee className="w-4 h-4 text-[#138808]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">₹14,82,900</div>
          <div className="text-[11px] text-[#138808] font-semibold">+18.4% vs last month</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Orders Pending Fulfillment</span>
            <PackageCheck className="w-4 h-4 text-[#F35C27]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">4</div>
          <div className="text-[11px] text-[#F35C27] font-semibold">2 Shipments SLA &lt; 12h</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Low Stock SKUs</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">2</div>
          <div className="text-[11px] text-rose-600 font-semibold">Action required</div>
        </div>
      </div>
    </div>
    </CapabilityGuard>
  );
}
