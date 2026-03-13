'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Journey {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
}

const experiences: Journey[] = [
  {
    id: "1",
    year: "2023",
    title: "Finalis GEMASTIK XVI",
    company: "Puspresnas",
    description: "Berhasil masuk ke babak final nasional kategori pengembangan perangkat lunak."
  },
  {
    id: "2",
    year: "2024",
    title: "Anggota Bengkel Koding",
    company: "Udinus",
    description: "Aktif dalam komunitas pengembangan kode dan berkontribusi dalam project open source."
  }
];

export const Timeline = () => {
  return (
    <div>
      <div className="mb-12">
        <span className="label">Chronology</span>
      </div>

      <div className="relative flex gap-0">

        {/* Kolom kiri: tahun + dot + garis */}
        <div className="relative flex flex-col" style={{ width: '80px', marginRight: '2rem' }}>
          {experiences.map((exp, i) => {
            const isLast = i === experiences.length - 1;
            return (
              <div key={exp.id} className="relative flex flex-col items-end" style={{ paddingBottom: isLast ? 0 : '3rem' }}>
                {/* Tahun */}
                <span className="label text-[#bbb] mb-3 self-start">{exp.year}</span>
                {/* Dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#111] self-end mr-[-1px]" />
                {/* Garis ke entry berikutnya */}
                {!isLast && (
                  <div className="absolute right-0 top-[calc(1.5rem+6px)] bottom-0 w-px bg-[#e0e0e0]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Kolom kanan: konten */}
        <div className="flex-1 flex flex-col">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="space-y-1.5"
              style={{ paddingBottom: i === experiences.length - 1 ? 0 : '3rem' }}
            >
              <h4 className="text-base font-serif tracking-tight">{exp.title}</h4>
              <span className="label text-[#bbb] block">{exp.company}</span>
              <p className="text-xs text-[#999] leading-relaxed pt-1">{exp.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};