'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageSectionHeader } from './PageSectionHeader';

interface ExperienceData {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  imageUrl?: string | null;
}

export const Timeline = ({ experiences }: { experiences: ExperienceData[] }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected = selectedIndex !== null ? experiences[selectedIndex] : null;

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % experiences.length);
  }, [selectedIndex, experiences.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + experiences.length) % experiences.length);
  }, [selectedIndex, experiences.length]);

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

  if (!experiences || experiences.length === 0) return null;

  return (
    <>
      <div className="space-y-0">
        
        <PageSectionHeader title="Chronology" number="02" />

        <div className="flex flex-col">
          {experiences.map((exp, i) => {
            const isLast = i === experiences.length - 1;
            
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-5%" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="flex items-start group cursor-pointer"
                onClick={() => setSelectedIndex(i)}
              >
                {/* 1. GAMBAR MEMORI - DESKTOP ONLY (KIRI) */}
                <div className="hidden md:block w-48 shrink-0 pt-1">
                  {exp.imageUrl ? (
                    <div className="aspect-video w-full bg-[#fafafa] border border-[#ebebeb] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out opacity-80 group-hover:opacity-100">
                      <img 
                        src={exp.imageUrl} 
                        alt={exp.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center">
                      <span className="text-[6px] text-[#ddd] tracking-widest uppercase font-mono">N/A</span>
                    </div>
                  )}
                </div>

                {/* 2. DIVIDER (TITIK & GARIS VERTIKAL) - TENGAH/KIRI MOBILE */}
                <div className="flex flex-col items-center mr-6 md:mx-10 shrink-0 self-stretch">
                  <div className="w-2 h-2 rounded-full bg-[#111] group-hover:bg-[#ddd] transition-colors duration-500 mt-[5px]" />
                  <div className={`w-[0.5px] bg-[#ebebeb] flex-1 ${isLast ? 'opacity-0' : 'opacity-100'}`} />
                </div>                {/* 3. KONTEN (KANAN) */}
                <div className="flex-1 pt-0 pb-10 space-y-4">
                  {/* Header: [Tahun] Judul */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-[#111] group-hover:opacity-70 transition-opacity duration-500 font-bold">
                      [{exp.year}]
                    </span>
                    <h4 className="font-mono text-[11px] md:text-[12px] tracking-tight text-[#111] group-hover:opacity-70 transition-opacity duration-500">
                      {exp.title}
                    </h4>
                  </div>

                  {/* GAMBAR MEMORI - MOBILE ONLY (TUMPUK) */}
                  <div className="md:hidden w-full">
                    {exp.imageUrl ? (
                      <div className="aspect-video w-full bg-[#fafafa] border border-[#ebebeb] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out opacity-80 group-hover:opacity-100">
                        <img 
                          src={exp.imageUrl} 
                          alt={exp.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center">
                        <span className="text-[6px] text-[#ddd] tracking-widest uppercase font-mono">N/A</span>
                      </div>
                    )}
                  </div>

                  {/* Body: Deskripsi */}
                  <div className="max-w-4xl">
                    <p className="text-[11px] md:text-[12px] text-[#777] leading-relaxed font-sans line-clamp-3 md:line-clamp-none pr-4 md:pr-12">
                      {exp.description}
                    </p>
                  </div>

                  {/* Footer: Company */}
                  <div>
                    <span className="text-[8px] tracking-[0.4em] text-[#bbb] group-hover:text-[#999] transition-colors font-mono italic">
                      at {exp.company}
                    </span>
                  </div>
                </div>
              </motion.div>
            );          })}
        </div>
      </div>

      {/* ── Experience Modal Lightbox ── */}
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
              >
                ←
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="w-12 h-12 flex items-center justify-center bg-white border border-[#ebebeb] text-[#111] hover:border-[#111] transition-all pointer-events-auto cursor-pointer"
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
                const threshold = 100; // Jarak geser minimal untuk ganti konten
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
              <div className="flex-[1.5] bg-[#fafafa] flex items-center justify-center overflow-hidden min-h-[250px] md:min-h-0">
                {selected.imageUrl ? (
                  <img 
                    src={selected.imageUrl} 
                    alt={selected.title}
                    className="w-full h-full object-contain p-4 md:p-8"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#ddd] gap-4">
                    <div className="w-12 h-px bg-[#eee]" />
                    <span className="text-[10px] tracking-[0.5em] uppercase font-mono">No Image Available</span>
                    <div className="w-12 h-px bg-[#eee]" />
                  </div>
                )}
              </div>

              {/* Info Side */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#ebebeb] bg-white relative z-10 overflow-hidden">
                {/* Scrollable Content Container */}
                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="label text-[#111]">{selected.year}</span>
                      <span className="text-[10px] font-mono text-[#ccc] tabular-nums">
                        {String(selectedIndex! + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-2xl md:text-3xl font-serif text-[#111] leading-tight tracking-tight">
                      {selected.title}
                    </p>
                    <p className="text-[10px] tracking-widest text-[#999] uppercase font-mono font-medium">
                      at {selected.company}
                    </p>
                  </div>
                  
                  <div className="w-12 h-px bg-[#111]" />

                  <p className="text-[12px] md:text-[13px] text-[#666] leading-relaxed font-sans whitespace-pre-line">
                    {selected.description}
                  </p>
                </div>

                {/* Fixed Footer */}
                <div className="pt-10 flex items-center justify-between bg-white shrink-0">
                  <span className="text-[9px] tracking-widest text-[#ccc] uppercase font-mono">
                    Professional Timeline
                  </span>
                  <button 
                    onClick={() => setSelectedIndex(null)}
                    className="text-[10px] tracking-[0.4em] text-[#111] uppercase hover:opacity-50 transition-opacity font-mono cursor-pointer"
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

