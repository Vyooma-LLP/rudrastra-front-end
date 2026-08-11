import React from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function SellerPayoutsPage() {
  return (
    <CapabilityGuard featureKey="seller.payouts">
<div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Razorpay Route Payouts & Settlement</h1>
        <p className="text-xs text-[#777777]">Automated multi-vendor split settlements and marketplace commission fees.</p>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Settlement ID</th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Gross Amount</th>
              <th className="p-4">Platform Fee (5%)</th>
              <th className="p-4">Net Payout</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
            <tr>
              <td className="p-4 font-bold text-[#305CDE]">SET-RZP-99201</td>
              <td className="p-4 text-[#777777]">#RUD-2026-88941</td>
              <td className="p-4">₹33,996.00</td>
              <td className="p-4 text-rose-600">-₹1,699.80</td>
              <td className="p-4 font-bold text-[#138808]">₹32,296.20</td>
              <td className="p-4 text-[#138808] font-sans font-semibold">SETTLED TO BANK</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </CapabilityGuard>
  );
}
