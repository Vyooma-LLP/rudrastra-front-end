"use client";

import React from 'react';
import { FeatureKey } from '@/features/registry/keys';
import { CAPABILITIES } from '@/features/registry/capabilities';
import { ShieldAlert, AlertOctagon, HelpCircle } from 'lucide-react';
import { useCapabilitiesContext } from './CapabilitiesContext';

interface CapabilityGuardProps {
  featureKey: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  hideCompletely?: boolean;
}

/**
 * Visual guard component that intercepts rendering if a capability 
 * or any of its transitive dependencies are marked as EMERGENCY_KILLED.
 */
export function CapabilityGuard({ featureKey, children, fallback, hideCompletely }: CapabilityGuardProps) {
  const { capabilitiesState } = useCapabilitiesContext();
  // Helper to check if a specific key or any of its dependencies are killed
  const isKilled = (key: FeatureKey): { killed: boolean; key?: FeatureKey } => {
    if (capabilitiesState[key] === 'EMERGENCY_KILLED') {
      return { killed: true, key };
    }
    
    const definition = CAPABILITIES.find(c => c.key === key);
    if (definition && definition.dependencies) {
      for (const dep of definition.dependencies) {
        const depCheck = isKilled(dep);
        if (depCheck.killed) {
          return depCheck;
        }
      }
    }
    
    return { killed: false };
  };

  const check = isKilled(featureKey);
  const isAvailable = !check.killed;
  const killedReason = check.killed
    ? (check.key === featureKey 
        ? `Capability [${featureKey}] was disabled via emergency override.`
        : `Dependency [${check.key}] is currently offline.`)
    : "";

  if (!isAvailable) {
    if (hideCompletely) return null;
    if (fallback) return <>{fallback}</>;

    return (
      <div className="w-full max-w-[1200px] mx-auto px-6 py-20 flex flex-col items-center justify-center text-center relative">
        <div className="w-20 h-20 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <AlertOctagon className="w-10 h-10 animate-pulse" />
        </div>
        
        <h1 className="font-heading font-black text-3xl text-red-950 uppercase tracking-tight">
          Capability Offline
        </h1>
        
        <div className="mt-4 p-5 bg-red-50/50 border border-red-100 rounded-xl max-w-xl text-left space-y-3">
          <div className="flex gap-2.5 items-start">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-950 uppercase">Emergency Fencing Triggered</h4>
              <p className="text-xs text-red-700 mt-1 font-medium leading-relaxed">
                Platform Operations has triggered an active kill switch override protecting the fleet from anomalies. This capability is temporarily fenced.
              </p>
            </div>
          </div>
          <div className="border-t border-red-100/50 pt-2 text-[10px] font-mono text-red-600 flex items-center justify-between">
            <span>MUTATION GUARD V4.0</span>
            <span className="font-bold">{killedReason}</span>
          </div>
        </div>
        
        <p className="text-xs text-[#777777] mt-8 max-w-md">
          Please contact system operations at <span className="font-semibold text-slate-800">ops@vyooma.tech</span> if you believe this is an error.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
