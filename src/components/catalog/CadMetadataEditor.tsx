import React from 'react';
import type { MediaItem } from './MediaUploader';
import type { CadPresentation, CadView } from '@/db/schema';

interface CadMetadataEditorProps {
  asset: MediaItem;
  onChange: (updated: MediaItem) => void;
}

export function CadMetadataEditor({ asset, onChange }: CadMetadataEditorProps) {
  const metadata = asset.metadata || {};
  const presentation = (metadata.presentation as CadPresentation) || '';
  const view = (metadata.view as CadView) || '';

  const handlePresentationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as CadPresentation;
    const newMetadata = { ...metadata, presentation: val };
    // Clear view if not multi_view
    if (val !== 'multi_view') {
      delete newMetadata.view;
    }
    onChange({ ...asset, metadata: newMetadata });
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as CadView;
    onChange({ ...asset, metadata: { ...metadata, view: val } });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          CAD / Engineering Asset Format
        </label>
        <select
          value={presentation}
          onChange={handlePresentationChange}
          className="w-full text-xs bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="" disabled>Select Format...</option>
          <option value="single">Single Drawing Sheet (Composite)</option>
          <option value="multi_view">Separate Engineering Views</option>
          <option value="document">Engineering Document (PDF)</option>
          <option value="model">3D CAD Model (STEP, STL, etc.)</option>
        </select>
      </div>

      {presentation === 'multi_view' && (
        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            Engineering View Type
          </label>
          <select
            value={view}
            onChange={handleViewChange}
            className="w-full text-xs bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="" disabled>Select View...</option>
            <option value="top">Top View</option>
            <option value="bottom">Bottom View</option>
            <option value="side">Side View</option>
            <option value="front">Front View</option>
            <option value="rear">Rear View</option>
            <option value="isometric">Isometric View</option>
            <option value="custom">Custom View</option>
          </select>
        </div>
      )}
    </div>
  );
}
