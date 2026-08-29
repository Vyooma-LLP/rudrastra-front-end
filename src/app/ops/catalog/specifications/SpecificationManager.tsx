"use client";

import React, { useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { Database, Plus, Trash2, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Category = { id: string; name: string };
type Spec = { id: string; categoryId: string; name: string; dataType: string; unit: string | null; isRequired: boolean };

export function SpecificationManager({ initialCategories, initialSpecs }: { initialCategories: Category[], initialSpecs: Spec[] }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategories[0]?.id || "");
  const [specs, setSpecs] = useState<Spec[]>(initialSpecs);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newSpec, setNewSpec] = useState({ name: "", dataType: "string", unit: "", isRequired: false });
  const router = useRouter();

  const handleAdd = async () => {
    if (!newSpec.name || !selectedCategoryId) return;
    try {
      const res = await fetch('/api/admin/specifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSpec, categoryId: selectedCategoryId })
      });
      const data = await res.json();
      if (data.success) {
        setSpecs([...specs, data.specification]);
        setIsAdding(false);
        setNewSpec({ name: "", dataType: "string", unit: "", isRequired: false });
        router.refresh();
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this specification?')) return;
    try {
      const res = await fetch(`/api/admin/specifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSpecs(specs.filter(s => s.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const currentSpecs = specs.filter(s => s.categoryId === selectedCategoryId);

  return (
    <CapabilityGuard featureKey="engineering.specification-analysis">
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Specification Engine</h1>
          <p className="text-xs text-[#777777] mt-1">Manage normalized PIM technical specifications by category.</p>
        </div>

        <div className="flex gap-4">
          <div className="w-1/3 bg-white border border-[#E5E5E5] rounded-xl p-4">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#305CDE]" /> Categories
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {initialCategories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategoryId === cat.id ? 'bg-[#111111] text-white' : 'hover:bg-[#F5F5F5] text-[#444444]'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-2/3 bg-white border border-[#E5E5E5] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider">Specifications for Category</h2>
              <button onClick={() => setIsAdding(true)} className="h-8 px-3 inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold rounded-md">
                <Plus className="w-3.5 h-3.5" /> Add Spec
              </button>
            </div>

            {isAdding && (
              <div className="mb-6 p-4 border border-[#E5E5E5] rounded-lg bg-[#FAFAFA]">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3">New Specification</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-[#777777] mb-1">Name</label>
                    <input type="text" value={newSpec.name} onChange={e => setNewSpec({...newSpec, name: e.target.value})} className="w-full px-3 py-1.5 border border-[#E5E5E5] rounded-md text-sm" placeholder="e.g. KV Rating" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#777777] mb-1">Data Type</label>
                    <select value={newSpec.dataType} onChange={e => setNewSpec({...newSpec, dataType: e.target.value})} className="w-full px-3 py-1.5 border border-[#E5E5E5] rounded-md text-sm bg-white">
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#777777] mb-1">Unit (Optional)</label>
                    <input type="text" value={newSpec.unit} onChange={e => setNewSpec({...newSpec, unit: e.target.value})} className="w-full px-3 py-1.5 border border-[#E5E5E5] rounded-md text-sm" placeholder="e.g. KV, mm, g" />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={newSpec.isRequired} onChange={e => setNewSpec({...newSpec, isRequired: e.target.checked})} className="rounded border-[#E5E5E5]" />
                      Required Field
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAdd} className="h-8 px-4 bg-[#111111] text-white text-xs font-semibold rounded-md">Save</button>
                  <button onClick={() => setIsAdding(false)} className="h-8 px-4 bg-white border border-[#E5E5E5] text-[#111111] text-xs font-semibold rounded-md">Cancel</button>
                </div>
              </div>
            )}

            <div className="overflow-hidden border border-[#E5E5E5] rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Required</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-sm">
                  {currentSpecs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#777777] text-xs">No specifications defined for this category.</td>
                    </tr>
                  ) : currentSpecs.map(spec => (
                    <tr key={spec.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-medium">{spec.name}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-[#F5F5F5] rounded text-[10px] uppercase border border-[#E5E5E5]">{spec.dataType}</span></td>
                      <td className="px-4 py-3 text-[#777777]">{spec.unit || '-'}</td>
                      <td className="px-4 py-3">{spec.isRequired ? <span className="text-[#22C55E]">Yes</span> : <span className="text-[#777777]">No</span>}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(spec.id)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 className="w-4 h-4 inline-block" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CapabilityGuard>
  );
}
