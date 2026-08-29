"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, ArrowRight, Clock, Building2 } from 'lucide-react';
import { formatMoney } from '@/utils/money';

export default function OpsQuoteInbox() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/quotes')
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
          <ClipboardList className="w-6 h-6 text-[#305CDE]" />
          Ops Quote Inbox
        </h1>
        <p className="text-xs text-[#777777] mt-1">Manage and respond to B2B procurement requests.</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-[#E5E5E5] rounded"></div>)}
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center p-12 bg-white border border-[#E5E5E5] text-[#777777]">
          No quote requests found.
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E5] shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777]">
                <th className="p-4 font-semibold uppercase tracking-wider">Quote ID</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Customer</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-right">Est. Value</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-center">Status</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(quote => (
                <tr key={quote.id} className="border-b border-[#E5E5E5] hover:bg-[#F9F9F9]" data-testid="quote-row">
                  <td className="p-4">
                    <div className="font-mono font-bold text-[#111111]">{quote.quoteNumber}</div>
                    <div className="text-[10px] text-[#777777] flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(quote.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#111111]">{quote.customerName}</div>
                    <div className="text-[#777777] flex items-center gap-1 mt-1">
                      {quote.companyName && <><Building2 className="w-3 h-3" /> {quote.companyName}</>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-mono font-bold text-[#111111]">
                      ₹{formatMoney({ amountMinor: String(quote.estimatedSubtotal), currency: 'INR' })}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 font-bold tracking-wider uppercase border inline-block
                      ${quote.status === 'NEW' ? 'border-blue-500 text-blue-600 bg-blue-50' :
                        quote.status === 'REVIEWING' ? 'border-amber-500 text-amber-600 bg-amber-50' :
                        quote.status === 'QUOTED' ? 'border-[#138808] text-[#138808] bg-[#138808]/5' :
                        quote.status === 'ACCEPTED' ? 'border-[#305CDE] text-[#305CDE] bg-[#305CDE]/5' :
                        'border-[#777777] text-[#777777] bg-[#F5F5F5]'
                      }
                    `}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/ops/quotes/${quote.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111111] hover:bg-black text-white font-bold text-[10px] uppercase tracking-wider"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
