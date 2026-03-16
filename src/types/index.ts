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
  contextWhy?: string;
  scopeWhat?: string;
  outcomeHow?: string;
  imageUrl?: string;
  galleryImages: string[];
  year: string;
  featured: boolean;
  order: number;
  links: ProjectLink[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
// ... existing code
  id: string;
  title: string;
  category: "HKI" | "Competition" | "Course" | "Seminar" | "Work";
  issuedBy: string;
  issueDate: string;
  imageUrl: string; // Bisa pake link placeholder dulu
  description: string;
  credentialUrl?: string;
}

export interface Journey {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  type: "Education" | "Experience" | "Award";
}
