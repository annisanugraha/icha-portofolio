'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ExperienceData {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  imageUrl?: string | null;
}

export const Timeline = ({ experiences }: { experiences: ExperienceData[] }) => {
  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="space-y-0">
      <div className="mb-12">
        <span className="label tracking-[0.5em] text-[#999] uppercase text-[9px]">Chronology</span>
      </div>

      <div className="flex flex-col">
        {experiences.map((exp, i) => {
          const isLast = i === experiences.length - 1;
          
          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="flex items-start group"
            >
              {/* 1. GAMBAR MEMORI (Cinematic, 16:9) */}
              <div className="w-24 md:w-40 shrink-0 pt-1">
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

              {/* 2. DIVIDER (TITIK & GARIS VERTIKAL) */}
              <div className="flex flex-col items-center mx-5 md:mx-10 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ddd] group-hover:bg-[#111] transition-colors duration-500 mt-2.5" />
                <div className={`w-[0.5px] bg-[#ebebeb] flex-1 min-h-[70px] md:min-h-[90px] ${isLast ? 'opacity-0' : 'opacity-100'}`} />
              </div>

              {/* 3. KONTEN (Kanan) */}
              <div className="flex-1 pt-0 pb-10">
                <div className="space-y-2.5">
                  {/* Header: [Tahun] Judul (Mono, Bold Year) */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-[#111] group-hover:text-black transition-colors duration-500 font-bold">
                      [{exp.year}]
                    </span>
                    <h4 className="font-mono text-[11px] md:text-[12px] tracking-tight text-[#111] group-hover:opacity-70 transition-opacity">
                      {exp.title}
                    </h4>
                  </div>

                  {/* Body: Deskripsi */}
                  <div className="max-w-xl">
                    <p className="text-[11px] md:text-[12px] text-[#777] leading-relaxed font-sans">
                      {exp.description}
                    </p>
                  </div>

                  {/* Footer: Company */}
                  <div className="">
                    <span className="text-[8px] tracking-[0.4em] text-[#bbb] group-hover:text-[#999] transition-colors font-mono italic">
                      at {exp.company}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
