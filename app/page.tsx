import { PageWrapper } from "@/components/page-wrapper";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ResumeSection } from "@/components/sections/resume-section";
import { BlogSection } from "@/components/sections/blog-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionNavigation } from "@/components/section-navigation";
import {
  getHeroAboutFromDb,
  getSocialLinksFromDb,
  getSkillsFromDb,
  getEducationFromDb,
  getExperienceFromDb,
  getProjectsFromDb,
  getCertificationsFromDb,
  getBlogsFromDb,
  getSiteSettingsFromDb,
} from "@/lib/supabase-db";

export const revalidate = 0;
export const dynamic = "force-dynamic";

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
    getBlogsFromDb(),
    getSiteSettingsFromDb(),
  ]);

  const sc = siteSettings?.sectionContent;

  return (
    <PageWrapper>
      {/* 1. Home — Name, title, intro, View Projects and Contact Me buttons */}
      <HeroSection initialHeroData={heroAbout} initialSocialLinks={socialLinks} />

      {/* 2. About — Background, interests, and career goals */}
      <AboutSection
        initialHeroData={heroAbout}
        initialEducation={education}
        initialProjectCount={projects.length}
        initialCertCount={certifications.length}
        initialTechCount={skills.length}
        sectionContent={sc?.about}
      />

      {/* 3. Skills — Technical abilities and tools */}
      <SkillsSection
        initialSkills={skills}
        sectionContent={sc?.skills}
      />

      {/* 4. Projects — Strongest work with GitHub & live demo links */}
      <ProjectsSection
        initialProjects={projects}
        initialGithubUrl={heroAbout?.githubUrl}
        sectionContent={sc?.projects}
      />

      {/* 5. Resume — Education, experience, certifications & downloadable CV */}
      <ResumeSection
        initialEducation={education}
        initialExperience={experience}
        initialCertifications={certifications}
        resumeUrl={heroAbout?.resumeUrl}
        name={heroAbout?.name}
        sectionContent={sc?.resume}
      />

      {/* 6. Blog — Technical articles & tutorials */}
      <BlogSection
        initialBlogs={blogs}
        sectionContent={sc?.blog}
      />

      {/* 7. Contact — Email, social profiles & contact form */}
      <ContactSection
        initialHeroData={heroAbout}
        sectionContent={sc?.contact}
      />

      {/* Section Navigation - Mobile Bottom Bar & Desktop Sidebar */}
      <SectionNavigation />
    </PageWrapper>
  );
}
