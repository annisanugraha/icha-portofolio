// src/components/admin/ImageUploader.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Props { 
  onUpload: (url: string | null) => void; 
  onDelete?: () => void;
  currentImage?: string | null; 
  label?: string; 
  bucket?: string;
}

export const ImageUploader = ({ onUpload, onDelete, currentImage, label = 'Image', bucket = 'portfolio' }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(currentImage || '');
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  useEffect(() => {
    setPreview(currentImage || null);
    setUrlInput(currentImage || '');
  }, [currentImage]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      const { error } = await supabase.storage.from(bucket).upload(filePath, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      if (data.publicUrl) { 
        setPreview(data.publicUrl); 
        onUpload(data.publicUrl); 
      }
    } catch (error: any) { 
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.message || 'Unknown error')); 
    } finally { 
      setUploading(false); 
    }
  };

  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    setPreview(val || null);
    onUpload(val || null);
  };

  const handleRemove = () => {
    setPreview(null);
    setUrlInput('');
    onUpload(null);
    if (onDelete) onDelete();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#ebebeb] pb-2">
        <p className="text-[9px] tracking-[0.4em] uppercase text-[#999]">{label}</p>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => setMode('upload')}
            className={`text-[8px] tracking-[0.2em] uppercase transition-colors ${mode === 'upload' ? 'text-[#111] font-bold' : 'text-[#ccc] hover:text-[#999]'}`}
          >
            Upload
          </button>
          <button 
            type="button"
            onClick={() => setMode('url')}
            className={`text-[8px] tracking-[0.2em] uppercase transition-colors ${mode === 'url' ? 'text-[#111] font-bold' : 'text-[#ccc] hover:text-[#999]'}`}
          >
            Link URL
          </button>
        </div>
      </div>

      <div className="flex items-start gap-6">
        {/* Preview Container */}
        <div className="w-24 h-24 bg-[#fafafa] border border-[#ebebeb] overflow-hidden shrink-0 flex items-center justify-center relative group">
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400/fafafa/ccc?text=INVALID+URL')} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={handleRemove} className="text-[8px] text-white tracking-widest uppercase font-bold">Delete</button>
              </div>
            </>
          ) : (
            <span className="text-[8px] text-[#ccc] tracking-widest uppercase">No Media</span>
          )}
          {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><span className="text-[8px] text-[#111] animate-pulse font-mono tracking-tighter">Uploading...</span></div>}
        </div>

        {/* Action Area */}
        <div className="flex-1 space-y-3">
          {mode === 'upload' ? (
            <div className="space-y-3">
              <label className="inline-block px-6 py-2.5 border border-[#ebebeb] text-[#999] text-[9px] tracking-[0.3em] uppercase hover:border-[#111] hover:text-[#111] transition-all cursor-pointer">
                {uploading ? 'Processing...' : 'Browse Computer'}
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
              </label>
              <p className="text-[8px] text-[#ccc] leading-relaxed uppercase tracking-widest">
                Recommended: Square PNG/JPG under 2MB. Saved to Supabase.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <input 
                type="text" 
                value={urlInput} 
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-[#fafafa] border border-[#ebebeb] text-[#111] text-[10px] px-4 py-3 focus:outline-none focus:border-[#ccc] font-mono transition-all"
              />
              <p className="text-[8px] text-[#ccc] leading-relaxed uppercase tracking-widest">
                Saves storage! Use external links from Imgur, Pinterest, or your own CDN.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
