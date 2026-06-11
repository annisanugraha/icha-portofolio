'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

// ── Main Component ──
interface WorkAndSkillsProps {
  projects: any[];
}

export function WorkAndSkills({ projects }: WorkAndSkillsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Calculate exactly how far we need to scroll the list
  const updateScrollDistance = () => {
    if (containerRef.current) {
      const contentHeight = containerRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      // We want to scroll from the starting top-padding 
      // until the bottom of the content (including its spacer) reaches the bottom of the screen.
      // A more generous distance ensures the last item doesn't feel "cut off".
      setScrollDistance(Math.max(0, contentHeight - viewportHeight + (viewportHeight * 0.1)));
    }
  };

  useEffect(() => {
    updateScrollDistance();
    window.addEventListener('resize', updateScrollDistance);
    // Extra check after a small delay to catch layout shifts
    const timer = setTimeout(updateScrollDistance, 500);
    return () => {
      window.removeEventListener('resize', updateScrollDistance);
      clearTimeout(timer);
    };
  }, [projects]);

  const y = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative"
      style={{
        // Give it more "weight" - 100vh per project ensures slow, high-quality scrolling
        // and guarantees the sticky container doesn't release too early.
        height: `${100 + projects.length * 80}vh`,
      }}
    >
      {/* ── Sticky Container ── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-white">
        {/* Layer 1: Background Tech Stack Cards */}
        <TechStackBackground />

        {/* Layer 2: Left Text "WHAT I WORK WITH." */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full md:w-1/2 px-8 md:px-12 z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-2 pointer-events-auto"
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
          <div className="mt-8 flex items-center gap-4 pointer-events-auto">
            <div className="w-12 h-px bg-gradient-to-r from-black to-transparent" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#999] uppercase">
              Selected Projects
            </span>
          </div>
        </div>

        {/* Layer 3: Right Side - Vertical Sliding List with Large Cards */}
        <div className="absolute right-0 top-0 w-full md:w-1/2 h-screen overflow-hidden z-20">
          <motion.div
            ref={containerRef}
            style={{ y }}
            className="px-6 md:px-12 py-[30vh] space-y-20"
          >
            {projects.map((project: any, i: number) => (
              <motion.div
                key={project.id}
                className="group"
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="block p-6 bg-white rounded-3xl border border-[#ebebeb] hover:border-[#111] hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="img-container aspect-video rounded-2xl overflow-hidden mb-8">
                    <img
                      src={project.imageUrl || 'https://placehold.co/800x450/f5f5f5/999999?text=—'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="label text-[#bbb]">
                        {String(i + 1).padStart(2, '0')}
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
                    
                    <div className="pt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em]">Full Case Study</span>
                      <div className="w-12 h-px bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {/* Generous bottom spacer ensures the last card stays in view comfortably */}
            <div className="h-[40vh]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

