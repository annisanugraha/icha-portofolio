'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CertificateData {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  createdAt: Date;
}

interface CertificateGridProps {
  certificates: CertificateData[];
}

// ── Spotlight Card Component ──
function SpotlightCard({ 
  item, 
  index, 
  onClick 
}: { 
  item: CertificateData; 
  index: number; 
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: false, margin: '-5%' }}
      transition={{ 
        duration: 0.8, 
        delay: (index % 4) * 0.12,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group space-y-4 cursor-pointer relative"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Spotlight */}
      <div className="img-container aspect-[3/2] rounded-sm overflow-hidden bg-[#fafafa] relative">
        <Image
          src={item.imageUrl || 'https://placehold.co/900x600/f5f5f5/999999?text=—'}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        {/* Spotlight overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(circle 150px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255,255,255,0.25), transparent 80%)`
              : 'none',
          }}
        />
        {/* Hover border glow */}
        <div className="absolute inset-0 border border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
      </div>

      {/* Meta */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="label">{item.category}</span>
          <span className="label text-[#ddd]">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <p className="text-base font-serif group-hover:opacity-50 transition-opacity duration-500">
          {item.title}
        </p>
        <p className="text-[11px] text-[#999] leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export const CertificateGrid = ({ certificates }: CertificateGridProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected = selectedIndex !== null ? certificates[selectedIndex] : null;

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % certificates.length);
  }, [selectedIndex, certificates.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + certificates.length) % certificates.length);
  }, [selectedIndex, certificates.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
      if ((window as any).__lenis) (window as any).__lenis.stop();
    } else {
      document.body.style.overflow = 'unset';
      if ((window as any).__lenis) (window as any).__lenis.start();
    }
    return () => {
      document.body.style.overflow = 'unset';
      if ((window as any).__lenis) (window as any).__lenis.start();
    };
  }, [selected]);

  if (certificates.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-14">
        {certificates.map((item, i) => (
          <SpotlightCard
            key={item.id}
            item={item}
            index={i}
            onClick={() => setSelectedIndex(i)}
          />
        ))}
      </div>

      {/* ── Modal Lightbox with Navigation ── */}
      <AnimatePresence mode="wait">
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-20 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm cursor-zoom-out"
            />

            {/* Navigation Arrows (Desktop Only) */}
            <div className="absolute inset-x-4 md:inset-x-10 top-1/2 -translate-y-1/2 hidden md:flex justify-between pointer-events-none z-50">
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="w-12 h-12 flex items-center justify-center bg-white border border-[#ebebeb] text-[#111] hover:border-[#111] transition-all pointer-events-auto cursor-pointer"
                title="Previous (Left Arrow)"
              >
                ←
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="w-12 h-12 flex items-center justify-center bg-white border border-[#ebebeb] text-[#111] hover:border-[#111] transition-all pointer-events-auto cursor-pointer"
                title="Next (Right Arrow)"
              >
                →
              </button>
            </div>

            {/* Content Container */}
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const threshold = 100;
                if (info.offset.x > threshold) {
                  handlePrev();
                } else if (info.offset.x < -threshold) {
                  handleNext();
                }
              }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-5xl bg-white border border-[#ebebeb] shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-full touch-none"
            >
              {/* Image Side */}
              <div className="flex-[1.5] bg-[#fafafa] flex items-center justify-center overflow-hidden min-h-[250px] md:min-h-0 relative">
                <Image 
                  src={selected.imageUrl || 'https://placehold.co/900x600/f5f5f5/999999?text=—'} 
                  alt={selected.title}
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
                      <span className="label text-[#111]">{selected.category}</span>
                      <span className="text-[10px] font-mono text-[#ccc] tabular-nums">
                        {String(selectedIndex! + 1).padStart(2, '0')} / {String(certificates.length).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-2xl md:text-3xl font-serif text-[#111] leading-tight tracking-tight">
                      {selected.title}
                    </p>
                  </div>
                  
                  <div className="w-12 h-px bg-[#111]" />

                  <p className="text-[12px] md:text-[13px] text-[#666] leading-relaxed font-sans whitespace-pre-line">
                    {selected.description}
                  </p>
                </div>

                {/* Fixed Footer */}
                <div className="pt-10 flex items-center justify-between gap-4 bg-white shrink-0 min-w-0">
                  <span className="text-[9px] tracking-widest text-[#ccc] uppercase font-mono truncate min-w-0 flex-1">
                    Archives · Recognition
                  </span>
                  <button 
                    onClick={() => setSelectedIndex(null)}
                    className="text-[10px] tracking-[0.4em] text-[#111] uppercase hover:opacity-50 transition-opacity font-mono cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    [ Close ]
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
