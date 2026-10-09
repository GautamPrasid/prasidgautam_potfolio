export const SKILL_CATEGORIES = [
  "Languages",
  "Frontend",
  "Backend",
  "Database",
  "Tools/DevOps",
  "Soft Skills",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type SkillFilter = SkillCategory | "All";
export const SKILL_FILTERS = ["All", ...SKILL_CATEGORIES] as const;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  iconName: string;
  level?: number;
  description?: string;
}

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

export const PROJECT_CATEGORIES = [
  "Full-Stack",
  "Web Apps",
  "Backend",
  "Mini Projects",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type ProjectFilter = ProjectCategory | "All";
export const PROJECT_FILTERS = ["All", ...PROJECT_CATEGORIES] as const;

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  github?: string;
  demo?: string;
  category: ProjectCategory;
  featured?: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  orderIndex: number;
}
