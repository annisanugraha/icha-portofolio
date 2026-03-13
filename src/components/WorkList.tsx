'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  imageUrl?: string | null;
}

export const WorkList = ({ projects }: { projects: ProjectData[] }) => {
  return (
    <div className="main-container pb-32">

      {/* ── Grid Header ── */}
      <div className="flex items-center justify-between mb-10 pb-5 border-b border-[#ebebeb]">
        <span className="label">Selected Work</span>
        <span className="label">{String(projects.length).padStart(2, '0')}</span>
      </div>

      {/* ── Project Grid — 2 col ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, delay: (i % 2) * 0.12 }}
          >
            <Link href={`/work/${project.slug}`} className="group block space-y-4">

              {/* Image */}
              <div className="img-container aspect-[4/3] rounded-sm overflow-hidden">
                <img
                  src={project.imageUrl || 'https://placehold.co/800x600/f5f5f5/999999?text=—'}
                  alt={project.title}
                />
              </div>

              {/* Meta */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="label text-[#bbb]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="label text-[#bbb]">{project.category}</span>
                </div>
                <h3 className="text-base font-serif group-hover:opacity-50 transition-opacity duration-500">
                  {project.title}
                </h3>
                <p className="text-[11px] text-[#999] leading-relaxed line-clamp-2">
                  {project.shortDescription}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};