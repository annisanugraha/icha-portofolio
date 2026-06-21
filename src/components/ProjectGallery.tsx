'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export const ProjectGallery = ({ images, title }: ProjectGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  }, [selectedIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  }, [selectedIndex, images.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev, handleClose]);

  // Scroll lock
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-2">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
            className="break-inside-avoid mb-2 cursor-zoom-in"
            onClick={() => setSelectedIndex(i)}
          >
            <Image
              src={img}
              alt={`${title} gallery ${i + 1}`}
              width={0}
              height={0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-auto object-contain block"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-white/60 backdrop-blur-xl"
            onClick={handleClose}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 md:top-10 md:right-10 p-2 text-[#111] hover:opacity-50 transition-opacity z-[110]"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Navigation buttons */}
            <div className="absolute inset-x-4 md:inset-x-10 flex justify-between items-center z-[110]">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full text-[#111] hover:bg-white/20 transition-all pointer-events-auto"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full text-[#111] hover:bg-white/20 transition-all pointer-events-auto"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Image Container */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative max-w-6xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={`${title} view`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.5em] text-[#111] uppercase">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
