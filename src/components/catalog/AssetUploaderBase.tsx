"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, GripVertical, FileText, Box, FileSpreadsheet, Film, Search } from 'lucide-react';
import { MediaStorageProvider } from '@/lib/storage/MediaStorageProvider';
import { SupabaseStorageProvider } from '@/lib/storage/SupabaseStorageProvider';
import { ImportCadModal } from './ImportCadModal';
import type { MediaItem } from './MediaUploader';

interface AssetUploaderBaseProps {
  title: string;
  description: string;
  accept: string;
  defaultMediaType: string;
  defaultAssetRole: string;
  allowedAssetRoles: { label: string, value: string }[];
  allowedImportMediaTypes?: string[];
  initialMedia?: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  storageProvider?: MediaStorageProvider;
  metadataEditor?: (asset: MediaItem, onChange: (updated: MediaItem) => void) => React.ReactNode;
}

const defaultStorageProvider = new SupabaseStorageProvider();

export function AssetUploaderBase({ 
  title, 
  description, 
  accept, 
  defaultMediaType, 
  defaultAssetRole,
  allowedAssetRoles,
  allowedImportMediaTypes,
  initialMedia = [], 
  onChange,
  storageProvider = defaultStorageProvider,
  metadataEditor
}: AssetUploaderBaseProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange(mediaItems);
  }, [mediaItems, onChange]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const newMedia: MediaItem[] = [];
      const currentCount = mediaItems.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploaded = await storageProvider.upload(file, (progress) => {
           setUploadProgress(progress);
        });
        
        newMedia.push({
          url: uploaded.url,
          mediaType: defaultMediaType,
          assetRole: defaultAssetRole,
          sortOrder: currentCount + i,
          altText: file.name
        });
      }

      setMediaItems(prev => [...prev, ...newMedia]);
    } catch (err: any) {
      console.error("Upload failed", err);
      alert(err.message || "Failed to upload media");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    // Phase 5 Correction: Do NOT immediately delete from storage.
    // Just remove it from form state. Actual cleanup happens on save.
    setMediaItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((m, i) => ({ ...m, sortOrder: i }));
    });
  };

  const handleUpdateRole = (index: number, newRole: string) => {
    setMediaItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], assetRole: newRole };
      return updated;
    });
  };

  const handleUpdatePrimary = (index: number) => {
    if (index === 0) return;
    setMediaItems(prev => {
      const updated = [...prev];
      const temp = updated[index];
      // Move to top and shift everything else down
      updated.splice(index, 1);
      updated.unshift(temp);
      return updated.map((m, i) => ({ ...m, sortOrder: i }));
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setMediaItems(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated.map((m, i) => ({ ...m, sortOrder: i }));
    });
  };

  const moveDown = (index: number) => {
    if (index === mediaItems.length - 1) return;
    setMediaItems(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated.map((m, i) => ({ ...m, sortOrder: i }));
    });
  };

  const renderIcon = (type: string, role?: string) => {
    if (type === 'cad') return <Box className="w-6 h-6 text-orange-500" />;
    if (type === 'video') return <Film className="w-6 h-6 text-red-500" />;
    if (role === 'datasheet' || role === 'manual' || role === 'certification') return <FileText className="w-6 h-6 text-indigo-500" />;
    if (role === 'performance_data' || role === 'test_report') return <FileSpreadsheet className="w-6 h-6 text-green-600" />;
    return <FileText className="w-6 h-6 text-zinc-400" />;
  };

  return (
    <div className="space-y-4 border border-zinc-800 rounded-xl p-6 bg-zinc-900/50">
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isUploading ? 'border-zinc-700 bg-zinc-800/50' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (fileInputRef.current && !isUploading) {
            fileInputRef.current.files = e.dataTransfer.files;
            fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }}
      >
        <UploadCloud className={`w-8 h-8 mx-auto mb-3 ${isUploading ? 'text-zinc-500 animate-pulse' : 'text-zinc-400'}`} />
        <p className="text-sm font-semibold text-white">
          {isUploading ? `Uploading... ${uploadProgress}%` : `Click or drag files here to upload`}
        </p>
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
          accept={accept}
        />
        <div className="flex items-center justify-center gap-4 mt-4">
          <button 
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-4 inline-flex items-center justify-center bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-md disabled:opacity-50 transition-colors"
          >
            Select Files
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => setIsImportModalOpen(true)}
            className="h-8 px-4 inline-flex items-center justify-center bg-transparent border border-zinc-700 text-white hover:bg-zinc-800 text-xs font-semibold rounded-md disabled:opacity-50 transition-colors"
          >
            <Search className="w-3.5 h-3.5 mr-2" />
            Import Existing Asset
          </button>
        </div>
        {isUploading && (
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-4">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </div>

      <ImportCadModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        allowedMediaTypes={allowedImportMediaTypes || [defaultMediaType]}
        onSelect={(asset) => {
          setMediaItems(prev => [...prev, {
            url: asset.url,
            mediaType: asset.mediaType,
            assetRole: defaultAssetRole, // Force the imported asset to adopt the role of this section
            sortOrder: prev.length,
            altText: asset.altText
          }]);
        }}
        category="" 
      />

      {mediaItems.length > 0 && (
        <div className="space-y-2 mt-4">
          {mediaItems.map((media, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="text-zinc-600 hover:text-white disabled:opacity-30"><GripVertical className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => moveDown(idx)} disabled={idx === mediaItems.length - 1} className="text-zinc-600 hover:text-white disabled:opacity-30"><GripVertical className="w-3.5 h-3.5 rotate-180" /></button>
                </div>
                
                <div className="w-16 h-16 rounded-md bg-zinc-900 overflow-hidden flex items-center justify-center border border-zinc-800 shrink-0">
                  {media.mediaType === 'image' ? (
                    <img src={media.url} alt={media.altText} className="object-cover w-full h-full" />
                  ) : (
                    renderIcon(media.mediaType, media.assetRole)
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white max-w-full truncate" title={media.altText}>{media.altText || 'Asset File'}</p>
                  
                  {allowedAssetRoles.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        value={media.assetRole}
                        onChange={(e) => handleUpdateRole(idx, e.target.value)}
                        className="text-xs bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-white focus:outline-none focus:border-white"
                      >
                        {allowedAssetRoles.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      
                      {media.mediaType === 'image' && idx !== 0 && (
                        <button type="button" onClick={() => handleUpdatePrimary(idx)} className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded hover:bg-indigo-500/20">
                          Set Primary
                        </button>
                      )}
                      {media.mediaType === 'image' && idx === 0 && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                  )}
                  {metadataEditor && (
                    <div className="mt-3 bg-zinc-900/50 p-3 rounded border border-zinc-800">
                      {metadataEditor(media, (updated: MediaItem) => {
                        setMediaItems(prev => {
                          const newItems = [...prev];
                          newItems[idx] = updated;
                          return newItems;
                        });
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <button type="button" onClick={() => handleRemove(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors ml-4 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
