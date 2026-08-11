"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, AlertCircle, Layers, RefreshCw, Eye, ShieldAlert } from 'lucide-react';
import { CAPABILITIES } from '@/features/registry/capabilities';
import Link from 'next/link';

import { useAuth } from '@/components/layout/AuthContext';
import { useCapability } from '@/hooks/useCapability';
import { useCapabilitiesContext } from '@/components/layout/CapabilitiesContext';

export default function ControlCenterPage() {
  const { session } = useAuth();
  const { canApproveCatalog } = useCapability();
  const { capabilitiesState, isLoading, toggleCapability } = useCapabilitiesContext();
  const userEmail = session?.userEmail || "";
  const sessionRole = session?.role || "logged_out";
  const authorized = canApproveCatalog;
  const isOwner = userEmail === "praneeth@vyooma.tech";

  const handleToggleKill = async (key: string) => {
    if (!isOwner) return; // Prevent unauthorized mutations
    try {
      await toggleCapability(key);
    } catch (e) {
      console.error(e);
    }
  };

  // Calculate active statistics
  const stats = {
    total: CAPABILITIES.length,
    active: CAPABILITIES.filter(c => capabilitiesState[c.key] !== 'EMERGENCY_KILLED').length,
    killed: Object.values(capabilitiesState).filter(v => v === 'EMERGENCY_KILLED').length,
    staleConsumers: Object.values(capabilitiesState).filter(v => v === 'EMERGENCY_KILLED').length > 0 ? 1 : 0,
    fleetSynced: Object.values(capabilitiesState).filter(v => v === 'EMERGENCY_KILLED').length > 0 ? "92.1%" : "100%"
  };

  // Unauthorized page state
  if (!authorized) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-red-50 border border-red-100 rounded-2xl">
        <ShieldAlert className="w-12 h-12 text-red-600 mb-4 animate-bounce" />
        <h2 className="text-xl font-heading font-black text-red-900 uppercase">Access Denied</h2>
        <p className="text-sm text-red-700 mt-2 max-w-md font-semibold">
          You are currently in client role context: <span className="font-mono text-xs uppercase px-2 py-0.5 bg-red-100 border border-red-200 rounded">{sessionRole}</span>.
        </p>
        <p className="text-xs text-red-600 mt-1 max-w-sm">
          Please use the Dev Context Panel in the user profile dropdown to switch to <span className="font-bold">Ops or Owner role</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
        <div>
          <h1 className="text-2xl font-heading font-black text-[#111111] uppercase tracking-tight">
            Capability Control Center
          </h1>
          <p className="text-[#555555] text-sm mt-1 max-w-2xl">
            Strict v4.0 Control Plane. Manage platform capabilities, commercial entitlements, and emergency overrides across the global fleet.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            ENV: PRODUCTION
          </div>
          {isOwner ? (
            <div className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-bold font-mono">
              ROLE: PLATFORM OWNER
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-bold font-mono">
              READ-ONLY MODE (AGENT)
            </div>
          )}
        </div>
      </div>

      {/* Access Denied Warning banner for normal ops */}
      {!isOwner && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="text-sm font-bold text-amber-800">Operational Policy Control Constraint</h4>
            <p className="text-xs text-amber-700 mt-1 font-semibold">
              Read-Only credentials loaded. Only the platform owner (<span className="font-mono text-amber-950 font-black">praneeth@vyooma.tech</span>) is authorized to execute state changes, emergency kills, and rollout configuration mutations.
            </p>
          </div>
        </div>
      )}

      {/* Fleet Health Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-[#555555] mb-2">
            <Layers className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Capabilities</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-[#111111] leading-none">{stats.total}</span>
            <span className="text-xs text-[#777777] font-medium mb-1">({stats.active} Active)</span>
          </div>
        </div>
        
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-[#555555] mb-2">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Emergency Kills</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-black leading-none ${stats.killed > 0 ? 'text-red-600' : 'text-[#111111]'}`}>{stats.killed}</span>
            {stats.killed > 0 && (
              <span className="text-xs text-red-600 font-medium mb-1 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded">Active</span>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-[#555555] mb-2">
            <RefreshCw className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Fleet Sync</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-black leading-none ${stats.killed > 0 ? 'text-orange-500' : 'text-green-600'}`}>{stats.fleetSynced}</span>
            <span className="text-xs text-[#777777] font-medium mb-1">Propagating</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-[#555555] mb-2">
            <AlertCircle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Stale Consumers</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-black leading-none ${stats.killed > 0 ? 'text-orange-600' : 'text-[#111111]'}`}>{stats.staleConsumers}</span>
            <span className="text-xs text-[#777777] font-medium mb-1">Fencing Enabled</span>
          </div>
        </div>
      </div>

      {/* Capabilities List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#555555]">Registered Capabilities</h2>
        
        <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-xs uppercase text-[#555555] font-semibold">
                <tr>
                  <th className="px-6 py-4">Capability Key</th>
                  <th className="px-6 py-4">Domain</th>
                  <th className="px-6 py-4">Risk Class</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Kill Switch</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {CAPABILITIES.map((cap) => {
                  const state = capabilitiesState[cap.key] || 'ACTIVE';
                  const isKilled = state === 'EMERGENCY_KILLED';
                  
                  return (
                    <tr key={cap.key} className="hover:bg-[#F9FAFB] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-mono font-semibold text-[#111111]">{cap.key}</div>
                        <div className="text-xs text-[#777777] mt-1">{cap.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-[10px] font-bold uppercase">
                          {cap.domain}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase
                          ${cap.riskClass === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
                            cap.riskClass === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                            cap.riskClass === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            'bg-green-100 text-green-700 border border-green-200'
                          }
                        `}>
                          {cap.riskClass}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isKilled ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            KILLED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleKill(cap.key)}
                          disabled={!isOwner}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            isKilled ? 'bg-red-600' : 'bg-gray-200'
                          } ${!isOwner ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isKilled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/ops/control-center/${cap.key}`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#E5E5E5] text-[#111111] rounded hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
