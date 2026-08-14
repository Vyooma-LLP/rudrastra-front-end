"use client";
import { useState } from "react";
import Link from "next/link";
import { useCommand } from "@/hooks/useCommand";
import { MockProcessBomAdapter } from "@/modules/bom/frontend-contracts/MockBomAdapter";
import { BomMatchResult } from "@/modules/bom/frontend-contracts/BomContract";

const processBomCommand = new MockProcessBomAdapter();

/**
 * P0: BOM to Procurement Workflow
 * Upload -> Identify -> Match -> Compare -> RFQ
 */
export default function BomPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [results, setResults] = useState<BomMatchResult[]>([]);
  const [manualRows, setManualRows] = useState<{ mpn: string; mfg: string; qty: string }[]>(
    [{ mpn: '', mfg: '', qty: '1' }]
  );

  const { execute } = useCommand({
    command: processBomCommand,
    onSuccess: (data) => {
      setResults(data.matches);
      setStep(3);
    },
    onError: (error) => {
      console.error(error);
      setStep(1); // Revert on failure
    }
  });

  const handleUpload = () => {
    setStep(2);
    execute({ fileId: 'fake-file-id' });
  };

  return (
    
    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
          Turn your <span className="text-[var(--primary)]">BOM</span> into a procurement plan.
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl mb-8">
          Upload your drone&apos;s bill of materials. Rudraastra identifies components, matches suppliers and highlights procurement risks.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpload}
            className="bg-[var(--foreground)] text-white font-sans font-bold px-8 py-3.5 hover:bg-[var(--primary)] transition-colors duration-fast"
          >
            Upload BOM
          </button>
          <button
            onClick={() => setStep(4)}
            className="bg-white border border-[var(--border)] text-[var(--foreground)] font-sans font-bold px-8 py-3.5 hover:border-[var(--foreground)] transition-colors duration-fast"
          >
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
                    {results.map((match, idx) => (
                      <tr key={idx} className={`hover:bg-[#FAFAFA] transition-colors duration-fast ${match.status === 'Review' ? 'bg-yellow-50/50' : ''}`}>
                        <td className="px-6 py-4 font-mono text-[13px]">{match.extractedComponent}</td>
                        <td className={`px-6 py-4 font-semibold ${match.status === 'Review' ? 'text-yellow-700' : ''}`}>
                          {match.canonicalMatch ? (
                            <Link href={`/products/${match.matchId}`} className="hover:text-[var(--primary)] transition-colors">
                              {match.canonicalMatch}
                            </Link>
                          ) : (
                            'Multiple candidates'
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {match.status === 'Matched' ? (
                            <span className="text-green-600 font-bold text-[12px] flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>Matched
                            </span>
                          ) : (
                            <span className="text-yellow-600 font-bold text-[12px] flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>2 possible matches
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
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

          {/* STEP 4: MANUAL BOM BUILDER */}
          {step === 4 && (
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="font-heading font-bold text-[24px] mb-2 uppercase tracking-tight">Manual <span className="text-[var(--primary)]">BOM</span> Entry</h2>
                  <p className="font-sans text-[14px] text-[var(--muted-foreground)]">Add line items. Each MPN will be matched against the canonical hardware graph when you submit.</p>
                </div>
                <button onClick={() => setStep(1)} className="text-[var(--muted-foreground)] font-sans text-[13px] hover:text-[var(--foreground)] transition-colors">
                  ← Back
                </button>
              </div>

              <div className="border border-[var(--border)] overflow-x-auto">
                <table className="w-full text-left font-sans text-[14px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[#FAFAFA] text-[12px] uppercase text-[var(--muted-foreground)] tracking-wider">
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">MPN / Part Number</th>
                      <th className="px-4 py-3 font-semibold">Manufacturer</th>
                      <th className="px-4 py-3 font-semibold">Qty</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {manualRows.map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 text-[var(--muted-foreground)] font-mono text-[13px]">{i + 1}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.mpn}
                            onChange={e => setManualRows(prev => prev.map((r, idx) => idx === i ? { ...r, mpn: e.target.value } : r))}
                            placeholder="e.g. MN4014"
                            className="w-full border border-[var(--border)] px-3 py-2 font-mono text-[13px] focus:outline-none focus:border-[var(--foreground)]"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.mfg}
                            onChange={e => setManualRows(prev => prev.map((r, idx) => idx === i ? { ...r, mfg: e.target.value } : r))}
                            placeholder="e.g. T-Motor"
                            className="w-full border border-[var(--border)] px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-[var(--foreground)]"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="1"
                            value={row.qty}
                            onChange={e => setManualRows(prev => prev.map((r, idx) => idx === i ? { ...r, qty: e.target.value } : r))}
                            className="w-20 border border-[var(--border)] px-3 py-2 font-mono text-[13px] focus:outline-none focus:border-[var(--foreground)]"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {manualRows.length > 1 && (
                            <button
                              onClick={() => setManualRows(prev => prev.filter((_, idx) => idx !== i))}
                              className="text-red-400 hover:text-red-600 transition-colors text-[12px] font-bold"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => setManualRows(prev => [...prev, { mpn: '', mfg: '', qty: '1' }])}
                  className="font-sans font-bold text-[13px] text-[var(--foreground)] border border-[var(--border)] px-4 py-2 hover:border-[var(--foreground)] transition-colors duration-fast"
                >
                  + Add Row
                </button>
                <button
                  onClick={() => { handleUpload(); }}
                  disabled={manualRows.every(r => !r.mpn.trim())}
                  className="font-sans font-bold text-[13px] bg-[var(--foreground)] text-white px-6 py-2.5 hover:bg-[var(--primary)] transition-colors duration-fast disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Match Components
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
    
  );
}
