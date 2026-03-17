'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageSectionHeaderProps {
  title: string;
  number?: string | number;
}

export const PageSectionHeader = ({ title, number }: PageSectionHeaderProps) => {
  return (
    <div className="w-full mb-12">
      <div className="flex items-end justify-between mb-5">
        <span className="label text-[#111]">{title}</span>
        {number !== undefined && (
          <span className="label text-[#ccc]">
            {typeof number === 'number' ? String(number).padStart(2, '0') : number}
          </span>
        )}
      </div>
      
      {/* Animated Line */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
        className="h-[1px] bg-[#ebebeb] w-full"
      />
    </div>
  );
};
