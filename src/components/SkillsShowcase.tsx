'use client';

import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: 'Tools',
    skills: [
      { name: 'GitHub',  icon: '⊕' },
      { name: 'Docker',  icon: '⬡' },
      { name: 'VSCode',  icon: '▣' },
      { name: 'Postman', icon: '◆' },
      { name: 'Vercel',  icon: '▲' },
      { name: 'Prisma',  icon: '◇' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'Next.js',       icon: '▲' },
      { name: 'React',         icon: '⚛' },
      { name: 'TypeScript',    icon: 'TS' },
      { name: 'Tailwind CSS',  icon: '◈' },
      { name: 'Framer Motion', icon: '◉' },
      { name: 'HTML / CSS',    icon: '◇' },
    ],
  },
  {
    title: 'UI/UX',
    skills: [
      { name: 'Figma',       icon: '✦' },
      { name: 'CorelDraw',   icon: '◈' },
      { name: 'Adobe XD',    icon: '◉' },
      { name: 'Illustrator', icon: '◆' },
      { name: 'Photoshop',   icon: '▣' },
      { name: 'Blender',     icon: '⬡' },
    ],
  },
];

function MarqueeRow({ skills, reverse = false }: { skills: typeof skillCategories[0]['skills']; reverse?: boolean }) {
  const duplicatedSkills = [...skills, ...skills];

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className={`flex gap-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ width: 'max-content' }}
      >
        {duplicatedSkills.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="w-36 h-28 bg-[#fafafa] border border-[#e8e8e8] flex flex-col items-center justify-center gap-2 relative overflow-hidden group shrink-0 hover:border-[#111] hover:bg-white transition-all duration-300"
          >
            {/* Icon — muted by default, crisp on hover */}
            <span className="text-[26px] leading-none text-[#ccc] group-hover:text-[#111] transition-colors duration-300">
              {skill.icon}
            </span>

            {/* Name — DM Mono, tight tracking, all caps */}
            <span className="text-[8px] font-mono tracking-[0.28em] uppercase text-[#bbb] group-hover:text-[#111] transition-colors duration-300">
              {skill.name}
            </span>

            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-0 h-px w-0 bg-[#111] group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-start">
      {/* Left: Big Text */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="md:col-span-4 sticky top-24"
      >
        <div className="space-y-2">
          <h2 className="text-5xl md:text-7xl font-serif text-black leading-[0.9] tracking-tight">
            WHAT I
          </h2>
          <h2 className="text-5xl md:text-7xl font-serif text-black leading-[0.9] tracking-tight">
            WORK
          </h2>
          <h2 className="text-5xl md:text-7xl font-serif text-black leading-[0.9] tracking-tight">
            WITH.
          </h2>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <div className="w-12 h-px bg-gradient-to-r from-black to-transparent" />
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#999] uppercase">
            Always moving
          </span>
        </div>
      </motion.div>

      {/* Right: Animated Marquee Rows */}
      <div className="md:col-span-8 space-y-6 md:space-y-8 relative">
        {skillCategories.map((category, catIndex) => (
          <div key={category.title}>
            {/* Category label */}
            <span className="label text-[9px] tracking-[0.4em] text-[#bbb] block mb-3">
              {category.title}
            </span>

            {/* Marquee row - alternating directions */}
            <MarqueeRow
              skills={category.skills}
              reverse={catIndex % 2 === 1}
            />
          </div>
        ))}

        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}