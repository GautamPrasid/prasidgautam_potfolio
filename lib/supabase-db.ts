import { createBrowserClient } from "@supabase/ssr";
import {
  SKILLS_DATA,
  EDUCATION_DATA,
  EXPERIENCE_DATA,
  CERTIFICATIONS_DATA,
  PROJECTS_DATA,
  Skill,
  EducationItem,
  ExperienceItem,
  CertificationItem,
  Project,
} from "./data";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project-ref") || key.includes("your-anon-key")) {
    return null;
  }
  return createBrowserClient(url, key);
}

export async function getSkillsFromDb(): Promise<Skill[]> {
  const client = getSupabaseClient();
  if (!client) return SKILLS_DATA;

  try {
    const { data, error } = await client
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) return SKILLS_DATA;

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      iconName: d.icon_name,
      level: d.level,
      description: d.description,
    }));
  } catch {
    return SKILLS_DATA;
  }
}

export async function getEducationFromDb(): Promise<EducationItem[]> {
  const client = getSupabaseClient();
  if (!client) return EDUCATION_DATA;

  try {
    const { data, error } = await client
      .from("education")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) return EDUCATION_DATA;

    return data.map((d) => ({
      id: d.id,
      degree: d.degree,
      institution: d.institution,
      location: d.location,
      duration: d.duration,
      status: d.status,
      description: d.description,
      courses: d.courses,
    }));
  } catch {
    return EDUCATION_DATA;
  }
}

export async function getExperienceFromDb(): Promise<ExperienceItem[]> {
  const client = getSupabaseClient();
  if (!client) return EXPERIENCE_DATA;

  try {
    const { data, error } = await client
      .from("experience")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) return EXPERIENCE_DATA;

    return data.map((d) => ({
      id: d.id,
      role: d.role,
      company: d.company,
      location: d.location,
      duration: d.duration,
      type: d.type,
      bullets: d.bullets,
      technologies: d.technologies,
    }));
  } catch {
    return EXPERIENCE_DATA;
  }
}

export async function getCertificationsFromDb(): Promise<CertificationItem[]> {
  const client = getSupabaseClient();
  if (!client) return CERTIFICATIONS_DATA;

  try {
    const { data, error } = await client
      .from("certifications")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) return CERTIFICATIONS_DATA;

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      issuer: d.issuer,
      date: d.date,
      credentialUrl: d.credential_url,
      skills: d.skills,
      issuerColor: d.issuer_color,
    }));
  } catch {
    return CERTIFICATIONS_DATA;
  }
}

export async function getProjectsFromDb(): Promise<Project[]> {
  const client = getSupabaseClient();
  if (!client) return PROJECTS_DATA;

  try {
    const { data, error } = await client
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) return PROJECTS_DATA;

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      tags: d.tags,
      image: d.image,
      github: d.github,
      demo: d.demo,
      category: d.category,
      featured: d.featured,
    }));
  } catch {
    return PROJECTS_DATA;
  }
}
