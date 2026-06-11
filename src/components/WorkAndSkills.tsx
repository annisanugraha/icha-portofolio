'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// ── Skill Cards for Background ──
const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      { name: 'Next.js', icon: '▲' },
      { name: 'React', icon: '⚛' },
      { name: 'TypeScript', icon: 'TS' },
      { name: 'Tailwind CSS', icon: '◈' },
      { name: 'Framer Motion', icon: '◉' },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: '◆' },
      { name: 'Prisma', icon: '◇' },
      { name: 'PostgreSQL', icon: '▣' },
      { name: 'Supabase', icon: '◐' },
      { name: 'REST API', icon: '⬡' },
    ],
  },
  {
    title: 'Design',
    skills: [
      { name: 'Figma', icon: '✦' },
      { name: 'Blender', icon: '◆' },
      { name: 'UI/UX', icon: '◈' },
      { name: 'Git', icon: '⬡' },
      { name: 'Vercel', icon: '▲' },
    ],
  },
];

function MarqueeRow({ skills, reverse = false }: { skills: typeof skillCategories[0]['skills']; reverse?: boolean }) {
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className={`flex gap-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ width: 'max-content' }}
      >
        {duplicatedSkills.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="skill-card w-36 h-28 bg-gradient-to-br from-[#fafafa] to-white border border-[#e8e8e8] flex flex-col items-center justify-center gap-3 relative overflow-hidden group shrink-0 hover:border-[#111] transition-all duration-300"
          >
            {/* Floating dots */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-black opacity-20 rounded-full animate-float" />
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-black opacity-20 rounded-full animate-float-delayed" />
            </div>

            {/* Icon */}
            <span className="text-2xl text-[#111] opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              {skill.icon}
            </span>

            {/* Skill name */}
            <span className="text-[10px] font-mono tracking-wider text-[#111] group-hover:font-medium transition-all">
              {skill.name}
            </span>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-black group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TechStackBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay to fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      {/* Animated Marquee Rows */}
      <div className="w-full space-y-6 md:space-y-8 py-16 md:py-24">
        {skillCategories.map((category, catIndex) => (
          <div key={category.title}>
            <span className="label text-[9px] tracking-[0.4em] text-[#bbb] block mb-3 px-8 md:px-12 opacity-60">
              {category.title}
            </span>
            <MarqueeRow
              skills={category.skills}
              reverse={catIndex % 2 === 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──
interface WorkAndSkillsProps {
  projects: any[];
}

export function WorkAndSkills({ projects }: WorkAndSkillsProps) {
  const [isReleased, setIsReleased] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect when work list is done scrolling
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsReleased(true);
        }
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="work"
      className="relative"
      style={{
        minHeight: '100vh',
      }}
    >
      {/* ── Sticky Layer: Background + Left Text ── */}
      <div
        className={`
          sticky top-0 w-full h-screen overflow-hidden
          ${isReleased ? 'relative' : ''}
        `}
      >
        {/* Layer 1: Background Tech Stack Cards */}
        <TechStackBackground />

        {/* Layer 2: Left Text "WHAT I WORK WITH." */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full md:w-1/2 px-8 md:px-12 z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-black leading-[0.9] tracking-tight">
              WHAT I
            </h2>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-black leading-[0.9] tracking-tight">
              WORK
            </h2>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-black leading-[0.9] tracking-tight">
              WITH.
            </h2>
          </motion.div>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-black to-transparent" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#999] uppercase">
              Always moving
            </span>
          </div>
        </div>

        {/* Layer 3: Right Side - Selected Work List */}
        <div className="absolute right-0 top-0 w-full md:w-1/2 h-screen overflow-y-auto overflow-x-hidden z-20">
          <div className="px-6 md:px-8 py-24">
            <div className="space-y-0">
              {projects.map((project: any, i: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, delay: (i % 2) * 0.12 }}
                  className="group mb-4 last:mb-0"
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#ebebeb] hover:border-[#111] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="label text-[#bbb]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="label text-[#bbb]">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-serif text-black group-hover:opacity-50 transition-opacity duration-500">
                        {project.title}
                      </h3>
                      <p className="text-[11px] text-[#999] leading-relaxed line-clamp-2 mt-1">
                        {project.shortDescription}
                      </p>
                    </div>
                    <div className="img-container w-24 h-24 rounded-lg overflow-hidden shrink-0 hidden md:block">
                      <img
                        src={project.imageUrl || 'https://placehold.co/200x200/f5f5f5/999999?text=—'}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Sentinel: detect when work list is done scrolling */}
            <div ref={sentinelRef} className="h-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
