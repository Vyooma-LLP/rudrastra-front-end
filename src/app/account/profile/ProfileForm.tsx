"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileForm({ userProfile }: { userProfile: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const gstin = (formData.get('gstin') as string || '').trim();
    const pincode = (formData.get('pincode') as string || '').trim();

    if (gstin && gstin.length !== 15) {
      setError("GSTIN must be exactly 15 characters.");
      setLoading(false);
      return;
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
      setError("Pincode must be exactly 6 digits.");
      setLoading(false);
      return;
    }

    const data = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      companyName: formData.get('companyName'),
      gstin: gstin,
      addressLine1: formData.get('addressLine1'),
      addressLine2: formData.get('addressLine2'),
      city: formData.get('city'),
      state: formData.get('state'),
      pincode: pincode,
    };

    try {
      const res = await fetch(`/api/account/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to update profile');
      }

      router.push('/account');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border border-[#E5E5E5]">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-bold text-sm text-[#111] uppercase tracking-wider border-b border-[#E5E5E5] pb-2">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Full Name *</label>
            <input required name="fullName" defaultValue={userProfile.fullName} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-sans" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Phone Number *</label>
            <input required name="phone" defaultValue={userProfile.phone || ''} type="tel" className="w-full border border-[#E5E5E5] p-2 text-sm font-mono" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-sm text-[#111] uppercase tracking-wider border-b border-[#E5E5E5] pb-2">Business Information (Optional)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Company Name</label>
            <input name="companyName" defaultValue={userProfile.companyName || ''} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-sans" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">GSTIN</label>
            <input name="gstin" defaultValue={userProfile.gstin || ''} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-mono uppercase" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-sm text-[#111] uppercase tracking-wider border-b border-[#E5E5E5] pb-2">Default Shipping Address *</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Address Line 1</label>
            <input required name="addressLine1" defaultValue={userProfile.addressLine1 || ''} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-sans" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Address Line 2 (Optional)</label>
            <input name="addressLine2" defaultValue={userProfile.addressLine2 || ''} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-sans" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">City</label>
              <input required name="city" defaultValue={userProfile.city || ''} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-sans" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">State</label>
              <input required name="state" defaultValue={userProfile.state || ''} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-sans" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Pincode</label>
              <input required name="pincode" defaultValue={userProfile.pincode || ''} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-mono" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-[#111111] text-white text-sm font-bold hover:bg-black disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
