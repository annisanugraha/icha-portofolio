'use client';

import React from 'react';
import { motion } from 'framer-motion';

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

export const CertificateGrid = ({ certificates }: CertificateGridProps) => {
  if (certificates.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
      {certificates.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: (i % 2) * 0.1 }}
          className="group space-y-4"
        >
          {/* Image */}
          <div className="img-container aspect-[3/2] rounded-sm overflow-hidden">
            <img
              src={item.imageUrl || 'https://placehold.co/900x600/f5f5f5/999999?text=—'}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Meta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="label">{item.category}</span>
              <span className="label text-[#ddd]">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="text-base font-serif group-hover:opacity-50 transition-opacity duration-500">
              {item.title}
            </h3>
            <p className="text-[11px] text-[#999] leading-relaxed line-clamp-2 italic">
              {item.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
