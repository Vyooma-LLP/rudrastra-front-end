"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, FileBox, FileText, Box, FileSpreadsheet, Film } from 'lucide-react';
import { getExistingAssets } from '@/app/ops/catalog/products/actions';
import Image from 'next/image';

interface ImportAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: {url: string; mediaType: string; assetRole?: string; altText: string}) => void;
  category: string;
  allowedMediaTypes?: string[];
}

export function ImportCadModal({ isOpen, onClose, onSelect, category, allowedMediaTypes }: ImportAssetModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getExistingAssets(allowedMediaTypes).then(data => {
        setAssets(data);
        setIsLoading(false);
      }).catch(err => {
        console.error(err);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter(c => 
    (c.altText?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderIcon = (type: string) => {
    switch (type) {
      case 'datasheet': return <FileText className="w-8 h-8 text-indigo-500" />;
      case 'document': return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
      case 'cad': return <Box className="w-8 h-8 text-orange-500" />;
      case 'video': return <Film className="w-8 h-8 text-red-500" />;
      default: return <FileText className="w-8 h-8 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white border border-[#E5E5E5] shadow-lg w-full max-w-3xl flex flex-col max-h-[85vh] rounded-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5]">
          <h2 className="font-heading font-bold text-lg text-[#111111]">Import Existing Asset</h2>
          <button onClick={onClose} className="text-[#777777] hover:text-[#111111] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#E5E5E5] bg-[#F5F5F5]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search by file name or product title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12 text-[#777777] flex flex-col items-center">
              <FileBox className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No existing assets found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {filteredAssets.map(asset => (
                <div 
                  key={asset.id}
                  onClick={() => {
                    onSelect({ url: asset.url, mediaType: asset.mediaType, assetRole: asset.assetRole, altText: asset.altText || 'Asset' });
                    onClose();
                  }}
                  className="border border-[#E5E5E5] rounded-lg p-3 cursor-pointer hover:border-[#111111] hover:bg-[#FAFAFA] group transition-colors flex flex-col"
                >
                  <div className="aspect-square bg-[#F5F5F5] rounded-md flex items-center justify-center mb-3 overflow-hidden border border-[#E5E5E5]">
                    {asset.mediaType === 'image' ? (
                      <img src={asset.url} alt={asset.altText} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="group-hover:scale-110 transition-transform">
                        {renderIcon(asset.mediaType)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#111111] truncate" title={asset.altText}>{asset.altText || 'Asset'}</div>
                  <div className="text-[10px] text-[#777777] truncate mt-1">Product: {asset.productTitle || 'Unknown'}</div>
                  <div className="text-[10px] text-indigo-500 uppercase font-semibold mt-1">{asset.mediaType}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
