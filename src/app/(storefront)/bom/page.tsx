"use client";
import { useState } from "react";
import Link from "next/link";

/**
 * P0: BOM to Procurement Workflow
 * Upload -> Identify -> Match -> Compare -> RFQ
 */
export default function BomPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleUpload = () => {
    setStep(2);
    // Mock the processing time to show the extraction and matching
    setTimeout(() => {
      setStep(3);
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
          Turn your <span className="text-[var(--primary)]">BOM</span> into a procurement plan.
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl mb-8">
          Upload your drone's bill of materials. Rudrastra identifies components, matches suppliers and highlights procurement risks.
        </p>
        <div className="flex items-center gap-4">
          <button className="bg-[var(--foreground)] text-white font-sans font-bold px-8 py-3.5 hover:bg-[var(--primary)] transition-colors duration-fast">
            Upload BOM
          </button>
          <button className="bg-white border border-[var(--border)] text-[var(--foreground)] font-sans font-bold px-8 py-3.5 hover:border-[var(--foreground)] transition-colors duration-fast">
            Build BOM manually
          </button>
        </div>
      </section>

      {/* WORKFLOW PIPELINE */}
      <section className="w-full px-6 lg:px-10 py-16 max-w-7xl mx-auto">
        <div className="bg-white border border-[var(--border)] p-8 lg:p-12">
          
          {/* STEP 1: UPLOAD */}
          {step === 1 && (
            <div className="flex flex-col items-center text-center max-w-xl mx-auto py-12">
              <div className="w-20 h-20 bg-[#FAFAFA] border-2 border-dashed border-[var(--border)] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="font-heading font-bold text-[24px] mb-2">Upload your <span className="text-[var(--primary)]">BOM</span></h2>
              <p className="font-sans text-[14px] text-[var(--muted-foreground)] mb-8">
                Accepts .csv, .xlsx, or .xls. Ensure your file contains manufacturer and MPN columns for accurate matching.
              </p>
              
              <button 
                onClick={handleUpload}
                className="w-full bg-[#FAFAFA] border border-[var(--border)] font-sans font-bold text-[14px] px-8 py-4 hover:border-[#111] hover:bg-white transition-colors duration-fast cursor-pointer"
              >
                Select File
              </button>
            </div>
          )}

          {/* STEP 2: PROCESSING */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center max-w-xl mx-auto py-24">
              <svg className="animate-spin w-12 h-12 text-[var(--foreground)] mb-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h2 className="font-heading font-bold text-[24px] mb-2"><span className="text-[var(--accent)]">Identifying</span> components</h2>
              <p className="font-sans text-[14px] text-[var(--muted-foreground)] font-mono">
                Matching MPNs against canonical hardware graph...
              </p>
            </div>
          )}

          {/* STEP 3: RESULTS (YOUR BOM) */}
          {step === 3 && (
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="font-heading font-bold text-[24px] mb-2 uppercase tracking-tight">Your <span className="text-[var(--primary)]">BOM</span></h2>
                  <p className="font-sans text-[14px] text-[var(--muted-foreground)]">
                    4 canonical matches found. 1 component requires manual review.
                  </p>
                </div>
                <Link href="/rfq" className="hidden md:inline-flex bg-[var(--foreground)] text-white font-sans font-bold px-6 py-3 hover:bg-[var(--primary)] transition-colors duration-fast">
                  Generate Procurement Plan →
                </Link>
              </div>

              <div className="border border-[var(--border)] overflow-x-auto">
                <table className="w-full text-left font-sans text-[14px] whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[#FAFAFA] text-[12px] uppercase text-[var(--muted-foreground)] tracking-wider">
                      <th className="px-6 py-4 font-semibold">Extracted Component</th>
                      <th className="px-6 py-4 font-semibold">Canonical Match</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {/* MATCHES */}
                    <tr className="hover:bg-[#FAFAFA] transition-colors duration-fast">
                      <td className="px-6 py-4 font-mono text-[13px]">T-Motor MN4014</td>
                      <td className="px-6 py-4 font-semibold"><Link href="/products/RUD-MOT-MN4014" className="hover:text-[var(--primary)] transition-colors">RUD-MOT-MN4014</Link></td>
                      <td className="px-6 py-4"><span className="text-green-600 font-bold text-[12px] flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>Matched</span></td>
                    </tr>
                    <tr className="hover:bg-[#FAFAFA] transition-colors duration-fast">
                      <td className="px-6 py-4 font-mono text-[13px]">Hobbywing X8</td>
                      <td className="px-6 py-4 font-semibold"><Link href="/products/RUD-ESC-X8" className="hover:text-[var(--primary)] transition-colors">RUD-ESC-X8</Link></td>
                      <td className="px-6 py-4"><span className="text-green-600 font-bold text-[12px] flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>Matched</span></td>
                    </tr>
                    <tr className="hover:bg-[#FAFAFA] transition-colors duration-fast">
                      <td className="px-6 py-4 font-mono text-[13px]">Pixhawk 6X</td>
                      <td className="px-6 py-4 font-semibold"><Link href="/products/RUD-FC-PX6X" className="hover:text-[var(--primary)] transition-colors">RUD-FC-PX6X</Link></td>
                      <td className="px-6 py-4"><span className="text-green-600 font-bold text-[12px] flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>Matched</span></td>
                    </tr>
                    <tr className="hover:bg-[#FAFAFA] transition-colors duration-fast">
                      <td className="px-6 py-4 font-mono text-[13px]">LiPo 6S 5000mAh</td>
                      <td className="px-6 py-4 font-semibold"><Link href="/products/RUD-PWR-6S5K" className="hover:text-[var(--primary)] transition-colors">RUD-PWR-6S5K</Link></td>
                      <td className="px-6 py-4"><span className="text-green-600 font-bold text-[12px] flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>Matched</span></td>
                    </tr>
                    {/* WARNING */}
                    <tr className="hover:bg-[#FAFAFA] transition-colors duration-fast bg-yellow-50/50">
                      <td className="px-6 py-4 font-mono text-[13px]">M10 GNSS</td>
                      <td className="px-6 py-4 font-semibold text-yellow-700">Multiple candidates</td>
                      <td className="px-6 py-4"><span className="text-yellow-600 font-bold text-[12px] flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>2 possible matches</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile CTA */}
              <div className="mt-8 flex justify-center md:hidden">
                <Link href="/rfq" className="w-full text-center bg-[var(--foreground)] text-white font-sans font-bold px-6 py-4 hover:bg-[var(--primary)] transition-colors duration-fast">
                  Generate Procurement Plan →
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
