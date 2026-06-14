'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText } from 'lucide-react';

interface Props { 
  onUpload: (url: string | null) => void; 
  onDelete?: () => void;
  currentFile?: string | null; 
  label?: string; 
}

export const FileUploader = ({ onUpload, onDelete, currentFile, label = 'Document' }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(currentFile || '');
  const [preview, setPreview] = useState<string | null>(currentFile || null);

  useEffect(() => {
    setPreview(currentFile || null);
    setUrlInput(currentFile || '');
  }, [currentFile]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Hanya file PDF yang diizinkan!');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File terlalu besar! Maksimal 5MB.');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `cv_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      console.log('Uploading to bucket: portfolio, path:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Upload gagal: ${uploadError.message}. Pastikan bucket 'portfolio' ada dan设置为 PUBLIC.`);
      }

      console.log('Upload success, getting public URL...');

      const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
      console.log('Public URL:', data.publicUrl);

      if (data.publicUrl) {
        setPreview(data.publicUrl);
        onUpload(data.publicUrl);
        alert('CV berhasil diupload!');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.message || error.error_description || 'Unknown error. Cek console untuk detail.'));
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
        <div className="w-24 h-24 bg-[#fafafa] border border-[#ebebeb] overflow-hidden shrink-0 flex flex-col items-center justify-center relative group">
          {preview ? (
            <>
              <div className="flex flex-col items-center gap-2 p-2">
                <FileText size={24} className="text-[#111]" />
                <span className="text-[8px] text-[#999] tracking-widest uppercase truncate w-full text-center px-2">Document</span>
              </div>
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
                <input type="file" accept=".pdf" onChange={handleUpload} disabled={uploading} className="hidden" />
              </label>
              <p className="text-[8px] text-[#ccc] leading-relaxed uppercase tracking-widest">
                Recommended: PDF file under 5MB. Saved to Supabase.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <input 
                type="text" 
                value={urlInput} 
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://drive.google.com/.../view"
                className="w-full bg-[#fafafa] border border-[#ebebeb] text-[#111] text-[10px] px-4 py-3 focus:outline-none focus:border-[#ccc] font-mono transition-all"
              />
              <p className="text-[8px] text-[#ccc] leading-relaxed uppercase tracking-widest">
                Saves storage! Paste your Google Drive or Notion link.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
