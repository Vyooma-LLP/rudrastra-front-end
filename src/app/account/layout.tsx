import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Package, Wrench, ShieldCheck, Headphones, User, Building2, Store, ShieldAlert } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let userProfile = null;
  if (authUser && authUser.email) {
    const [profile] = await db.select().from(users).where(eq(users.email, authUser.email));
    userProfile = profile;
  }

  const fullName = userProfile?.fullName || 'User';
  const companyName = userProfile?.companyName || 'No Company';
  const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  const role = userProfile?.role || 'CUSTOMER';

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-sans flex flex-col">
      <Navbar />
      
      {/* Expansive Full-Width Dashboard Container */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-8 gap-8">
        
        {/* Account Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border border-[#E5E5E5] p-6 flex flex-col justify-between shrink-0 space-y-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-3 pb-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#111111] text-white font-bold text-sm rounded-full flex items-center justify-center">
                  {initials}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#111111] text-sm">{fullName}</h3>
                  <p className="text-[11px] text-[#777777]">{companyName}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 text-xs font-medium">
              <Link 
                href="/account" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111111] hover:bg-[#F5F5F5] font-semibold transition-colors"
              >
                <User className="w-4 h-4 text-[#F35C27]" /> Account Dashboard
              </Link>
              <Link 
                href="/account/orders" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors"
              >
                <Package className="w-4 h-4 text-[#F35C27]" /> Orders & Tracking
              </Link>
              <Link 
                href="/account/rma" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors"
              >
                <Wrench className="w-4 h-4 text-[#F35C27]" /> Technical RMA & Returns
              </Link>
              <Link 
                href="/account/warranties" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#F35C27]" /> Active Warranties
              </Link>
              <Link 
                href="/account/tickets" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors"
              >
                <Headphones className="w-4 h-4 text-[#F35C27]" /> Support Tickets & SLAs
              </Link>
            </nav>
          </div>

          {role === 'ADMIN' && (
            <div className="pt-4 border-t border-[#E5E5E5] text-[11px] space-y-2">
              <div className="text-[#777777] font-semibold uppercase tracking-wider text-[10px]">Switch Portal Context</div>
              <div className="space-y-1">
                <Link href="/organization/dashboard" className="flex items-center gap-1.5 text-[#305CDE] font-semibold hover:underline">
                  <Building2 className="w-3.5 h-3.5" /> Organization Workspace
                </Link>
                <Link href="/ops" className="flex items-center gap-1.5 text-rose-600 font-semibold hover:underline">
                  <ShieldAlert className="w-3.5 h-3.5" /> Ops Mission Control
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* Expansive Main Workspace Area */}
        <main className="flex-1 min-w-0 bg-white border border-[#E5E5E5] p-6 md:p-8 shadow-sm">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
