'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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
      <section className="main-container pb-12 space-y-4">
        <span className="label block mb-8">Gallery</span>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-2">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="break-inside-avoid img-container rounded-sm overflow-hidden mb-2 cursor-zoom-in"
              onClick={() => setSelectedIndex(i)}
            >
              <img
                src={img}
                alt={`${title} gallery ${i + 1}`}
                className="w-full h-auto object-contain block transition-transform duration-700 hover:scale-[1.02]"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-white/40 backdrop-blur-xl"
            onClick={handleClose}
          >
            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 md:top-10 md:right-10 p-2 text-[#111] hover:opacity-50 transition-opacity z-[110]"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            {/* Navigation buttons */}
            <div className="absolute inset-x-4 md:inset-x-10 flex justify-between items-center pointer-events-none z-[110]">
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full text-[#111] hover:bg-white/20 transition-all pointer-events-auto"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full text-[#111] hover:bg-white/20 transition-all pointer-events-auto"
              >
                <ChevronRight size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Image Container */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedIndex]}
                alt={`${title} view`}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 label text-[#111] tracking-[0.5em]">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
