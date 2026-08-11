"use client";
import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { BellRing, Mail, MessageSquare, Send, Bell, Settings2, Activity, CheckCircle } from 'lucide-react';

export default function NotificationsPage() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_toast, _setToast] = useState<string | null>(null);
  const _showToast = (msg: string) => { _setToast(msg); const timer = setTimeout(() => _setToast(null), 3000); return () => clearTimeout(timer); };
return (
    <CapabilityGuard featureKey="platform.notifications">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Notification Engine</h1>
            <p className="text-xs text-[#777777] mt-1">Manage global broadcast messages, email templates, and SMS routing logic.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => _showToast('Action will be available when backend is connected')} className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#305CDE] text-white hover:bg-blue-700 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Send className="w-3.5 h-3.5" />
              New Broadcast
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4 text-[#22C55E]" />
              System Status
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">Healthy</div>
            <div className="text-xs text-[#22C55E] mt-1">All queues operating normally</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4 text-[#305CDE]" />
              Emails (24h)
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">45.2k</div>
            <div className="text-xs text-[#777777] mt-1">99.8% delivery rate via Resend</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              SMS (24h)
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">12.8k</div>
            <div className="text-xs text-[#777777] mt-1">Primarily OTP and delivery updates</div>
          </div>
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#777777] text-xs font-semibold uppercase tracking-wider mb-2">
              <BellRing className="w-4 h-4 text-amber-500" />
              In-App / Push
            </div>
            <div className="font-mono text-3xl font-bold text-[#111111]">142k</div>
            <div className="text-xs text-[#777777] mt-1">Platform alerts & activity</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center">
              <h2 className="font-heading font-bold text-sm text-[#111111]">Active Templates</h2>
              <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#305CDE] text-xs font-bold uppercase tracking-wider hover:underline">View All</button>
            </div>
            <div className="flex-1 overflow-auto">
              <ul className="divide-y divide-[#E5E5E5]">
                {[
                  { name: "Order Confirmation", channel: "Email", id: "tpl_order_conf_v2" },
                  { name: "Delivery Partner Assigned", channel: "SMS", id: "tpl_sms_delivery_01" },
                  { name: "Vendor Payout Processed", channel: "In-App", id: "tpl_app_payout_ok" },
                  { name: "Password Reset OTP", channel: "SMS", id: "tpl_auth_reset_otp" },
                ].map((tpl, i) => (
                  <li key={i} className="p-4 hover:bg-[#FAFAFA] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-[#111111]">{tpl.name}</div>
                      <div className="text-xs text-[#777777] font-mono mt-1">{tpl.id}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
                        ${tpl.channel === 'Email' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          tpl.channel === 'SMS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {tpl.channel === 'Email' && <Mail className="w-3 h-3" />}
                        {tpl.channel === 'SMS' && <MessageSquare className="w-3 h-3" />}
                        {tpl.channel === 'In-App' && <Bell className="w-3 h-3" />}
                        {tpl.channel}
                      </span>
                      <button onClick={() => _showToast('Action will be available when backend is connected')} className="text-[#A1A1AA] hover:text-[#111111]"><Settings2 className="w-4 h-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center">
              <h2 className="font-heading font-bold text-sm text-[#111111]">Recent Failed Deliveries</h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="flex flex-col items-center justify-center h-full text-[#777777] space-y-3 pb-8 pt-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#22C55E]">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm text-[#111111]">No Delivery Failures</p>
                  <p className="text-xs mt-1">All notification queues are processing cleanly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CapabilityGuard>
  );
}
