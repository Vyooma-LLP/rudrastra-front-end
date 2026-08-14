"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, ArrowRight, Clock } from 'lucide-react';
import { formatMoney } from '@/utils/money';

export default function QuoteHistoryPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quotes')
      .then(res => res.json())
      .then(data => {
        if (data.quotes) setQuotes(data.quotes);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4">
        <h1 className="text-2xl font-heading font-extrabold text-[#111111] flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-[#F35C27]" />
          Quote History
        </h1>
        <p className="text-xs text-[#777777] mt-1">Track the status of your procurement quote requests.</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-[#E5E5E5] rounded"></div>)}
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center p-12 bg-white border border-[#E5E5E5] text-[#777777]">
          No quote requests found.
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map(quote => (
            <div key={quote.id} className="bg-white border border-[#E5E5E5] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#111111]">{quote.quoteNumber}</span>
                  <span className={`text-[10px] px-2 py-0.5 font-bold tracking-wider uppercase border
                    ${quote.status === 'NEW' ? 'border-blue-500 text-blue-600 bg-blue-50' :
                      quote.status === 'REVIEWING' ? 'border-amber-500 text-amber-600 bg-amber-50' :
                      quote.status === 'QUOTED' ? 'border-[#138808] text-[#138808] bg-[#138808]/5' :
                      quote.status === 'ACCEPTED' ? 'border-[#305CDE] text-[#305CDE] bg-[#305CDE]/5' :
                      'border-[#777777] text-[#777777] bg-[#F5F5F5]'
                    }
                  `}>
                    {quote.status}
                  </span>
                </div>
                <div className="text-xs flex items-center gap-2 text-[#777777]">
                  <Clock className="w-3 h-3" />
                  {new Date(quote.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </div>
                <div className="text-xs text-[#111111] mt-2">
                  Estimated Value: <span className="font-mono font-bold">₹{formatMoney({ amountMinor: String(quote.estimatedSubtotal), currency: 'INR' })}</span>
                </div>
              </div>
              
              <Link
                href={`/account/quotes/${quote.id}`}
                className="px-4 py-2 border border-[#111111] hover:bg-[#F5F5F5] text-[#111111] font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
