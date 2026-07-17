// ── Types matching Prisma schema ──

export interface ProjectLink {
  id: string;
  label: string;
  url: string;
  projectId: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  contextWhy?: string | null;
  scopeWhat?: string | null;
  outcomeHow?: string | null;
  imageUrl?: string | null;
  galleryImages: string[];
  techStack: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  links: ProjectLink[];
  skills?: Skill[];
  year: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  logoText: string;
  logoImage?: string | null;
  favicon?: string | null;
  siteTitle: string;
  siteDescription: string;
  heroRole: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutQuote: string;
  aboutBio1: string;
  aboutBio2: string;
  aboutImage?: string | null;
  linkedinUrl: string;
  githubUrl: string;
  emailAddress: string;
  emailSubject: string;
  resumeUrl?: string | null;
  statsItem1?: string | null;
  statsItem2?: string | null;
  statsItem3?: string | null;
  statsItem4?: string | null;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  imageUrl?: string | null;
  order: number;
  createdAt: Date;
}

export interface Certificate {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  highlighted: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  title: string;
  event: string;
  year: string;
  imageUrl?: string | null;
  description?: string | null;
  highlighted: boolean;
  order: number;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string; // "Frontend" | "Backend" | "Design" | "Tools"
  logoUrl?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
