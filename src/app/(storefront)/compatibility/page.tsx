"use client";
import { useState } from "react";
import Link from "next/link";

/**
 * P0: Compatibility Builder
 * Interactive system validation.
 */
export default function CompatibilityPage() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const handleCheck = () => {
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      setChecking(false);
      setResult(true);
    }, 800);
  };

  return (
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
              <select className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
                <option>T-Motor MN4014</option>
                <option>T-Motor MN3510</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="font-sans text-[13px] font-bold mb-2">ESC</label>
              <select className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
                <option>Hobbywing XRotor 40A</option>
                <option>T-Motor FLAME 60A</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-sans text-[13px] font-bold mb-2">Flight Controller</label>
              <select className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
                <option>Pixhawk 6X</option>
                <option>Cube Orange+</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-sans text-[13px] font-bold mb-2">Battery</label>
              <select className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
                <option>6S 5000mAh LiPo</option>
                <option>12S 10000mAh Solid State</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="font-sans text-[13px] font-bold mb-2">Propeller</label>
              <select className="w-full h-12 px-4 border border-[var(--border)] font-sans text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-[var(--foreground)] transition-colors">
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
              <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <div className="font-bold">Motor ↔ ESC</div>
                  <div className="text-[#888] text-[12px] mt-1">400KV motor max current (30A) is within 40A ESC continuous rating.</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200 delay-100 fill-mode-both">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <div className="font-bold">ESC ↔ Battery</div>
                  <div className="text-[#888] text-[12px] mt-1">6S battery (22.2V nominal) is within ESC 3-6S input limits.</div>
                </div>
              </div>

              <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200 delay-200 fill-mode-both">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <div className="font-bold">FC ↔ ESC Protocol</div>
                  <div className="text-[#888] text-[12px] mt-1">Pixhawk 6X supports PWM/DShot required by XRotor ESC.</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 animate-in fade-in slide-in-from-bottom-2 duration-200 delay-300 fill-mode-both">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                <div>
                  <div className="text-yellow-500 font-bold">Propeller Oversize Warning</div>
                  <div className="text-[#888] text-[12px] mt-1">16x5.4 carbon prop on 6S will pull 42A at 100% throttle, exceeding 40A ESC continuous rating. Risk of thermal shutdown.</div>
                </div>
              </div>

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
  );
}
