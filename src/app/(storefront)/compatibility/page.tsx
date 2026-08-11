"use client";
import { useState } from "react";
import { CapabilityGuard } from "@/components/layout/CapabilityGuard";
import Link from "next/link";
import { useCommand } from "@/hooks/useCommand";
import { MockCheckCompatibilityAdapter } from "@/modules/compatibility/frontend-contracts/MockCompatibilityAdapter";
import { CheckCompatibilityResult, ComponentSelection } from "@/modules/compatibility/frontend-contracts/CompatibilityContract";

const checkCompatibilityCommand = new MockCheckCompatibilityAdapter();

/**
 * P0: Compatibility Builder
 * Interactive system validation.
 */
export default function CompatibilityPage() {
  const [result, setResult] = useState<CheckCompatibilityResult | null>(null);

  const [selection, setSelection] = useState<ComponentSelection>({
    motor: "T-Motor MN4014",
    esc: "Hobbywing XRotor 40A",
    flightController: "Pixhawk 6X",
    battery: "6S 5000mAh LiPo",
    propeller: "APC 15x5E"
  });

  const { execute, isLoading: checking } = useCommand({
    command: checkCompatibilityCommand,
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const handleCheck = () => {
    setResult(null);
    execute(selection);
  };

  return (
    <CapabilityGuard featureKey="engineering.compatibility">
    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
          Know it works before you <span className="text-[var(--success)]">buy it.</span>
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl">
          Validate electrical, mechanical and communication compatibility across your drone system.
        </p>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* BUILDER FORM */}
        <div className="bg-white border border-[var(--border)] p-8">
          <h2 className="font-heading font-bold text-[18px] mb-8 uppercase tracking-widest text-[var(--muted-foreground)]">Select <span className="text-[var(--accent)]">Components</span></h2>
          
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="font-sans text-[13px] font-bold mb-2">Motor</label>
              <select value={selection.motor} onChange={e => setSelection({...selection, motor: e.target.value})} className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
                <option>T-Motor MN4014</option>
                <option>T-Motor MN3510</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="font-sans text-[13px] font-bold mb-2">ESC</label>
              <select value={selection.esc} onChange={e => setSelection({...selection, esc: e.target.value})} className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
                <option>Hobbywing XRotor 40A</option>
                <option>T-Motor FLAME 60A</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-sans text-[13px] font-bold mb-2">Flight Controller</label>
              <select value={selection.flightController} onChange={e => setSelection({...selection, flightController: e.target.value})} className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
                <option>Pixhawk 6X</option>
                <option>Cube Orange+</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-sans text-[13px] font-bold mb-2">Battery</label>
              <select value={selection.battery} onChange={e => setSelection({...selection, battery: e.target.value})} className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
                <option>6S 5000mAh LiPo</option>
                <option>12S 10000mAh Solid State</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="font-sans text-[13px] font-bold mb-2">Propeller</label>
              <select value={selection.propeller} onChange={e => setSelection({...selection, propeller: e.target.value})} className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
                <option>APC 15x5E</option>
                <option>T-Motor 16x5.4 Carbon</option>
              </select>
            </div>

            <button 
              onClick={handleCheck}
              disabled={checking}
              className="w-full h-14 bg-[var(--foreground)] text-white font-sans font-bold uppercase tracking-wider text-[14px] hover:bg-[var(--primary)] transition-colors mt-4 disabled:opacity-50"
            >
              {checking ? "Analyzing..." : "Check System"}
            </button>
          </div>
        </div>

        {/* RESULTS TERMINAL */}
        <div className="bg-[#111111] text-white p-8 relative flex flex-col h-full min-h-[400px]">
          <h2 className="font-heading font-bold text-[18px] mb-8 uppercase tracking-widest text-[#666]">System <span className="text-[var(--success)]">Status</span></h2>
          
          {result === null && !checking && (
            <div className="flex-1 flex items-center justify-center text-[#444] font-mono text-[14px]">
              Awaiting system configuration...
            </div>
          )}

          {checking && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[var(--primary)] font-mono text-[14px]">
              <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Validating electrical boundaries...</span>
            </div>
          )}

          {result && (
            <div className="space-y-6 font-mono text-[14px]">
              {/* Animated appearance logic mocked via CSS classes would normally go here */}
              {result.checks.map((check, idx) => {
                const isSuccess = check.type === 'success';
                return (
                  <div key={check.id} className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200 fill-mode-both ${!isSuccess ? 'p-4 bg-yellow-500/10 border border-yellow-500/20 delay-300' : ''}`} style={isSuccess ? { animationDelay: `${idx * 100}ms` } : {}}>
                    <span className={isSuccess ? 'text-green-500 mt-0.5' : 'text-yellow-500 mt-0.5'}>
                      {isSuccess ? '✓' : '⚠'}
                    </span>
                    <div>
                      <div className={isSuccess ? 'font-bold' : 'text-yellow-500 font-bold'}>{check.title}</div>
                      <div className="text-[#888] text-[12px] mt-1">{check.description}</div>
                    </div>
                  </div>
                );
              })}

              <div className="mt-8 pt-8 border-t border-[#333] flex justify-end animate-in fade-in duration-200 delay-500 fill-mode-both">
                <Link href="/bom" className="bg-white text-black font-sans font-bold px-6 py-3 hover:bg-[var(--primary)] hover:text-white transition-colors duration-fast">
                  Save to BOM
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
    </CapabilityGuard>
  );
}
