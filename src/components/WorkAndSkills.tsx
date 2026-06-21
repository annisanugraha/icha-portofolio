'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient overlay to fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      {/* Animated Marquee Rows */}
      <div className="w-full space-y-6 md:space-y-8 py-16 md:py-12">
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

// ── Project Card — Reusable for both mobile and desktop ──
function ProjectCard({ project, index }: { project: any; index: number }) {
  return (
    <Link
      href={`/work/${project.slug}`}
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
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.techStack.map((tech: string, i: number) => (
              <span key={i} className="text-[8px] tracking-[0.2em] uppercase px-2 py-1 bg-[#fafafa] border border-[#ebebeb] text-[#999] rounded-sm">
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <div className="pt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em]">Full Case Study</span>
          <div className="w-12 h-px bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100" />
        </div>
      </div>
    </Link>
  );
}

// ── Main Component ──
interface WorkAndSkillsProps {
  projects: any[];
}

export function WorkAndSkills({ projects }: WorkAndSkillsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [sectionHeight, setSectionHeight] = useState('200vh');
  const [isMobile, setIsMobile] = useState(false);

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
            <div className="mt-4 flex items-center gap-4">
              <div className="w-12 h-px bg-gradient-to-r from-black to-transparent" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#999] uppercase">
                Selected Projects
              </span>
            </div>
          </motion.div>

          {/* Skills marquee — compact for mobile */}
          <div className="mb-8 overflow-hidden -mx-6">
            {skillCategories.slice(0, 2).map((category, catIndex) => (
              <div key={category.title} className="mb-3">
                <span className="label text-[9px] tracking-[0.4em] text-[#bbb] block mb-2 px-6 opacity-60">
                  {category.title}
                </span>
                <MarqueeRow
                  skills={category.skills}
                  reverse={catIndex % 2 === 1}
                />
              </div>
            ))}
          </div>

          {/* Project Cards — vertical list */}
          <div className="space-y-6">
            {projects.map((project: any, i: number) => (
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
        <TechStackBackground />

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
                className="absolute -inset-6 bg-white/90 backdrop-blur-sm pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)'
                }}
              />
              <div className="relative z-10">
                <h2 className="text-7xl lg:text-8xl font-serif text-black leading-[0.9] tracking-tight">
                  LET&apos;S
                </h2>
                <h2 className="text-7xl lg:text-8xl font-serif text-black leading-[0.9] tracking-tight">
                  TAKE A LOOK
                </h2>
              </div>
            </div>
          </motion.div>
          <div className="mt-8 flex items-center gap-4 pointer-events-auto">
            <div className="w-12 h-px bg-gradient-to-r from-black to-transparent" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#999] uppercase">
              Selected Projects
            </span>
          </div>
        </div>

        {/* Layer 3: Right Side - Vertical Sliding List */}
        <div className="absolute right-0 top-0 w-1/2 h-screen overflow-hidden z-20">
          <motion.div
            ref={containerRef}
            style={{ y }}
            className="px-12 pt-[30vh] pb-[10vh] space-y-8"
          >
            {projects.map((project: any, i: number) => (
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

