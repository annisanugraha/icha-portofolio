// src/components/admin/MultiImageUploader.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface MultiImageUploaderProps {
  onUpload: (urls: string[]) => void;
  currentImages?: string[];
  label?: string;
}

export const MultiImageUploader = ({ onUpload, currentImages = [], label = "Project Gallery" }: MultiImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    setImages(currentImages);
  }, [currentImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newUrls: string[] = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        if (data.publicUrl) {
          newUrls.push(data.publicUrl);
        }
      }

      setImages(newUrls);
      onUpload(newUrls);

    } catch (error: any) {
      console.error('Multi-upload error:', error);
      alert('Error uploading images: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const newUrls = [...images, urlInput.trim()];
    setImages(newUrls);
    onUpload(newUrls);
    setUrlInput('');
    setUrlMode(false);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onUpload(updated);
  };

  return (
    <div className="space-y-6 border-t border-[#ebebeb] pt-8">
      {/* Header with Toggles */}
      <div className="flex justify-between items-center border-b border-[#ebebeb] pb-4">
        <div className="space-y-1">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#999]">{label} ({images.length})</p>
          <p className="text-[8px] text-[#ccc] uppercase tracking-widest leading-none">External URLs are recommended for large archives.</p>
        </div>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => setUrlMode(false)}
            className={`text-[8px] tracking-[0.2em] uppercase transition-colors ${!urlMode ? 'text-[#111] font-bold' : 'text-[#ccc] hover:text-[#999]'}`}
          >
            Upload Files
          </button>
          <button 
            type="button"
            onClick={() => setUrlMode(true)}
            className={`text-[8px] tracking-[0.2em] uppercase transition-colors ${urlMode ? 'text-[#111] font-bold' : 'text-[#ccc] hover:text-[#999]'}`}
          >
            Add by URL
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="min-h-[50px]">
        {urlMode ? (
          <form onSubmit={handleAddUrl} className="flex gap-2">
            <input 
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste image direct link (e.g. Imgur, Pinterest, etc.)"
              className="flex-1 bg-[#fafafa] border border-[#ebebeb] text-[10px] px-4 py-3 focus:outline-none focus:border-[#ccc] font-mono transition-all"
            />
            <button type="submit" className="bg-white border border-[#ebebeb] text-[#999] text-[9px] px-6 py-2 uppercase tracking-widest hover:border-[#111] hover:text-[#111] transition-all cursor-pointer">
              Add Link
            </button>
          </form>
        ) : (
          <label className="flex items-center justify-center w-full h-12 border border-dashed border-[#ebebeb] text-[#999] hover:border-[#111] hover:text-[#111] transition-all cursor-pointer text-[9px] tracking-[0.3em] uppercase">
            {uploading ? 'Processing Gallery Upload...' : '+ Drop Files or Click to Browse'}
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={uploading}
              className="hidden" 
            />
          </label>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((url, i) => (
          <div key={i} className="group relative aspect-square bg-[#fafafa] border border-[#ebebeb] rounded-sm overflow-hidden">
            <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400/fafafa/ccc?text=Broken+Link')} />
            <button 
              type="button"
              onClick={() => removeImage(i)}
              className="absolute inset-0 bg-red-500/80 text-white text-[8px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer font-bold"
            >
              REMOVE
            </button>
          </div>
        ))}
        {images.length === 0 && !uploading && (
          <div className="col-span-full py-8 bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center">
            <span className="text-[9px] tracking-widest text-[#ccc] uppercase italic">Gallery is empty</span>
          </div>
        )}
        {uploading && (
          <div className="aspect-square bg-[#fafafa] border border-[#ebebeb] rounded-sm flex items-center justify-center">
            <div className="w-1 h-4 bg-[#111] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
