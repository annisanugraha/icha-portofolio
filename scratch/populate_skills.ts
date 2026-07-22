import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
let finalUrl = connectionString || '';
finalUrl = finalUrl.replace(':ase.com:5432', ':5432');
if (!finalUrl.includes('sslmode=')) {
  finalUrl += finalUrl.includes('?') ? '&sslmode=require' : '?sslmode=require';
}
if (!finalUrl.includes('uselibpqcompat=')) {
  finalUrl += finalUrl.includes('?') ? '&uselibpqcompat=true' : '?uselibpqcompat=true';
}

const pool = new pg.Pool({ connectionString: finalUrl });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

const skillsData = [
  // Frontend
  { name: 'Next.js', category: 'Frontend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', order: 1 },
  { name: 'React', category: 'Frontend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', order: 2 },
  { name: 'TypeScript', category: 'Frontend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', order: 3 },
  { name: 'Tailwind CSS', category: 'Frontend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', order: 4 },
  { name: 'Framer Motion', category: 'Frontend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg', order: 5 },
  { name: 'Vue.js', category: 'Frontend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', order: 6 },

  // Backend
  { name: 'Node.js', category: 'Backend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', order: 1 },
  { name: 'PostgreSQL', category: 'Backend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', order: 2 },
  { name: 'Prisma ORM', category: 'Backend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', order: 3 },
  { name: 'Express.js', category: 'Backend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', order: 4 },
  { name: 'Supabase', category: 'Backend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', order: 5 },
  { name: 'MongoDB', category: 'Backend', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', order: 6 },

  // Design
  { name: 'Figma', category: 'Design', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', order: 1 },
  { name: 'Photoshop', category: 'Design', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg', order: 2 },
  { name: 'Illustrator', category: 'Design', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-original.svg', order: 3 },
  { name: 'Canva', category: 'Design', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg', order: 4 },

  // Tools
  { name: 'Git', category: 'Tools', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', order: 1 },
  { name: 'GitHub', category: 'Tools', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', order: 2 },
  { name: 'Docker', category: 'Tools', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', order: 3 },
  { name: 'Postman', category: 'Tools', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg', order: 4 },
  { name: 'VS Code', category: 'Tools', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', order: 5 }
];

async function populate() {
  console.log('Populating skills across all categories...');
  for (const skill of skillsData) {
    const existing = await prisma.skill.findUnique({
      where: { name: skill.name }
    });
    if (existing) {
      await prisma.skill.update({
        where: { id: existing.id },
        data: {
          category: skill.category,
          logoUrl: skill.logoUrl,
          order: skill.order
        }
      });
    } else {
      await prisma.skill.create({
        data: skill
      });
    }
  }
  console.log('All skills populated successfully across Frontend, Backend, Design, and Tools!');
}

populate()
  .catch((e) => {
    console.error('Populate error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
