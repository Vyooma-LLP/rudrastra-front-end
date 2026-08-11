import React from 'react';
import { FolderGit2, FileText, CreditCard } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function OrgDashboardPage() {
  return (
    <CapabilityGuard featureKey="platform.organizations">
<div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Organization Workspace & Spend Metrics</h1>
        <p className="text-xs text-[#777777]">Vyooma Technologies Private Limited (GSTIN: 36AAACV9981K1Z9)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Approved Net Terms Credit</span>
            <CreditCard className="w-4 h-4 text-[#138808]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">₹5,00,000</div>
          <div className="text-[11px] text-[#138808] font-semibold">₹4,41,826 credit available</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Active Engineering Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#305CDE]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">3</div>
          <div className="text-[11px] text-[#777777]">Autonomous FOD, Solar Quad</div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 space-y-1">
          <div className="text-xs text-[#777777] font-semibold flex items-center justify-between">
            <span>Pending PO Approvals</span>
            <FileText className="w-4 h-4 text-[#F35C27]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#111111]">1</div>
          <div className="text-[11px] text-[#F35C27] font-semibold">1 Quote ready for sign-off</div>
        </div>
      </div>
    </div>
    </CapabilityGuard>
  );
}
