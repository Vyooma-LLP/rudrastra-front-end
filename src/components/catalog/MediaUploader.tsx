"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, GripVertical, FileText, Box, FileSpreadsheet, Film, Search } from 'lucide-react';
import { MediaStorageProvider } from '@/lib/storage/MediaStorageProvider';
import { SupabaseStorageProvider } from '@/lib/storage/SupabaseStorageProvider';
import { ImportCadModal } from './ImportCadModal';

export type MediaItem = {
  id?: string;
  url: string;
  mediaType: string;
  sortOrder: number;
  altText?: string;
};

interface MediaUploaderProps {
  initialMedia?: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

const storageProvider: MediaStorageProvider = new SupabaseStorageProvider();

export function MediaUploader({ initialMedia = [], onChange }: MediaUploaderProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange(mediaItems);
  }, [mediaItems, onChange]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    setIsUploading(true);
    try {
      const newMedia: MediaItem[] = [];
      const currentCount = mediaItems.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploaded = await storageProvider.upload(file);
        
        let defaultMediaType = 'image';
        if (file.name.match(/\.(step|stp|stl|iges|igs)$/i)) defaultMediaType = 'cad';
        else if (file.name.match(/\.(pdf)$/i)) defaultMediaType = 'datasheet';
        else if (file.name.match(/\.(csv)$/i)) defaultMediaType = 'document';
        else if (file.type.startsWith('video/')) defaultMediaType = 'video';

        newMedia.push({
          url: uploaded.url,
          mediaType: defaultMediaType,
          sortOrder: currentCount + i,
          altText: file.name
        });
      }

      setMediaItems(prev => [...prev, ...newMedia]);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload media");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (index: number, url: string) => {
    // Attempt delete from storage
    try {
      await storageProvider.delete(url);
    } catch (e) {
      console.error("Delete failed on provider, removing from state anyway", e);
    }

    setMediaItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Re-index sort orders
      return updated.map((m, i) => ({ ...m, sortOrder: i }));
    });
  };

  const handleUpdateMediaType = (index: number, newType: string) => {
    setMediaItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], mediaType: newType };
      return updated;
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

  const renderIcon = (type: string) => {
    switch (type) {
      case 'datasheet': return <FileText className="w-6 h-6 text-indigo-500" />;
      case 'document': return <FileSpreadsheet className="w-6 h-6 text-green-600" />;
      case 'cad': return <Box className="w-6 h-6 text-orange-500" />;
      case 'video': return <Film className="w-6 h-6 text-red-500" />;
      default: return <FileText className="w-6 h-6 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isUploading ? 'border-[#E5E5E5] bg-[#F5F5F5]' : 'border-[#CCCCCC] hover:border-[#111111] hover:bg-[#FAFAFA]'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (fileInputRef.current) {
            fileInputRef.current.files = e.dataTransfer.files;
            fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }}
      >
        <UploadCloud className={`w-8 h-8 mx-auto mb-3 ${isUploading ? 'text-[#A1A1AA] animate-pulse' : 'text-[#111111]'}`} />
        <p className="text-sm font-semibold text-[#111111]">
          {isUploading ? "Uploading..." : "Click or drag engineering assets here to upload"}
        </p>
        <p className="text-xs text-[#777777] mt-1">Supports images, videos, CAD (.step, .stl, .iges), PDFs, and CSVs.</p>
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*,video/*,.step,.stp,.stl,.iges,.igs,.pdf,.csv"
        />
        <div className="flex items-center justify-center gap-4 mt-4">
          <button 
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-4 inline-flex items-center justify-center bg-[#111111] text-white hover:bg-black text-xs font-semibold rounded-md disabled:opacity-50 transition-colors"
          >
            Select Files
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => setIsImportModalOpen(true)}
            className="h-8 px-4 inline-flex items-center justify-center bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#111111] text-xs font-semibold rounded-md disabled:opacity-50 transition-colors"
          >
            <Search className="w-3.5 h-3.5 mr-2" />
            Import Existing Asset
          </button>
        </div>
      </div>

      <ImportCadModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSelect={(asset) => {
          setMediaItems(prev => [...prev, {
            url: asset.url,
            mediaType: asset.mediaType,
            sortOrder: prev.length,
            altText: asset.altText
          }]);
        }}
        category="" // Future-proofing if we want to pass categoryId down
      />

      {mediaItems.length > 0 && (
        <div className="space-y-2">
          {mediaItems.map((media, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-[#E5E5E5] rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="text-[#A1A1AA] hover:text-black disabled:opacity-30"><GripVertical className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => moveDown(idx)} disabled={idx === mediaItems.length - 1} className="text-[#A1A1AA] hover:text-black disabled:opacity-30"><GripVertical className="w-3.5 h-3.5 rotate-180" /></button>
                </div>
                
                <div className="w-16 h-16 rounded-md bg-[#F5F5F5] overflow-hidden flex items-center justify-center border border-[#E5E5E5]">
                  {media.mediaType === 'image' ? (
                    <img src={media.url} alt={media.altText} className="object-cover w-full h-full" />
                  ) : (
                    renderIcon(media.mediaType)
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#111111] max-w-xs truncate" title={media.altText}>{media.altText || 'Asset File'}</p>
                  
                  <div className="mt-2">
                    <select
                      value={media.mediaType}
                      onChange={(e) => handleUpdateMediaType(idx, e.target.value)}
                      className="text-xs bg-white border border-[#E5E5E5] rounded-md px-2 py-1 focus:outline-none focus:border-[#111111]"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="datasheet">Datasheet (PDF)</option>
                      <option value="document">Performance Data / Document</option>
                      <option value="cad">CAD Model</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button type="button" onClick={() => handleRemove(idx, media.url)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors ml-4">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
