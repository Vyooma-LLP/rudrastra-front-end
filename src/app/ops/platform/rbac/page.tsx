"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Shield, Key, Users, Search, Edit2, ShieldAlert } from 'lucide-react';

export default function RbacPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="platform.rbac">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Identity & RBAC Control</h1>
            <p className="text-xs text-[#777777] mt-1">Manage Role-Based Access Control, permissions, and tenant isolation policies.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Shield className="w-3.5 h-3.5" />
              Create Custom Role
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-[#305CDE]" />
              Active System Users
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">1,284</div>
            <div className="text-xs text-[#777777] mt-1">Across all tenants</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Key className="w-4 h-4 text-[#138808]" />
              Service Roles
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">14</div>
            <div className="text-xs text-[#777777] mt-1">Background worker accounts</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Elevated Admins
            </div>
            <div className="font-mono text-3xl font-bold text-red-600">8</div>
            <div className="text-xs text-red-600 font-semibold mt-1">Warning: Monitor audit logs</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F5F5] p-3 rounded-lg border border-[#E5E5E5]">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search users, roles, or policies..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm outline-none focus:border-black transition-colors"
            />
          </div>
          <select className="bg-white border border-[#E5E5E5] rounded-md text-sm px-3 py-2 outline-none focus:border-black">
            <option>All Roles</option>
            <option>Super Admin</option>
            <option>Org Admin</option>
            <option>Seller Merchant</option>
            <option>Support L1</option>
          </select>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Role Name</th>
                <th className="px-5 py-4 whitespace-nowrap">Tenant Level</th>
                <th className="px-5 py-4 whitespace-nowrap">Key Capabilities</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">Assigned Users</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111] text-sm">
              {[
                { role: "Super Admin", tenant: "Global Platform", perms: ["platform.*", "ops.*", "finance.*"], users: 8 },
                { role: "Finance Auditor", tenant: "Global Platform", perms: ["finance.read", "ledger.reconcile"], users: 12 },
                { role: "Org Admin", tenant: "Organization", perms: ["procurement.*", "org.members"], users: 345 },
                { role: "Merchant Owner", tenant: "Seller", perms: ["seller.*", "inventory.*", "orders.*"], users: 890 },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-bold text-[#111111]">{row.role}</td>
                  <td className="px-5 py-4 text-xs font-medium text-[#777777]">{row.tenant}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {row.perms.map(p => (
                        <span key={p} className="px-1.5 py-0.5 bg-[#F5F5F5] rounded text-[10px] border border-[#E5E5E5] font-mono text-[#555]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center font-mono text-sm">{row.users.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#305CDE] hover:text-blue-800 transition-colors">
                      <Edit2 className="w-4 h-4 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CapabilityGuard>
  );
}
