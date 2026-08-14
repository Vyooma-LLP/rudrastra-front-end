"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ClipboardList, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const quoteNumber = searchParams.get('quoteNumber');
  const quoteId = searchParams.get('quoteId');

  return (
    <div className="bg-white border border-[#E5E5E5] p-8 md:p-12 text-center space-y-6 shadow-sm max-w-2xl mx-auto mt-12">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-[#138808]" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-[#111111]">
          Quote Request Received
        </h1>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 rounded text-center space-y-2 font-mono">
        <div className="text-xl font-bold text-[#111111]">{quoteNumber ? `Quote ID: ${quoteNumber}` : 'PENDING'}</div>
      </div>

      <p className="text-xs text-[#777777] max-w-md mx-auto">
        Our team will review your request and contact you with final pricing and availability.
      </p>

      <div className="pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          href={quoteId ? `/account/quotes/${quoteId}` : `/account/quotes`}
          className="w-full sm:w-auto px-6 py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
        >
          <ClipboardList className="w-4 h-4" />
          <span>View Quote Status</span>
        </Link>
        <Link 
          href="/products"
          className="w-full sm:w-auto px-6 py-3 bg-white border border-[#111111] hover:bg-[#F5F5F5] text-[#111111] font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function QuoteSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] px-4 py-12">
      <Suspense fallback={<div className="text-center p-12">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
