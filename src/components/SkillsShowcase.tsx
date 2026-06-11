'use client';

import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      { name: 'Next.js', level: 90 },
      { name: 'React', level: 85 },
      { name: 'TypeScript', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Framer Motion', level: 80 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 82 },
      { name: 'Prisma', level: 85 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'Supabase', level: 78 },
      { name: 'REST API', level: 85 },
    ],
  },
  {
    title: 'Tools & Design',
    skills: [
      { name: 'Figma', level: 90 },
      { name: 'Blender', level: 65 },
      { name: 'Git', level: 85 },
      { name: 'Vercel', level: 88 },
      { name: 'UI/UX Design', level: 88 },
    ],
  },
];

export function SkillsShowcase() {
  return (
    <div className="space-y-12">
      {skillCategories.map((category, catIndex) => (
        <div key={category.title} className="space-y-4">
          {/* Category Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: catIndex * 0.1 }}
          >
            <span className="label text-[10px] tracking-[0.4em]">{category.title}</span>
            <div className="h-px bg-[#ebebeb] mt-2" />
          </motion.div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {category.skills.map((skill, skillIndex) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 + skillIndex * 0.05 }}
                className="group relative"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-[#fafafa] border border-[#ebebeb] hover:border-[#111] transition-all duration-300 hover:-translate-y-0.5 cursor-default">
                  <span className="text-xs font-mono text-[#111] group-hover:font-medium transition-all">
                    {skill.name}
                  </span>
                  <span className="text-[10px] text-[#bbb] font-mono group-hover:text-[#999] transition-colors">
                    {skill.level}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-[#111] transition-all duration-500 group-hover:opacity-100 opacity-0"
                  style={{ width: `${skill.level}%` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}