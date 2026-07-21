'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';

interface ProjectsPageProps {
  projects: Project[];
}

type FilterCategory = 'all' | 'Real Work' | 'Case Study' | 'Playground';
type RoleFilter = 'all' | 'Frontend' | 'UI/UX' | 'Full Stack';

interface FilterOption {
  id: FilterCategory;
  label: string;
}

const filterOptions: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'Real Work', label: 'Real Work & Collab' },
  { id: 'Case Study', label: 'Case Studies' },
  { id: 'Playground', label: 'Playground' },
];

const roleOptions: RoleFilter[] = ['Frontend', 'UI/UX', 'Full Stack'];

function ProjectSpotlightCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group space-y-4 cursor-pointer relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/work/${project.slug}`} data-cursor="Full Case Study ⮞" className="block space-y-4">
        <div className="img-container aspect-[16/10] rounded-sm overflow-hidden bg-[#fafafa] relative">
          <Image
            src={project.imageUrl || 'https://placehold.co/900x600/f5f5f5/999999?text=—'}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: isHovered
                ? `radial-gradient(circle 180px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255,255,255,0.22), transparent 80%)`
                : 'none',
            }}
          />
          <div className="absolute inset-0 border border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="label">{project.category}</span>
              {project.role && (
                <span className="text-[8px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 bg-[#f5f5f5] border border-[#e5e5e5] text-[#aaa] rounded-full">
                  {project.role}
                </span>
              )}
            </div>
            <span className="label text-[#ddd]">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <p className="text-lg md:text-xl font-serif text-[#111] group-hover:opacity-50 transition-opacity duration-500 leading-snug">
            {project.title}
          </p>
          <p className="text-[11px] text-[#999] leading-relaxed line-clamp-2">{project.shortDescription}</p>
        </div>
        <div className="pt-2 flex flex-wrap gap-1.5">
          {project.skills && project.skills.length > 0 ? (
            project.skills.map((skill) => (
              <span key={skill.id} className="text-[8px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] text-[#999] rounded-sm">
                {skill.name}
              </span>
            ))
          ) : project.techStack && project.techStack.length > 0 ? (
            project.techStack.map((tech: string, i: number) => (
              <span key={i} className="text-[8px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 bg-[#fafafa] border border-[#ebebeb] text-[#999] rounded-sm">
                {tech}
              </span>
            ))
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectsPage({ projects }: ProjectsPageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [activeRole, setActiveRole] = useState<RoleFilter>('all');

  const filtered = projects
    .filter(p => activeFilter === 'all' || p.category === activeFilter)
    .filter(p => activeRole === 'all' || p.role === activeRole);

  const getCount = (cat: FilterCategory) => {
    if (cat === 'all') return projects.length;
    return projects.filter(p => p.category === cat).length;
  };

  const hasRoleProjects = roleOptions.some(r => projects.some(p => p.role === r));

  return (
    <main className="min-h-screen bg-white">
      <div className="main-container pt-16 md:pt-20 space-y-8 pb-24 md:pb-32">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="space-y-2">
          <span className="label">Portfolio</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#111] tracking-tight">Works.</h1>
          <p className="text-xs md:text-sm text-[#999] leading-relaxed pt-1">
            A curated index of digital platforms, user interfaces, and technical systems engineered with precision and purpose.
          </p>
        </motion.div>
        <section className="space-y-10">
          <div className="space-y-4 border-b border-[#ebebeb] pb-6">
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {filterOptions.map((option) => {
                const isActive = activeFilter === option.id;
                const count = getCount(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveFilter(option.id)}
                    className={`group flex items-center gap-2 cursor-pointer transition-all duration-300 py-1 ${isActive ? 'text-[#111]' : 'text-[#bbb] hover:text-[#111]'}`}
                  >
                    <span className={`label !tracking-[0.25em] transition-colors ${isActive ? '!text-[#111] font-semibold underline underline-offset-8 decoration-1' : 'group-hover:!text-[#111]'}`}>
                      {option.label}
                    </span>
                    <span className={`text-[10px] font-mono transition-colors ${isActive ? 'text-[#111]' : 'text-[#ddd] group-hover:text-[#999]'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
            {hasRoleProjects && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[9px] text-[#ccc] font-mono tracking-[0.3em] uppercase shrink-0">My role</span>
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(activeRole === role ? 'all' : role)}
                    className={`text-[9px] font-mono tracking-[0.15em] uppercase px-3 py-1 rounded-full border transition-all duration-200 cursor-pointer ${
                      activeRole === role ? 'bg-[#111] text-white border-[#111]' : 'border-[#e5e5e5] text-[#aaa] hover:border-[#aaa] hover:text-[#111]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
                {activeRole !== 'all' && (
                  <button onClick={() => setActiveRole('all')} className="text-[9px] font-mono text-[#ccc] hover:text-[#999] transition-colors cursor-pointer ml-1">
                    ✕ clear
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, index) => (
                <ProjectSpotlightCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </div>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="py-16 flex flex-col items-start gap-5"
            >
              <span className="text-[100px] md:text-[140px] font-serif text-[#f0f0f0] leading-none select-none">—</span>
              <div className="space-y-1">
                <p className="text-sm font-serif text-[#111]">Nothing here yet.</p>
                <p className="text-[11px] text-[#aaa] font-mono">
                  {activeRole !== 'all' && activeFilter !== 'all'
                    ? `No "${activeRole}" projects in "${activeFilter}" category.`
                    : activeRole !== 'all'
                    ? `No "${activeRole}" projects found.`
                    : 'This category is still being filled.'}
                </p>
              </div>
              <button
                onClick={() => { setActiveFilter('all'); setActiveRole('all'); }}
                className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#999] hover:text-[#111] transition-colors underline underline-offset-4 cursor-pointer"
              >
                See all projects →
              </button>
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}
