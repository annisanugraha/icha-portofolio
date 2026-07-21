'use client';
import { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-xs font-mono border transition-all ${type === 'success' ? 'bg-white border-[#e5e5e5] text-[#111]' : 'bg-[#fef2f2] border-red-200 text-red-700'}`}>
      {type === 'success' ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <XCircle size={16} className="text-red-500 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}
