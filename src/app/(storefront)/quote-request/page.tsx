"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, ArrowRight, ClipboardList } from 'lucide-react';
import { useCartContext } from '@/components/commerce/CartContext';
import { formatMoney } from '@/utils/money';
import { toast } from '@/components/ui/Toast';

import { generateUUID } from '@/utils/uuid';

export default function QuoteRequestPage() {
  const router = useRouter();
  const { cartState, isLoading: isCartLoading } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);
  const [idempotencyKey] = useState(() => generateUUID());
  
  const [quoteState, setQuoteState] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    shippingAddress: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/account/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          const p = data.profile;
          const addressString = [p.addressLine1, p.addressLine2, p.city, p.state, p.pincode].filter(Boolean).join(', ');
          setQuoteState(prev => ({
            ...prev,
            name: p.fullName || prev.name,
            email: p.email || prev.email,
            phone: p.phone || prev.phone,
            companyName: p.companyName || prev.companyName,
            shippingAddress: addressString || prev.shippingAddress,
          }));
        }
      })
      .catch(err => console.error("Failed to load profile", err));
  }, []);


  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
      </div>
    );
  }

  if (!cartState?.items || cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center font-sans">
        <div className="bg-white border border-[#E5E5E5] p-8 max-w-md text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-xs text-gray-500">You must add components to your cart before requesting a quote.</p>
          <Link href="/products" className="inline-block px-4 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleRequestQuote = async () => {
    setIsLoading(true);
    try {
      // Basic splitting for address MVP
      const addressParts = quoteState.shippingAddress.split(',').map(s => s.trim());
      const line1 = addressParts[0] || '';
      const line2 = addressParts.length > 4 ? addressParts[1] : '';
      const city = addressParts[addressParts.length - 3] || 'Unknown City';
      const state = addressParts[addressParts.length - 2] || 'Unknown State';
      const pincode = addressParts[addressParts.length - 1] || '000000';

      const payload = {
        idempotencyKey,
        customerInfo: {
          name: quoteState.name,
          email: quoteState.email,
          phone: quoteState.phone,
          companyName: quoteState.companyName,
          notes: quoteState.notes
        },
        shippingAddress: {
          line1,
          line2,
          city,
          state,
          pincode
        }
      };

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      router.push(`/quote-request/success?quoteId=${data.quoteId}&quoteNumber=${data.quoteNumber}`);
    } catch (err) {
      toast((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
      <div className="min-h-screen bg-[#F5F5F5] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-[#111111] flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[#F35C27]" />
            Request a Quote
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Submit your requirements and our team will confirm availability, pricing and delivery details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Customer Information */}
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-4 shadow-sm text-xs">
              <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E5E5E5] pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#305CDE]" /> 1. Contact & Corporate Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quote-name" className="text-[#777777] font-semibold mb-1 block">Full Name *</label>
                  <input id="quote-name" type="text" value={quoteState.name} onChange={e => setQuoteState({...quoteState, name: e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111]" required />
                </div>
                <div>
                  <label htmlFor="quote-company" className="text-[#777777] font-semibold mb-1 block">Company / Organization</label>
                  <input id="quote-company" type="text" value={quoteState.companyName} onChange={e => setQuoteState({...quoteState, companyName: e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111]" />
                </div>
                <div>
                  <label htmlFor="quote-email" className="text-[#777777] font-semibold mb-1 block">Email Address *</label>
                  <input id="quote-email" type="email" value={quoteState.email} onChange={e => setQuoteState({...quoteState, email: e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111]" required />
                </div>
                <div>
                  <label htmlFor="quote-phone" className="text-[#777777] font-semibold mb-1 block">Phone Number *</label>
                  <input id="quote-phone" type="tel" value={quoteState.phone} onChange={e => setQuoteState({...quoteState, phone: e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111] font-mono" required />
                </div>
                <div className="col-span-2">
                  <label htmlFor="quote-address" className="text-[#777777] font-semibold mb-1 block">Delivery Address (Comma separated for MVP) *</label>
                  <input id="quote-address" type="text" placeholder="Plot 42, Hyderabad, Telangana, 501218" value={quoteState.shippingAddress} onChange={e => setQuoteState({...quoteState, shippingAddress: e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111]" required />
                </div>
                <div className="col-span-2">
                  <label htmlFor="quote-notes" className="text-[#777777] font-semibold mb-1 block">Additional Notes / Requirements</label>
                  <textarea id="quote-notes" rows={3} value={quoteState.notes} onChange={e => setQuoteState({...quoteState, notes: e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111]"></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* Right Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-6 shadow-sm text-xs">
              <h2 className="font-heading text-base font-bold text-[#111111] border-b border-[#E5E5E5] pb-3">
                Estimated Cart Value
              </h2>

              <div className="space-y-3 font-mono">
                <div className="flex justify-between text-[#777777]">
                  <span>Subtotal</span>
                  <span className="text-[#111111] font-semibold">₹{formatMoney(cartState?.summary.subtotal)}</span>
                </div>
                
                <div className="border-t border-[#E5E5E5] pt-3 flex justify-between text-sm font-extrabold text-[#111111]">
                  <span>Estimated Cart Value</span>
                  <span className="text-[#F35C27]">₹{formatMoney(cartState?.summary.subtotal)}</span>
                </div>

                <div className="text-[10px] text-[#777777] italic mt-2">
                  * Final pricing will be confirmed after your quote request. No payment is required right now.
                </div>
              </div>

              <button
                onClick={handleRequestQuote}
                disabled={isLoading || !quoteState.name || !quoteState.email || !quoteState.phone || !quoteState.shippingAddress}
                className="w-full py-3.5 bg-[#111111] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Submit Quote Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
      </div>
    
  );
}
