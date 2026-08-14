import React from 'react';
import Link from 'next/link';
import { Package, Wrench, ShieldCheck, Headphones, ArrowRight, User } from 'lucide-react';
import { db } from '@/db';
import { users, quoteRequests } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AccountDashboardPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const [userProfile] = await db.select().from(users).where(eq(users.email, authUser.email!));
  
  if (!userProfile) {
    redirect('/login');
  }

  const userQuotes = await db.select().from(quoteRequests)
    .where(eq(quoteRequests.userId, userProfile.id))
    .orderBy(desc(quoteRequests.createdAt))
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Welcome, {userProfile.fullName}</h1>
        <p className="text-xs text-[#777777]">Manage your profile, quote requests, and support.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 space-y-4 h-full">
            <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-2">
              <h2 className="font-heading text-base font-bold text-[#111111] flex items-center gap-2">
                <User className="w-4 h-4 text-[#F35C27]" /> Profile
              </h2>
              <Link href="/account/profile" className="text-[11px] font-bold text-[#111111] underline">Edit Profile</Link>
            </div>
            
            <div className="space-y-2 text-sm font-sans text-[#444]">
              <p><strong className="text-[#111]">Email:</strong> {userProfile.email}</p>
              <p><strong className="text-[#111]">Phone:</strong> {userProfile.phone || 'Not provided'}</p>
              <p><strong className="text-[#111]">Company:</strong> {userProfile.companyName || 'Not provided'}</p>
              <p><strong className="text-[#111]">GSTIN:</strong> {userProfile.gstin || 'Not provided'}</p>
              
              <div className="pt-2">
                <strong className="text-[#111]">Default Address:</strong>
                {userProfile.addressLine1 ? (
                  <p className="mt-1">
                    {userProfile.addressLine1}<br/>
                    {userProfile.addressLine2 && <>{userProfile.addressLine2}<br/></>}
                    {userProfile.city}, {userProfile.state} {userProfile.pincode}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 italic mt-1">No address provided</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quotes Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 space-y-4 h-full">
            <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-2">
              <h2 className="font-heading text-base font-bold text-[#111111] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#F35C27]" /> Recent Quote Requests
              </h2>
            </div>
            
            <div className="space-y-3">
              {userQuotes.length === 0 ? (
                <p className="text-sm text-gray-500 font-sans p-4 bg-white border border-[#E5E5E5] text-center">
                  You have not requested any quotes yet.
                </p>
              ) : (
                userQuotes.map(quote => (
                  <div key={quote.id} className="bg-white border border-[#E5E5E5] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#F35C27]">#{quote.quoteNumber}</span>
                        <span className="px-2 py-0.5 border border-[#111] text-[#111] bg-gray-100 font-semibold text-[10px] uppercase">
                          {quote.status}
                        </span>
                      </div>
                      <p className="text-[#777777] mt-1 text-xs">{new Date(quote.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-[#111111] text-sm">Est: ₹{(quote.estimatedSubtotal / 100).toFixed(2)}</span>
                      <Link href={`/account/quotes/${quote.id}`} className="px-3 py-1.5 bg-[#111111] text-white font-semibold hover:bg-black transition-colors text-xs">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Support Section */}
      <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-heading text-base font-bold text-[#111111] flex items-center gap-2">
          <Headphones className="w-4 h-4 text-[#F35C27]" /> Support
        </h2>
        <div className="bg-white border border-[#E5E5E5] p-4 flex justify-between items-center">
          <p className="text-sm font-sans text-[#444]">Need help with an order or have a technical question?</p>
          <Link href="/support" className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
