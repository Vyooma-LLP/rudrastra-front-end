"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaUploader, MediaItem } from "./MediaUploader";

export type ProductFormMode = "create" | "edit";

type EngineProps = {
  mode: ProductFormMode;
  manufacturers: any[];
  categories: any[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void | string>;
};

export function ProductFormEngine({ mode, manufacturers, categories, initialData, onSubmit }: EngineProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [manufacturerId, setManufacturerId] = useState(initialData?.manufacturerId || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [mpn, setMpn] = useState(initialData?.mpn || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [media, setMedia] = useState<MediaItem[]>(initialData?.media || []);

  const [variants, setVariants] = useState<any[]>(initialData?.variants || [{ id: "new", name: "Standard", sku: "", specs: [] }]);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const specs = selectedCategory?.specDefinitions || [];

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        id: initialData?.id,
        version: initialData?.version,
        manufacturerId,
        categoryId,
        title,
        mpn,
        description,
        media,
        variants
      });
      router.push("/ops/catalog/products");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { id: `new_${Date.now()}`, name: "", sku: "", specs: [] }]);
  };

  const updateVariantSpec = (vIndex: number, specId: string, value: any, type: string) => {
    const newVariants = [...variants];
    const specList = newVariants[vIndex].specs;
    const existing = specList.find((s: any) => s.specId === specId);
    
    if (existing) {
      if (type === "string") { existing.valueString = value; existing.valueNumber = null; existing.valueBoolean = null; }
      if (type === "number") { existing.valueNumber = Number(value); existing.valueString = null; existing.valueBoolean = null; }
      if (type === "boolean") { existing.valueBoolean = value; existing.valueString = null; existing.valueNumber = null; }
    } else {
      specList.push({
        specId,
        valueString: type === "string" ? value : null,
        valueNumber: type === "number" ? Number(value) : null,
        valueBoolean: type === "boolean" ? value : null,
      });
    }
    setVariants(newVariants);
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
      <div className="flex gap-4 mb-8">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-indigo-500" : "bg-white/10"}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-indigo-500" : "bg-white/10"}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 3 ? "bg-indigo-500" : "bg-white/10"}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 4 ? "bg-indigo-500" : "bg-white/10"}`} />
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold text-white">Classification</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="manufacturer-select" className="block text-sm font-medium text-zinc-300 mb-1">Manufacturer</label>
              <select
                id="manufacturer-select"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                value={manufacturerId}
                onChange={(e) => setManufacturerId(e.target.value)}
                disabled={mode === "edit"}
              >
                <option value="">Select Manufacturer...</option>
                {manufacturers.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category-select" className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
              <select
                id="category-select"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={mode === "edit"}
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {mode === "edit" && <p className="text-xs text-zinc-500 mt-1">Classification cannot be changed after creation.</p>}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={handleNext} disabled={!categoryId} className="bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg">Next: Basic Info</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold text-white">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="product-title" className="block text-sm font-medium text-zinc-300 mb-1">Product Title / Family Name</label>
              <input id="product-title" type="text" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. T-Motor MN4014" />
            </div>
            <div>
              <label htmlFor="product-mpn" className="block text-sm font-medium text-zinc-300 mb-1">Manufacturer Part Number (MPN)</label>
              <input id="product-mpn" type="text" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={mpn} onChange={(e) => setMpn(e.target.value)} placeholder="e.g. MN4014-400KV (leave blank if base family)" />
            </div>
            <div>
              <label htmlFor="product-description" className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
              <textarea id="product-description" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={handlePrev} className="text-zinc-400 hover:text-white px-4 py-2">Back</button>
            <button onClick={handleNext} disabled={!title} className="bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg">Next: Media</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 bg-white rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#111111]">Engineering Assets & Media</h2>
          <p className="text-sm text-[#777777] mb-4">Upload and classify product assets. The first item will be used as the primary image. Treat CAD, Datasheets, and Performance Data as engineering assets.</p>
          <MediaUploader initialMedia={media} onChange={(updatedMedia) => setMedia(updatedMedia)} />
          <div className="flex justify-between pt-4">
            <button onClick={handlePrev} className="text-zinc-500 hover:text-black px-4 py-2">Back</button>
            <button onClick={handleNext} className="bg-indigo-500 text-white px-4 py-2 rounded-lg">Next: Variants & Specs</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold text-white">Variants & Specifications</h2>
          <div className="space-y-8">
            {variants.map((variant, vIndex) => (
              <div key={vIndex} className="p-4 bg-zinc-950 border border-white/5 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`variant-name-${vIndex}`} className="block text-sm text-zinc-400 mb-1">Variant Name</label>
                    <input id={`variant-name-${vIndex}`} type="text" className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-white" value={variant.name} onChange={(e) => { const newV = [...variants]; newV[vIndex].name = e.target.value; setVariants(newV); }} placeholder="e.g. 400KV" />
                  </div>
                  <div>
                    <label htmlFor={`variant-sku-${vIndex}`} className="block text-sm text-zinc-400 mb-1">Canonical SKU (Optional)</label>
                    <input id={`variant-sku-${vIndex}`} type="text" className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-white" value={variant.sku} onChange={(e) => { const newV = [...variants]; newV[vIndex].sku = e.target.value; setVariants(newV); }} />
                  </div>
                </div>

                {specs.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-sm font-medium text-zinc-300 mb-3">Technical Specifications</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {specs.map((spec: any) => {
                        const existingVal = variant.specs.find((s: any) => s.specId === spec.id);
                        const displayVal = existingVal ? (spec.dataType === "boolean" ? existingVal.valueBoolean : spec.dataType === "number" ? existingVal.valueNumber : existingVal.valueString) : "";
                        
                        return (
                          <div key={spec.id}>
                            <label htmlFor={`spec-${vIndex}-${spec.id}`} className="block text-xs text-zinc-500 mb-1">
                              {spec.name} {spec.unit ? `(${spec.unit})` : ""} {spec.isRequired && "*"}
                            </label>
                            {spec.dataType === "boolean" ? (
                              <select id={`spec-${vIndex}-${spec.id}`} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-white" value={displayVal !== "" ? displayVal.toString() : "false"} onChange={(e) => updateVariantSpec(vIndex, spec.id, e.target.value === "true", "boolean")}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                              </select>
                            ) : (
                              <input id={`spec-${vIndex}-${spec.id}`} type={spec.dataType === "number" ? "number" : "text"} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-white" value={displayVal || ""} onChange={(e) => updateVariantSpec(vIndex, spec.id, e.target.value, spec.dataType)} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={addVariant} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium px-4 py-2">+ Add Another Variant</button>
          <div className="flex justify-between pt-4">
            <button onClick={handlePrev} className="text-zinc-400 hover:text-white px-4 py-2">Back</button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium">
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
