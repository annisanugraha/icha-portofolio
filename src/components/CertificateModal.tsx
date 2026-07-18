'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Certificate } from '@/types';
import { useEffect } from 'react';

interface Props {
  certificate: Certificate | null;
  onClose: () => void;
}

export default function CertificateModal({ certificate, onClose }: Props) {
  useEffect(() => {
    if (certificate) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [certificate]);

  if (!certificate) return null;

  return (
    <AnimatePresence>
      {/* Full backdrop — starts after sidebar (left-16 on md+) */}
      <div 
        data-cursor=""
        className="fixed inset-0 md:left-16 z-[999999] flex items-center justify-center p-6 md:p-12"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-[2px] cursor-pointer"
        />

        {/* Modal Card — inline card style like /archives page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
        >
          {/* Left: Certificate Image */}
          <div className="w-full md:w-[45%] shrink-0 bg-[#f5f5f3] flex items-center justify-center p-8 min-h-[280px] md:min-h-0">
            <div className="relative w-full h-full min-h-[220px]">
              <Image
                src={certificate.imageUrl || '/placeholder.png'}
                alt={certificate.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col overflow-y-auto"
          >
            <div className="flex-1">
              <span className="text-[9px] tracking-[0.35em] uppercase text-[#aaa] font-mono block mb-4">
                {certificate.category || 'Recognition'}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-[#111] leading-tight mb-6">
                {certificate.title}
              </h3>
              {certificate.description && (
                <p className="text-sm text-[#666] leading-relaxed whitespace-pre-wrap font-mono">
                  {certificate.description}
                </p>
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-[#ebebeb] flex justify-between items-center gap-4">
              <span className="text-[8px] tracking-[0.4em] uppercase text-[#ccc] font-mono truncate">
                ARCHIVES — {(certificate.category || 'RECOGNITION').toUpperCase()}
              </span>
              <button
                onClick={onClose}
                className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#111] hover:text-[#ff3333] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              >
                [ CLOSE ]
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
