'use client';

import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Certificate } from '@/types';
import { useEffect, useCallback, useState } from 'react';

interface Props {
  certificate: Certificate | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalCount?: number;
}

export default function CertificateModal({ 
  certificate, 
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalCount 
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!certificate) return;
    if (e.key === 'ArrowRight' && onNext) onNext();
    if (e.key === 'ArrowLeft' && onPrev) onPrev();
    if (e.key === 'Escape') onClose();
  }, [certificate, onNext, onPrev, onClose]);

  useEffect(() => {
    if (certificate) {
      document.body.style.overflow = 'hidden';
      if ((window as any).__lenis) (window as any).__lenis.stop();
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      if ((window as any).__lenis) (window as any).__lenis.start();
    }
    return () => {
      document.body.style.overflow = 'unset';
      if ((window as any).__lenis) (window as any).__lenis.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [certificate, handleKeyDown]);

  if (!certificate || !mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <div 
        data-cursor=""
        className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-12 overflow-hidden"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-white/95 backdrop-blur-sm cursor-zoom-out"
        />

        {/* Modal Content Container — m-auto guarantees exact vertical/horizontal center */}
        <motion.div
          key={certificate.id}
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          drag={onNext && onPrev ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const threshold = 100;
            if (info.offset.x > threshold && onPrev) {
              onPrev();
            } else if (info.offset.x < -threshold && onNext) {
              onNext();
            }
          }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="relative m-auto w-full max-w-5xl bg-white border border-[#ebebeb] shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[88vh] touch-none"
        >
          {/* Image Side */}
          <div className="flex-[1.5] bg-[#fafafa] flex items-center justify-center overflow-hidden min-h-[250px] md:min-h-0 relative">
            <Image 
              src={certificate.imageUrl || '/placeholder.png'} 
              alt={certificate.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain p-4 md:p-8"
            />
          </div>

          {/* Info Side */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#ebebeb] bg-white relative z-10 overflow-hidden">
            {/* Scrollable Content Container */}
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="label text-[#111]">{certificate.category || 'Recognition'}</span>
                  {currentIndex !== undefined && totalCount !== undefined && (
                    <span className="text-[10px] font-mono text-[#ccc] tabular-nums">
                      {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <p className="text-2xl md:text-3xl font-serif text-[#111] leading-tight tracking-tight">
                  {certificate.title}
                </p>
              </div>
              
              <div className="w-12 h-px bg-[#111]" />

              <p className="text-[12px] md:text-[13px] text-[#666] leading-relaxed font-sans whitespace-pre-line">
                {certificate.description || 'No description provided.'}
              </p>
            </div>

            {/* Fixed Footer */}
            <div className="pt-10 flex items-center justify-between gap-4 bg-white shrink-0 min-w-0">
              <span className="text-[9px] tracking-widest text-[#ccc] uppercase font-mono truncate min-w-0 flex-1">
                Archives · {(certificate.category || 'Recognition').toUpperCase()}
              </span>
              <button 
                onClick={onClose}
                className="text-[10px] tracking-[0.4em] text-[#111] uppercase hover:opacity-50 transition-opacity font-mono cursor-pointer shrink-0 whitespace-nowrap"
              >
                [ Close ]
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

