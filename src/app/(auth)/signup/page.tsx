import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UserPlus, Mail, Lock, Building2, ShieldCheck, ArrowRight, Store } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-xl bg-white border border-[#E5E5E5] p-8 shadow-sm space-y-6">
          
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 bg-[#F35C27]/10 border border-[#F35C27]/30 text-[#F35C27] rounded-full flex items-center justify-center mx-auto">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#111111]">Create Rudrastra Account</h1>
            <p className="text-xs text-[#777777]">Join India&apos;s canonical B2B Marketplace & Engineering Discovery Engine.</p>
          </div>

          {/* Account Type Selection */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border-2 border-[#111111] bg-[#F5F5F5] p-3 rounded cursor-pointer space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#111111]">
                <Building2 className="w-4 h-4 text-[#F35C27]" /> Customer / Buyer
              </div>
              <div className="text-[10px] text-[#777777]">Drone manufacturers, defense labs, engineering teams</div>
            </div>
            <div className="border border-[#E5E5E5] bg-white p-3 rounded cursor-pointer hover:border-[#138808] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#111111]">
                <Store className="w-4 h-4 text-[#138808]" /> Seller Merchant
              </div>
              <div className="text-[10px] text-[#777777]">Component OEM manufacturers & verified distributors</div>
            </div>
          </div>

          {/* Registration Form */}
          <form className="space-y-4 text-xs" action="/account">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#777777] font-semibold mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Praneeth Kumar" 
                  required
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="text-[#777777] font-semibold mb-1 block">Company / Entity Name</label>
                <input 
                  type="text" 
                  placeholder="Vyooma Technologies Pvt Ltd" 
                  required
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#777777] font-semibold mb-1 block">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                  <input 
                    type="email" 
                    placeholder="engineer@company.com" 
                    required
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 pl-9 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#777777] font-semibold mb-1 block">GSTIN (Optional for Individuals)</label>
                <input 
                  type="text" 
                  placeholder="36AAACV9981K1Z9" 
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#777777] font-semibold mb-1 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                <input 
                  type="password" 
                  placeholder="Minimum 8 characters with numbers & symbols" 
                  required
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 pl-9 text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-[#777777]">
              <input type="checkbox" id="terms" required defaultChecked className="mt-0.5 rounded border-[#E5E5E5]" />
              <label htmlFor="terms">
                I agree to the <Link href="/terms" className="text-[#111111] underline">Terms of Service</Link>, <Link href="/privacy" className="text-[#111111] underline">Privacy Policy</Link>, and B2B Technical Verification Guidelines.
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider mt-2"
            >
              <span>Create Account & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="border-t border-[#E5E5E5] pt-4 text-center text-xs space-y-1">
            <span className="text-[#777777]">Already have an account? </span>
            <Link href="/login" className="text-[#F35C27] font-bold hover:underline">Sign In here</Link>
          </div>

          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-3 text-[11px] text-[#777777] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#138808] shrink-0" />
            <span>Instant Role Provisioning via Supabase Auth & RLS Policy Enforcement</span>
          </div>

        </div>
      </main>

      <Footer hideValueProp />
    </div>
  );
}
