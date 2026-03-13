export interface Achievement {
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
