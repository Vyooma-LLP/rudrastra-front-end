"use client";
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

export default function OrgMembersPage() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); };
  return (
    <CapabilityGuard featureKey="platform.organizations">
<div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Team Members & Permissions</h1>
          <p className="text-xs text-[#777777]">Manage engineers, buyers, and organization roles.</p>
        </div>
        <div className="flex items-center gap-2">
          {toast && <span className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1 rounded-md">{toast}</span>}
          <button onClick={() => showToast('Invite email will send when auth backend is ready')} className="px-4 py-2 bg-[#111111] text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors">
            <UserPlus className="w-4 h-4" /> Invite Member
          </button>
        </div>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Member Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">PO Approval Limit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
            <tr>
              <td className="p-4 font-bold font-sans">Praneeth Kumar</td>
              <td className="p-4 text-[#777777]">praneeth@vyooma.tech</td>
              <td className="p-4 text-[#138808] font-semibold font-sans">Org Admin / Lead Engineer</td>
              <td className="p-4">Unlimited</td>
            </tr>
            <tr>
              <td className="p-4 font-bold font-sans">Mahesh V.</td>
              <td className="p-4 text-[#777777]">mahesh@vyooma.tech</td>
              <td className="p-4 text-[#305CDE] font-semibold font-sans">Hardware Engineer</td>
              <td className="p-4">₹50,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </CapabilityGuard>
  );
}
