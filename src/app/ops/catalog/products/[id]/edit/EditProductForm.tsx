"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/Toast';

const CATEGORY_MAP: Record<string, string[]> = {
  "Propulsion": ["Motors", "ESCs", "Propellers", "Motor accessories"],
  "Flight Control": ["Flight controllers", "IMUs", "Sensors"],
  "Power": ["Batteries", "BMS", "Power modules", "PDB"],
  "Compute & AI": ["Companion computers", "AI accelerators", "SBCs"],
  "Communication": ["Telemetry", "Radios", "LTE", "Wi-Fi"],
  "Navigation": ["GNSS", "RTK", "Compass", "Optical flow"],
  "Airframe": ["Frames", "Landing gear", "Mounts"],
  "Payload": ["Gimbals", "Cameras", "LiDAR", "Thermal"]
};

const SPEC_TEMPLATES: Record<string, { section: string, label: string }[]> = {
  motor: [
    { section: "electrical", label: "KV Rating" },
    { section: "electrical", label: "Operating Voltage" },
    { section: "electrical", label: "Max Continuous Current (180S)" },
    { section: "electrical", label: "Max Continuous Power (180S)" },
    { section: "electrical", label: "Internal Resistance" },
    { section: "electrical", label: "Idle Current (10V)" },
    { section: "mechanical", label: "Stator Size" },
    { section: "mechanical", label: "Motor Dimensions" },
    { section: "mechanical", label: "Weight" },
    { section: "mechanical", label: "Shaft Diameter" },
    { section: "mechanical", label: "Mounting Pattern" },
  ],
  esc: [
    { section: "electrical", label: "Continuous Current" },
    { section: "electrical", label: "Peak Current (10s)" },
    { section: "electrical", label: "Input Voltage" },
    { section: "electrical", label: "BEC Output" },
    { section: "mechanical", label: "Dimensions" },
    { section: "mechanical", label: "Weight" },
  ],
  fc: [
    { section: "hardware", label: "MCU" },
    { section: "hardware", label: "IMU" },
    { section: "hardware", label: "Barometer" },
    { section: "hardware", label: "Input Voltage" },
    { section: "interface", label: "PWM Outputs" },
    { section: "interface", label: "UART Ports" },
  ]
};

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [parentCategory, setParentCategory] = useState(() => {
    if (product.category) {
      if (product.category.includes(" > ")) {
        return product.category.split(" > ")[0];
      }
      for (const [parent, subs] of Object.entries(CATEGORY_MAP)) {
        if (subs.some(sub => sub.toLowerCase() === product.category.toLowerCase())) {
          return parent;
        }
      }
    }
    return '';
  });

  const [subCategory, setSubCategory] = useState(() => {
    if (product.category) {
      if (product.category.includes(" > ")) {
        return product.category.split(" > ")[1];
      }
      return product.category;
    }
    return '';
  });

  // Parse existing imageUrl. If it's a JSON array string, parse it.
  const getInitialImages = () => {
    if (!product.imageUrl) return [];
    try {
      const url = product.imageUrl.trim();
      if (url.startsWith('[') && url.endsWith(']')) {
        return JSON.parse(url);
      }
      return [url];
    } catch {
      return [product.imageUrl];
    }
  };

  const [images, setImages] = useState<string[]>(getInitialImages());

  // Parse existing specifications.
  const getInitialSpecs = () => {
    if (!product || !product.specifications) return [];
    const specsList: { section: string, label: string, val: string }[] = [];
    try {
      const obj = typeof product.specifications === 'string' 
        ? JSON.parse(product.specifications) 
        : product.specifications;
      
      Object.keys(obj).forEach((section) => {
        if (Array.isArray(obj[section])) {
          obj[section].forEach((item: any) => {
            specsList.push({
              section: section,
              label: item.label,
              val: item.val || ''
            });
          });
        }
      });
    } catch (e) {
      console.error("Failed to parse specifications:", e);
    }
    return specsList;
  };

  const [specs, setSpecs] = useState<{ section: string, label: string, val: string }[]>(getInitialSpecs());

  const updateTemplateSpecs = (parent: string, sub: string) => {
    if (specs.length > 0) return; // Only load template if specs are empty
    const lowerParent = parent.toLowerCase();
    const lowerSub = sub.toLowerCase();
    
    let template: { section: string, label: string }[] = [];
    if (lowerSub.includes("motor") || lowerParent.includes("propulsion")) {
      template = SPEC_TEMPLATES.motor;
    } else if (lowerSub.includes("esc") || lowerParent.includes("power") || lowerSub.includes("batter")) {
      template = SPEC_TEMPLATES.esc;
    } else if (lowerSub.includes("flight") || lowerParent.includes("flight") || lowerSub.includes("fc") || lowerSub.includes("autopilot")) {
      template = SPEC_TEMPLATES.fc;
    }

    if (template.length > 0) {
      setSpecs(template.map(t => ({ section: t.section, label: t.label, val: "" })));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast("You can upload a maximum of 5 images per product.");
      return;
    }

    setUploading(true);
    setError(null);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to upload images");
      }
      const data = await res.json();
      setImages([...images, ...data.urls]);
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!parentCategory || !subCategory) {
      setError("Please select both category and subcategory.");
      return;
    }

    setLoading(true);
    setError(null);

    // Group specs by section
    const groupedSpecs: Record<string, { label: string, val: string }[]> = {};
    specs.forEach((s) => {
      if (!s.label.trim()) return; // Skip empty label entries
      const sec = (s.section || 'general').trim().toLowerCase();
      if (!groupedSpecs[sec]) {
        groupedSpecs[sec] = [];
      }
      groupedSpecs[sec].push({ label: s.label.trim(), val: (s.val || '').trim() });
    });

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      mpn: formData.get('mpn'),
      sku: formData.get('sku'),
      description: formData.get('description'),
      price: parseInt(formData.get('price') as string, 10) * 100, // convert to minor units
      stockQty: parseInt(formData.get('stockQty') as string, 10),
      category: `${parentCategory} > ${subCategory}`,
      imageUrl: JSON.stringify(images),
      specifications: groupedSpecs,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to update product');
      }

      router.push('/ops/catalog/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border border-[#E5E5E5]">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Product Title *</label>
        <input required name="title" defaultValue={product.title} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-sans" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Manufacturer Part Number (MPN) *</label>
          <input required name="mpn" defaultValue={product.mpn || ''} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-sans" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">SKU</label>
          <input name="sku" defaultValue={product.sku || ''} type="text" className="w-full border border-[#E5E5E5] p-2 text-sm font-mono" />
        </div>
      </div>

      {/* Dynamic Category/Subcategory Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">Parent Category *</label>
          <select 
            required 
            value={parentCategory} 
            onChange={(e) => {
              const p = e.target.value;
              setParentCategory(p);
              const subs = CATEGORY_MAP[p] || [];
              const defaultSub = subs[0] || "";
              setSubCategory(defaultSub);
              updateTemplateSpecs(p, defaultSub);
            }}
            className="w-full border border-[#E5E5E5] bg-white p-2 text-sm font-sans focus:outline-none focus:border-black"
          >
            <option value="">Select Category</option>
            {Object.keys(CATEGORY_MAP).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">Sub Category *</label>
          <select 
            required 
            value={subCategory} 
            onChange={(e) => {
              const s = e.target.value;
              setSubCategory(s);
              updateTemplateSpecs(parentCategory, s);
            }}
            disabled={!parentCategory}
            className="w-full border border-[#E5E5E5] bg-white p-2 text-sm font-sans focus:outline-none focus:border-black disabled:opacity-50"
          >
            <option value="">Select Subcategory</option>
            {(CATEGORY_MAP[parentCategory] || []).map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Price (INR) *</label>
          <input required name="price" defaultValue={product.price / 100} type="number" min="0" step="1" className="w-full border border-[#E5E5E5] p-2 text-sm font-mono" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Stock *</label>
          <input required name="stockQty" defaultValue={product.stockQty} type="number" min="0" className="w-full border border-[#E5E5E5] p-2 text-sm font-mono" />
        </div>
      </div>

      {/* 5 Images Upload Section */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">Product Images (Max 5)</label>
        
        <div className="flex gap-4 items-center">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={images.length >= 5 || uploading}
            className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer disabled:opacity-50"
          />
          {uploading && <span className="text-xs text-slate-500 animate-pulse">Uploading...</span>}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-5 gap-3 pt-2">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-square border border-[#E5E5E5] bg-slate-50 rounded overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-800 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="text-[10px] text-slate-500">
          Upload up to 5 product images. JPEG, PNG, WEBP supported.
        </div>
      </div>

      {/* Specifications Editor */}
      <div className="space-y-3 pt-4 border-t border-[#E5E5E5]">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">Technical Specifications</label>
          <button 
            type="button" 
            onClick={() => setSpecs([...specs, { section: "electrical", label: "", val: "" }])}
            className="px-2.5 py-1 bg-white border border-[#E5E5E5] text-[10px] font-bold uppercase hover:bg-slate-50 transition-colors"
          >
            + Add Spec Field
          </button>
        </div>

        {specs.length === 0 ? (
          <p className="text-[11px] text-[#777777] italic p-1">No specifications added yet. Select a category and subcategory above to load a template, or click "Add Spec Field".</p>
        ) : (
          <div className="space-y-2 bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <div className="col-span-3">Group (e.g. Electrical)</div>
              <div className="col-span-4">Parameter Label</div>
              <div className="col-span-4">Value</div>
              <div className="col-span-1 text-center">Delete</div>
            </div>
            
            {specs.map((spec, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                {/* Section Group */}
                <input 
                  type="text" 
                  value={spec.section}
                  placeholder="Section"
                  onChange={(e) => {
                    const updated = [...specs];
                    updated[idx].section = e.target.value;
                    setSpecs(updated);
                  }}
                  className="col-span-3 border border-[#E5E5E5] bg-white p-1.5 text-[11px] font-mono capitalize"
                />
                {/* Spec Label */}
                <input 
                  type="text" 
                  value={spec.label}
                  placeholder="Parameter Label"
                  onChange={(e) => {
                    const updated = [...specs];
                    updated[idx].label = e.target.value;
                    setSpecs(updated);
                  }}
                  className="col-span-4 border border-[#E5E5E5] bg-white p-1.5 text-[11px] font-sans"
                />
                {/* Spec Value */}
                <input 
                  type="text" 
                  value={spec.val}
                  placeholder="Value (e.g. 400KV)"
                  onChange={(e) => {
                    const updated = [...specs];
                    updated[idx].val = e.target.value;
                    setSpecs(updated);
                  }}
                  className="col-span-4 border border-[#E5E5E5] bg-white p-1.5 text-[11px] font-sans font-medium"
                />
                {/* Delete button */}
                <button 
                  type="button" 
                  onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                  className="col-span-1 text-red-500 hover:text-red-700 p-1 font-bold text-base flex justify-center items-center"
                  title="Delete specification field"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Description</label>
        <textarea name="description" defaultValue={product.description || ''} rows={4} className="w-full border border-[#E5E5E5] p-2 text-sm font-sans"></textarea>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input type="checkbox" name="isActive" id="isActive" defaultChecked={product.isActive} className="h-4 w-4 border-[#E5E5E5] text-black focus:ring-black" />
        <label htmlFor="isActive" className="text-sm font-bold text-[#111111]">Active on Storefront</label>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-[#111111] text-white text-sm font-bold hover:bg-black disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Update Product'}
        </button>
      </div>
    </form>
  );
}
