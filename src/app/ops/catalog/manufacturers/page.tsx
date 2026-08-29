"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, X, Check, MapPin } from 'lucide-react';
import Image from 'next/image';

interface Manufacturer {
  id: string;
  name: string;
  verified: boolean;
  logo: string | null;
  country: string | null;
  productCount?: number; // Might not be returned by basic API yet
}

export default function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{name: string, verified: boolean, logo: string | null, country: string}>({
    name: '',
    verified: false,
    logo: null,
    country: ''
  });

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const res = await fetch('/api/admin/manufacturers');
      if (res.ok) {
        const data = await res.json();
        setManufacturers(data);
      }
    } catch (e) {
      console.error("Failed to fetch manufacturers", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (mfg?: Manufacturer) => {
    if (mfg) {
      setEditingId(mfg.id);
      setFormData({ 
        name: mfg.name, 
        verified: mfg.verified, 
        logo: mfg.logo,
        country: mfg.country || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', verified: false, logo: null, country: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/manufacturers/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const updated = await res.json();
          setManufacturers(prev => prev.map(m => m.id === editingId ? { ...m, ...updated } : m));
        }
      } else {
        const res = await fetch('/api/admin/manufacturers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const created = await res.json();
          setManufacturers(prev => [created, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error("Failed to save manufacturer", e);
      alert("Error saving manufacturer.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this manufacturer?")) {
      try {
        const res = await fetch(`/api/admin/manufacturers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setManufacturers(prev => prev.filter(m => m.id !== id));
        }
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  // Mock file processing for MVP
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({ ...prev, logo: url }));
    }
  };

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-6 lg:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Manufacturers</h1>
            <p className="text-xs text-[#777777]">Manage canonical manufacturers and brand verifications.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-bold hover:bg-black transition-colors">
            <Plus className="w-4 h-4" /> Add Manufacturer
          </button>
        </div>

        <div className="bg-white border border-[#E5E5E5] overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5] text-xs uppercase text-[#777777] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Brand Logo</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#777777]">Loading...</td>
                </tr>
              ) : manufacturers.map((mfg) => (
                <tr key={mfg.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-[#F5F5F5] border border-[#E5E5E5] rounded-full flex items-center justify-center overflow-hidden">
                      {mfg.logo ? (
                        <Image src={mfg.logo} alt={mfg.name} width={40} height={40} className="object-cover" />
                      ) : (
                        <span className="font-bold text-[#777777] text-xs">{mfg.name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#111111]">{mfg.name}</div>
                    {mfg.country && (
                      <div className="text-[10px] text-[#777777] font-bold uppercase flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {mfg.country}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {mfg.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase rounded-full">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-[#777777]">{mfg.productCount || 0}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleOpenModal(mfg)} className="text-blue-600 hover:text-blue-800 font-semibold" title="Edit">
                      <Edit2 className="w-4 h-4 inline-block" />
                    </button>
                    <button onClick={() => handleDelete(mfg.id)} className="text-red-600 hover:text-red-800 font-semibold" title="Delete">
                      <Trash2 className="w-4 h-4 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && manufacturers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#777777]">No manufacturers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-[#E5E5E5] shadow-lg w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5]">
              <h2 className="font-heading font-bold text-lg text-[#111111]">
                {editingId ? 'Edit Manufacturer' : 'Add Manufacturer'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#777777] hover:text-[#111111] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="mfg-name" className="text-xs font-bold text-[#111111] uppercase tracking-wider">Manufacturer Name</label>
                <input 
                  id="mfg-name"
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-[#E5E5E5] p-2 text-sm focus:outline-none focus:border-[#111111]" 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="mfg-country" className="text-xs font-bold text-[#111111] uppercase tracking-wider">Country of Origin</label>
                <input 
                  id="mfg-country"
                  type="text" 
                  value={formData.country} 
                  onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full border border-[#E5E5E5] p-2 text-sm focus:outline-none focus:border-[#111111]"
                  placeholder="e.g. India, USA, China"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Brand Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F5F5F5] border border-[#E5E5E5] rounded-full flex items-center justify-center overflow-hidden">
                    {formData.logo ? (
                      <Image src={formData.logo} alt="Preview" width={64} height={64} className="object-cover" />
                    ) : (
                      <span className="text-[10px] text-[#777777]">None</span>
                    )}
                  </div>
                  <label className="px-3 py-1.5 bg-[#F5F5F5] border border-[#E5E5E5] text-xs font-bold hover:bg-[#E5E5E5] cursor-pointer transition-colors">
                    Upload Logo
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </label>
                  {formData.logo && (
                    <button onClick={() => setFormData(prev => ({ ...prev, logo: null }))} className="text-xs text-red-600 font-bold">Remove</button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="verified" 
                  checked={formData.verified} 
                  onChange={e => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="verified" className="text-sm font-bold text-[#111111]">Verified Brand (e.g. KYC done)</label>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5E5E5] flex justify-end gap-3 bg-[#FAFAFA]">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5]">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-bold bg-[#111111] text-white hover:bg-black flex items-center gap-2">
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
