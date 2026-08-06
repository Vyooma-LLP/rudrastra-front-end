"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * P0: RFQ Form
 * Progressive disclosure form for sourcing requirements.
 */
function RfqFormContent() {
  const searchParams = useSearchParams();
  const prefillMpn = searchParams.get('mpn');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white border border-[var(--border)] p-12 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-heading font-extrabold text-[32px] tracking-tight mb-2">RFQ-2026-00142</h2>
        <p className="font-sans text-[18px] font-bold text-[var(--foreground)] mb-6">Received.</p>
        <p className="font-sans text-[15px] text-[var(--muted-foreground)] leading-relaxed max-w-sm mx-auto mb-10">
          Our procurement team will review your requirement and respond with matched suppliers and pricing shortly.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="font-sans font-bold text-[14px] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-[var(--border)] p-8 md:p-12">
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Contact Info */}
        <div>
          <h3 className="font-sans text-[12px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6 border-b border-[var(--border)] pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[13px] font-bold text-[var(--foreground)]">Company</label>
              <input required type="text" className="w-full h-12 px-4 border border-[var(--border)] bg-[#FAFAFA] font-sans text-[14px] focus:outline-none focus:border-[var(--foreground)] transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[13px] font-bold text-[var(--foreground)]">Name</label>
              <input required type="text" className="w-full h-12 px-4 border border-[var(--border)] bg-[#FAFAFA] font-sans text-[14px] focus:outline-none focus:border-[var(--foreground)] transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[13px] font-bold text-[var(--foreground)]">Email</label>
              <input required type="email" className="w-full h-12 px-4 border border-[var(--border)] bg-[#FAFAFA] font-sans text-[14px] focus:outline-none focus:border-[var(--foreground)] transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[13px] font-bold text-[var(--foreground)]">Phone</label>
              <input type="tel" className="w-full h-12 px-4 border border-[var(--border)] bg-[#FAFAFA] font-sans text-[14px] focus:outline-none focus:border-[var(--foreground)] transition-colors" />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="font-sans text-[12px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6 border-b border-[var(--border)] pb-2">Sourcing Requirements</h3>
          
          <div className="flex flex-col gap-2 mb-6">
            <label className="font-sans text-[13px] font-bold text-[var(--foreground)]">What are you sourcing?</label>
            <textarea 
              required
              rows={4} 
              defaultValue={prefillMpn ? `Requesting quote for MPN: ${prefillMpn}` : ''}
              placeholder="e.g. 50x MN4014 Motors, 10x Pixhawk 6X"
              className="w-full p-4 border border-[var(--border)] bg-[#FAFAFA] font-sans text-[14px] focus:outline-none focus:border-[var(--foreground)] transition-colors resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-center w-full mb-8">
            <div className="w-full py-6 border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer bg-[#FAFAFA]">
              <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="font-sans font-bold text-[13px]">Upload BOM (Optional)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[13px] font-bold text-[var(--foreground)]">Delivery Location</label>
              <input required type="text" placeholder="City, Country" className="w-full h-12 px-4 border border-[var(--border)] bg-[#FAFAFA] font-sans text-[14px] focus:outline-none focus:border-[var(--foreground)] transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[13px] font-bold text-[var(--foreground)]">Required By</label>
              <input required type="date" className="w-full h-12 px-4 border border-[var(--border)] bg-[#FAFAFA] font-sans text-[14px] focus:outline-none focus:border-[var(--foreground)] transition-colors" />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full h-14 bg-[var(--foreground)] text-white font-sans font-bold text-[15px] hover:bg-[var(--primary)] transition-colors duration-fast">
          Submit RFQ
        </button>

      </form>
    </div>
  );
}

export default function RfqPage() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5] pb-24">
      {/* HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16 mb-12 text-center flex flex-col items-center">
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
          Tell us what you need. We'll <span className="text-[var(--primary)]">source it.</span>
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl">
          Submit your component requirements, quantities and delivery constraints.
        </p>
      </section>

      <div className="px-6">
        <Suspense fallback={<div className="w-full max-w-3xl mx-auto h-[400px] bg-white border border-[var(--border)] animate-pulse"></div>}>
          <RfqFormContent />
        </Suspense>
      </div>
    </div>
  );
}
