'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types';
import { getSkillsByCategory } from '@/actions/skill';

function MarqueeRow({ skills, reverse = false }: { skills: any[]; reverse?: boolean }) {
  if (!skills || skills.length === 0) return null;
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills, ...skills, ...skills].slice(0, 24);

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className={`flex gap-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ width: 'max-content' }}
      >
        {duplicatedSkills.map((skill, i) => (
          <div
            key={`${skill.id || skill.name}-${i}`}
            className="skill-card w-36 h-28 bg-gradient-to-br from-[#fafafa] to-white border border-[#e8e8e8] flex flex-col items-center justify-center gap-3 relative overflow-hidden group shrink-0 hover:border-[#111] transition-all duration-300 p-3"
          >
            {/* Floating dots */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-black opacity-20 rounded-full animate-float" />
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-black opacity-20 rounded-full animate-float-delayed" />
            </div>

            {/* Logo or Icon */}
            <div className="w-10 h-10 flex items-center justify-center shrink-0 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              {skill.logoUrl ? (
                <Image src={skill.logoUrl} width={32} height={32} alt={skill.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-2xl text-[#111] font-mono">✦</span>
              )}
            </div>

            {/* Skill name */}
            <span className="text-[10px] font-mono tracking-wider text-[#111] group-hover:font-medium transition-all text-center truncate w-full px-1">
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

function TechStackBackground({ categories }: { categories: Record<string, any[]> }) {
  const sections = [
    { dbKey: 'Frontend', displayTitle: 'FRONTEND ENGINEERING' },
    { dbKey: 'Design',   displayTitle: 'UI/UX & CREATIVE SUITE' },
    { dbKey: 'Tools',    displayTitle: 'DEV TOOLS & WORKFLOW' },
  ].filter(section => (categories[section.dbKey]?.length || 0) > 0);

  if (sections.length === 0) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-full space-y-6 md:space-y-8 py-16 md:py-12 opacity-20">
          <div className="h-28 bg-[#fafafa]/50 w-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient overlay to fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      {/* Animated Marquee Rows */}
      <div className="w-full space-y-6 md:space-y-8 py-16 md:py-12">
        {sections.map((section, catIndex) => (
          <div key={section.dbKey}>
            <span className="label text-[9px] tracking-[0.4em] text-[#bbb] block mb-3 px-8 md:px-12 opacity-60">
              {section.displayTitle}
            </span>
            <MarqueeRow
              skills={categories[section.dbKey] || []}
              reverse={catIndex % 2 === 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Project Card — Reusable for both mobile and desktop ──
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="Full Case Study ⮞"
      className="block p-4 bg-white rounded-md border border-[#ebebeb] hover:border-[#111] hover:shadow-2xl transition-all duration-500 group"
    >
      <div className="img-container aspect-video rounded-sm overflow-hidden mb-2 relative">
        <Image
          src={project.imageUrl || 'https://placehold.co/800x450/f5f5f5/999999?text=—'}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-1000"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="label text-[#bbb]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="label text-[#bbb] px-3 py-1 border border-[#eee] rounded-full text-[8px]">
            {project.category}
          </span>
        </div>
        <h3 className="text-2xl md:text-4xl font-serif text-black group-hover:text-[#666] transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-[14px] text-[#888] leading-relaxed line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Tech Stack Badges */}
        {(() => {
          const displaySkills = project.skills && project.skills.length > 0
            ? project.skills
            : (project.techStack || []).map((name: string) => ({ name, logoUrl: null }));

          if (displaySkills.length === 0) return null;

          return (
            <div className="flex flex-wrap gap-2 pt-2">
              {displaySkills.map((skill: any, i: number) => (
                <span key={i} className="text-[10px] font-sans font-medium tracking-wide px-2 py-1 bg-[#fafafa] border border-[#ebebeb] text-[#666] rounded flex items-center gap-1.5">
                  {skill.logoUrl && (
                    <Image src={skill.logoUrl} width={12} height={12} alt={skill.name} className="w-3 h-3 object-contain" />
                  )}
                  <span>{skill.name}</span>
                </span>
              ))}
            </div>
          );
        })()}
      </div>
    </Link>
  );
}

// ── Main Component ──
interface WorkAndSkillsProps {
  projects: Project[];
}

export function WorkAndSkills({ projects }: WorkAndSkillsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [sectionHeight, setSectionHeight] = useState('200vh');
  const [isMobile, setIsMobile] = useState(false);
  const [skillCategories, setSkillCategories] = useState<Record<string, any[]>>({});

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    getSkillsByCategory().then(data => {
      setSkillCategories(data);
    }).catch(err => console.error('Fetch skills error:', err));
  }, []);

  const updateMeasurements = () => {
    if (isMobile || !containerRef.current || !lastCardRef.current) return;
    
    const viewportHeight = window.innerHeight;
    const lastCardTop = lastCardRef.current.offsetTop;
    const lastCardHeight = lastCardRef.current.offsetHeight;
    const lastCardMiddle = lastCardTop + (lastCardHeight / 2);
    const targetPos = viewportHeight / 2;
    const distance = Math.max(0, lastCardMiddle - targetPos);
    setScrollDistance(distance);
    setSectionHeight(`${distance + viewportHeight}px`);
  };

  useEffect(() => {
    if (isMobile) return;
    
    updateMeasurements();
    const observers = [100, 500, 1000, 2000].map(delay => 
      setTimeout(updateMeasurements, delay)
    );

    window.addEventListener('resize', updateMeasurements);
    return () => {
      window.removeEventListener('resize', updateMeasurements);
      observers.forEach(clearTimeout);
    };
  }, [projects, isMobile]);

  const y = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  // ── MOBILE LAYOUT: Clean vertical flow ──
  if (isMobile) {
    return (
      <section className="py-16 bg-white">
        <div className="px-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-serif text-black leading-[0.9] tracking-tight">
              LET&apos;S
            </h2>
            <h2 className="text-4xl font-serif text-black leading-[0.9] tracking-tight">
              TAKE A LOOK
            </h2>
            <div className="mt-5 pointer-events-auto relative z-30 inline-block">
              {/* Highlight mask identical to heading */}
              <div 
                className="absolute -inset-4 bg-white/90 backdrop-blur-sm pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)'
                }}
              />
              <Link
                href="/work"
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-[#111] rounded-full text-xs font-mono tracking-[0.3em] uppercase text-white font-semibold hover:-translate-y-1 hover:shadow-xl hover:bg-black transition-all duration-300 ease-out z-10"
              >
                <span>CLICK HERE TO SEE ALL WORKS</span>
                <span className="inline-block animate-arrow-bounce">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Skills marquee — compact for mobile */}
          <div className="mb-8 overflow-hidden -mx-6">
            {[
              { dbKey: 'Frontend', displayTitle: 'FRONTEND ENGINEERING' },
              { dbKey: 'Design',   displayTitle: 'UI/UX & CREATIVE SUITE' },
              { dbKey: 'Tools',    displayTitle: 'DEV TOOLS & WORKFLOW' },
            ].map((section, catIndex) => {
              const skills = skillCategories[section.dbKey] || [];
              if (skills.length === 0) return null;
              return (
                <div key={section.dbKey} className="mb-3">
                  <span className="label text-[9px] tracking-[0.4em] text-[#bbb] block mb-2 px-6 opacity-60">
                    {section.displayTitle}
                  </span>
                  <MarqueeRow
                    skills={skills}
                    reverse={catIndex % 2 === 1}
                  />
                </div>
              );
            })}
          </div>

          {/* Project Cards — vertical list */}
          <div className="space-y-6">
            {projects.map((project, i: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-10%' }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── DESKTOP LAYOUT: Sticky scroll with split view ──
  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-white">
        {/* Layer 1: Background Tech Stack Cards */}
        <TechStackBackground categories={skillCategories} />

        {/* Layer 2: Left Text */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 px-12 z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="space-y-2 pointer-events-auto"
          >
            <div className="relative inline-block">
              <div 
                className="absolute -inset-10 bg-white/95 backdrop-blur-md pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                }}
              />
              <div className="relative z-10">
                <h2 className="text-7xl lg:text-8xl font-serif text-black leading-[0.9] tracking-tight">
                  LET&apos;S
                </h2>
                <h2 className="text-7xl lg:text-8xl font-serif text-black leading-[0.9] tracking-tight">
                  TAKE A LOOK
                </h2>
                <div className="mt-8 pointer-events-auto relative inline-block">
                  {/* Highlight mask identical to heading */}
                  <div 
                    className="absolute -inset-4 bg-white/90 backdrop-blur-sm pointer-events-none"
                    style={{
                      maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                      WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)'
                    }}
                  />
                  <Link
                    href="/work"
                    className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-[#111] rounded-full text-xs font-mono tracking-[0.3em] uppercase text-white font-semibold hover:-translate-y-1 hover:shadow-xl hover:bg-black transition-all duration-300 ease-out z-10"
                  >
                    <span>CLICK HERE TO SEE ALL WORKS</span>
                    <span className="inline-block animate-arrow-bounce">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Layer 3: Right Side - Vertical Sliding List */}
        <div className="absolute right-0 top-0 w-1/2 h-screen overflow-hidden z-20">
          <motion.div
            ref={containerRef}
            style={{ y }}
            className="px-12 pt-[30vh] pb-[10vh] space-y-8"
          >
            {projects.map((project, i: number) => (
              <motion.div
                key={project.id}
                ref={i === projects.length - 1 ? lastCardRef : null}
                className="group"
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

