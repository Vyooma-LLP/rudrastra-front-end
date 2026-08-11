"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Shield, MapPin, Building2, Star, Plus } from 'lucide-react';

export default function SuppliersPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); };
  return (
    <CapabilityGuard featureKey="procurement.supplier-matching">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Supplier Network</h1>
            <p className="text-xs text-[#777777] mt-1">Approved OEM vendors and distributors for enterprise procurement.</p>
          </div>
          <div className="flex items-center gap-2">
            {toast && <span className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1 rounded-md">{toast}</span>}
            <button onClick={() => showToast('Supplier invite form opens when backend is ready')} className="h-8 px-4 inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Invite Supplier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "T-Motor Official", type: "OEM", location: "Shenzhen, CN", rating: 4.9, active: true, tags: ["Propulsion", "Motors", "ESCs"] },
            { name: "Holybro Global", type: "OEM", location: "Hong Kong, HK", rating: 4.8, active: true, tags: ["Flight Controllers", "GPS"] },
            { name: "Hobbywing India", type: "Authorized Dist.", location: "Bangalore, IN", rating: 4.7, active: true, tags: ["ESCs", "Power Distribution"] },
            { name: "IdeaForge Tech", type: "OEM", location: "Mumbai, IN", rating: 4.9, active: true, tags: ["Airframes", "Complete Systems"] },
            { name: "Foxeer Tech", type: "OEM", location: "Shenzhen, CN", rating: 4.6, active: true, tags: ["Cameras", "VTX"] },
            { name: "SkyNet Components", type: "Distributor", location: "Delhi, IN", rating: 4.2, active: false, tags: ["Misc Electronics", "Wiring"] },
          ].map((supplier, i) => (
            <div key={i} className={`bg-white border rounded-xl overflow-hidden transition-all hover:shadow-md ${supplier.active ? 'border-[#E5E5E5]' : 'border-[#E5E5E5] opacity-60'}`}>
              <div className="p-5 border-b border-[#E5E5E5] flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg text-[#111111] flex items-center gap-2">
                    {supplier.name}
                    {supplier.rating >= 4.8 && <span title="Premium Partner"><Shield className="w-4 h-4 text-[#305CDE]" /></span>}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#777777]">
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {supplier.type}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {supplier.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {supplier.rating}
                </div>
              </div>
              <div className="p-4 bg-[#F5F5F5]/50 flex flex-wrap gap-2">
                {supplier.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white border border-[#E5E5E5] rounded-md text-[10px] font-semibold text-[#555] uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="p-4 flex gap-2">
                <button onClick={() => showToast(`Viewing profile for ${supplier.name}`)} className="flex-1 h-8 bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors">
                  View Profile
                </button>
                <button
                  onClick={() => { if (supplier.active) router.push(`/rfq?supplier=${encodeURIComponent(supplier.name)}`); }}
                  disabled={!supplier.active}
                  className="flex-1 h-8 bg-[#305CDE] text-white hover:bg-blue-700 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Request RFQ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CapabilityGuard>
  );
}
