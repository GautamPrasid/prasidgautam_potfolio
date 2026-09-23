export interface Skill {
  id: string;
  name: string;
  category: "Languages" | "Frontend" | "Backend" | "Database" | "Tools/DevOps" | "Soft Skills";
  iconName: string;
  level?: number;
  description?: string;
}

export const SKILL_CATEGORIES = [
  "All",
  "Languages",
  "Frontend",
  "Backend",
  "Database",
  "Tools/DevOps",
  "Soft Skills",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  description: string;
  status: "Enrolled" | "Completed";
  courses?: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: "Freelance" | "College Role" | "Project / Hackathon";
  bullets: string[];
  technologies: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  skills: string[];
  issuerColor?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  github?: string;
  demo?: string;
  category: "Web Apps" | "Full-Stack" | "Backend" | "Mini Projects";
  featured?: boolean;
}

export const PROJECT_CATEGORIES = [
  "All",
  "Full-Stack",
  "Web Apps",
  "Backend",
  "Mini Projects",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  orderIndex: number;
}
