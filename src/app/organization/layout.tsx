import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Building2, FolderGit2, Users, FileText, LayoutDashboard, User, Store, ShieldAlert, CheckSquare, History, Network } from 'lucide-react';

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-8 gap-8">
        <aside className="w-full md:w-64 bg-white border border-[#E5E5E5] p-6 flex flex-col justify-between shrink-0 space-y-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-3 pb-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#305CDE]/10 border border-[#305CDE]/30 text-[#305CDE] rounded-lg flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#111111] text-sm">Vyooma Tech</h3>
                  <p className="text-[11px] text-[#138808] font-mono font-semibold">Credit: ₹5,00,000</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-medium">
              <Link href="/organization/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111111] hover:bg-[#F5F5F5] font-semibold transition-colors">
                <LayoutDashboard className="w-4 h-4 text-[#305CDE]" /> B2B Org Dashboard
              </Link>
              <Link href="/organization/projects" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <FolderGit2 className="w-4 h-4 text-[#305CDE]" /> Engineering Projects
              </Link>
              <Link href="/organization/members" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <Users className="w-4 h-4 text-[#305CDE]" /> Members & Roles
              </Link>
              <div className="pt-2 pb-1 text-[10px] font-bold text-[#777777] uppercase tracking-wider px-3">Procurement</div>
              <Link href="/organization/procurement/approvals" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <CheckSquare className="w-4 h-4 text-[#305CDE]" /> PO Approvals
              </Link>
              <Link href="/organization/procurement/purchase-orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <FileText className="w-4 h-4 text-[#305CDE]" /> Purchase Orders
              </Link>
              <Link href="/organization/procurement/history" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <History className="w-4 h-4 text-[#305CDE]" /> Procurement History
              </Link>
              <Link href="/organization/procurement/suppliers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors">
                <Network className="w-4 h-4 text-[#305CDE]" /> Supplier Network
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-[#E5E5E5] text-[11px] space-y-2">
            <div className="text-[#777777] font-semibold uppercase tracking-wider text-[10px]">Switch Portal Context</div>
            <div className="space-y-1">
              <Link href="/account" className="flex items-center gap-1.5 text-[#F35C27] font-semibold hover:underline">
                <User className="w-3.5 h-3.5" /> Customer Account
              </Link>
              <Link href="/ops" className="flex items-center gap-1.5 text-rose-600 font-semibold hover:underline">
                <ShieldAlert className="w-3.5 h-3.5" /> Ops Mission Control
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 bg-white border border-[#E5E5E5] p-6 md:p-8 shadow-sm">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
