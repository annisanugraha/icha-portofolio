'use client';

import { motion } from 'framer-motion';

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