"use client";

import React, { useState, useEffect } from 'react';
import { CAPABILITIES } from '@/features/registry/capabilities';
import { FeatureKey } from '@/features/registry/keys';
import { ImpactAnalyzer } from '@/features/evaluator/impact-analyzer';
import { ShieldAlert, ArrowLeft, GitMerge, Activity, Building2, Users, Store, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthContext';
import { useCapability } from '@/hooks/useCapability';
import { useCapabilitiesContext } from '@/components/layout/CapabilitiesContext';

export default function CapabilityInspectPage({ params }: { params: { featureKey: string } }) {
  const { capabilitiesState, toggleCapability } = useCapabilitiesContext();
  const featureKey = params.featureKey as FeatureKey;
  const capability = CAPABILITIES.find(c => c.key === featureKey);
  
  if (!capability) {
    notFound();
  }

  const { session } = useAuth();
  const { canApproveCatalog } = useCapability();
  const userEmail = session?.userEmail || "";
  const sessionRole = session?.role || "logged_out";
  const authorized = canApproveCatalog;
  const isKilled = capabilitiesState[featureKey] === 'EMERGENCY_KILLED';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [impact, setImpact] = useState<any>({
    directDependents: [],
    transitiveDependents: [],
    affectedOrganizationsCount: 0,
    activeUsersAffectedCount: 0,
    activeSellersAffectedCount: 0,
    activeWorkflowsAffectedCount: 0,
    blocksFinancialTransactions: false,
    requiresTwoPersonApproval: false,
    reversibility: 'YES'
  });

  useEffect(() => {
    const loadState = async () => {
      // Load static/simulated blast radius impact metadata
      const analysis = await ImpactAnalyzer.analyze(featureKey, 'production');
      setImpact(analysis);
    };

    loadState();
  }, [featureKey]);

  const isOwner = userEmail === "praneeth@vyooma.tech";

  const handleToggleKill = async () => {
    if (!isOwner) return;

    try {
      await toggleCapability(featureKey);
    } catch (e) {
      console.error(e);
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-red-50 border border-red-100 rounded-2xl">
        <ShieldAlert className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-heading font-black text-red-900 uppercase">Access Denied</h2>
        <p className="text-sm text-red-700 mt-2 max-w-md font-semibold">
          You are currently in client role context: <span className="font-mono text-xs uppercase px-2 py-0.5 bg-red-100 border border-red-200 rounded">{sessionRole}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/ops/control-center" className="inline-flex items-center gap-2 text-sm text-[#777777] hover:text-[#111111] font-semibold mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Control Center
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E5E5] pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase
                ${capability.riskClass === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
                  capability.riskClass === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                  capability.riskClass === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                  'bg-green-100 text-green-700 border border-green-200'
                }
              `}>
                {capability.riskClass} RISK
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-[10px] font-bold uppercase">
                {capability.domain}
              </span>
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
            </div>
            <h1 className="text-3xl font-heading font-black text-[#111111] tracking-tight font-mono">
              {capability.key}
            </h1>
            <p className="text-[#555555] text-base mt-2 max-w-2xl font-medium">
              {capability.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled={!isOwner}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] text-[#111111] text-sm font-bold rounded-md hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GitMerge className="w-4 h-4" /> Request Rollout Change
            </button>
            {isKilled ? (
              <button 
                onClick={handleToggleKill}
                disabled={!isOwner}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-md hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldCheck className="w-4 h-4" /> Restore Capability
              </button>
            ) : (
              <button 
                onClick={handleToggleKill}
                disabled={!isOwner}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldAlert className="w-4 h-4" /> Emergency Kill
              </button>
            )}
          </div>
        </div>
      </div>

      {!isOwner && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-semibold">
          Platform Owner credentials (<span className="font-mono text-amber-950 font-black">praneeth@vyooma.tech</span>) required to issue rollout adjustments or toggle emergency kills.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Blast Radius */}
        <div className="lg:col-span-2 space-y-8">
          
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2 mb-4 border-b border-[#E5E5E5] pb-2">
              <Activity className="w-4 h-4 text-rose-600" /> Blast Radius Analysis
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#777777] mb-2">
                  <Building2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Organizations</span>
                </div>
                <div className="text-2xl font-black text-[#111111]">{impact.affectedOrganizationsCount}</div>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#777777] mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Active Users</span>
                </div>
                <div className="text-2xl font-black text-[#111111]">{impact.activeUsersAffectedCount}</div>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#777777] mb-2">
                  <Store className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Active Sellers</span>
                </div>
                <div className="text-2xl font-black text-[#111111]">{impact.activeSellersAffectedCount}</div>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#777777] mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Active Workflows</span>
                </div>
                <div className="text-2xl font-black text-[#111111]">{impact.activeWorkflowsAffectedCount}</div>
              </div>
            </div>

            {impact.blocksFinancialTransactions && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-orange-800">Financial Disruption Warning</h4>
                  <p className="text-xs text-orange-700 mt-1 font-medium">Disabling this capability will interrupt commerce/financial domains directly or transitively.</p>
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2 mb-4 border-b border-[#E5E5E5] pb-2">
              <GitMerge className="w-4 h-4 text-rose-600" /> Transitive Dependency Tree
            </h2>
            
            <div className="bg-white border border-[#E5E5E5] rounded-lg p-5">
              <div className="space-y-4">
                <div>
                  <h3 className="text-[10px] font-bold uppercase text-[#777777] mb-2">Direct Dependents (Fail if this fails)</h3>
                  {impact.directDependents.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {impact.directDependents.map((dep: string) => (
                        <span key={dep} className="px-2 py-1 bg-red-50 border border-red-100 text-red-700 text-xs font-mono font-bold rounded">
                          {dep}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#777777] italic">No direct dependents.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-[10px] font-bold uppercase text-[#777777] mb-2">Transitive Dependents</h3>
                  {impact.transitiveDependents.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {impact.transitiveDependents.map((dep: string) => (
                        <span key={dep} className="px-2 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-mono font-bold rounded">
                          {dep}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#777777] italic">No transitive dependents.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Precedence & State */}
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2 mb-4 border-b border-[#E5E5E5] pb-2">
              <ShieldCheck className="w-4 h-4 text-rose-600" /> Required Precedence
            </h2>
            <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-lg p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#555555]">Lifecycle</span>
                <span className="font-bold text-[#111111] uppercase">{capability.lifecycle.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#555555]">Two-Person Approval</span>
                <span className={`font-bold uppercase ${impact.requiresTwoPersonApproval ? 'text-orange-600' : 'text-green-600'}`}>
                  {impact.requiresTwoPersonApproval ? 'REQUIRED' : 'NOT REQUIRED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#555555]">Reversibility</span>
                <span className="font-bold text-green-600 uppercase">{impact.reversibility}</span>
              </div>
              {capability.defaultEntitlement && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#555555]">Default Entitlement</span>
                  <span className="font-bold text-[#111111] uppercase">{capability.defaultEntitlement}</span>
                </div>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
