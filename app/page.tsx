import { PageWrapper } from "@/components/page-wrapper";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ResumeSection } from "@/components/sections/resume-section";
import { BlogSection } from "@/components/sections/blog-section";
import { ContactSection } from "@/components/sections/contact-section";
import {
  getHeroAboutFromDb,
  getSocialLinksFromDb,
  getSkillsFromDb,
  getEducationFromDb,
  getExperienceFromDb,
  getProjectsFromDb,
  getCertificationsFromDb,
  getPublishedBlogsFromDb,
  getSiteSettingsFromDb,
} from "@/lib/supabase-db";

import type { Metadata } from "next";

// Cache home page with ISR fallback, revalidated on-demand via revalidatePath when admin updates content
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const [
    heroAbout,
    socialLinks,
    skills,
    education,
    experience,
    projects,
    certifications,
    blogs,
    siteSettings,
  ] = await Promise.all([
    getHeroAboutFromDb(),
    getSocialLinksFromDb(),
    getSkillsFromDb(),
    getEducationFromDb(),
    getExperienceFromDb(),
    getProjectsFromDb(),
    getCertificationsFromDb(),
    getPublishedBlogsFromDb(),
    getSiteSettingsFromDb(),
  ]);

  const sc = siteSettings?.sectionContent;
  const visibility = siteSettings?.sectionVisibility ?? {};

  const hasAbout = Boolean(heroAbout?.aboutText?.trim() || heroAbout?.bioText?.trim());
  const showAbout = visibility.about !== false && hasAbout;

  const hasSkills = (skills?.length ?? 0) > 0;
  const showSkills = visibility.skills !== false && hasSkills;

  const hasProjects = (projects?.length ?? 0) > 0;
  const showProjects = visibility.projects !== false && hasProjects;

  const hasResume = Boolean(
    (education?.length ?? 0) > 0 ||
    (experience?.length ?? 0) > 0 ||
    (certifications?.length ?? 0) > 0 ||
    heroAbout?.resumeUrl
  );
  const showResume = visibility.resume !== false && hasResume;

  const hasBlog = (blogs?.length ?? 0) > 0;
  const showBlog = visibility.blog !== false && hasBlog;

  const hasContact = Boolean(
    heroAbout?.contactEmail ||
    heroAbout?.contactPhone ||
    (socialLinks?.length ?? 0) > 0
  );
  const showContact = visibility.contact !== false && hasContact;

  return (
    <PageWrapper>
      {/* 1. Home — Name, title, intro, View Projects and Contact Me buttons */}
      <HeroSection initialHeroData={heroAbout} initialSocialLinks={socialLinks} />

      {/* 2. About — Background, interests, and career goals */}
      {showAbout && (
        <AboutSection
          initialHeroData={heroAbout}
          initialEducation={education}
          initialProjectCount={projects.length}
          initialCertCount={certifications.length}
          initialTechCount={skills.length}
          sectionContent={sc?.about}
        />
      )}

      {/* 3. Skills — Technical abilities and tools */}
      {showSkills && (
        <SkillsSection
          initialSkills={skills}
          sectionContent={sc?.skills}
        />
      )}

      {/* 4. Projects — Strongest work with GitHub & live demo links */}
      {showProjects && (
        <ProjectsSection
          initialProjects={projects}
          initialGithubUrl={heroAbout?.githubUrl}
          sectionContent={sc?.projects}
        />
      )}

      {/* 5. Resume — Education, experience, certifications & downloadable CV */}
      {showResume && (
        <ResumeSection
          initialEducation={education}
          initialExperience={experience}
          initialCertifications={certifications}
          resumeUrl={heroAbout?.resumeUrl}
          name={heroAbout?.name}
          sectionContent={sc?.resume}
        />
      )}

      {/* 6. Blog — Technical articles & tutorials */}
      {showBlog && (
        <BlogSection
          initialBlogs={blogs}
          sectionContent={sc?.blog}
        />
      )}

      {/* 7. Contact — Email, social profiles & contact form */}
      {showContact && (
        <ContactSection
          initialHeroData={heroAbout}
          sectionContent={sc?.contact}
        />
      )}
    </PageWrapper>
  );
}
