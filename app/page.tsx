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
  ] = await Promise.all([
    getHeroAboutFromDb(),
    getSocialLinksFromDb(),
    getSkillsFromDb(),
    getEducationFromDb(),
    getExperienceFromDb(),
    getProjectsFromDb(),
    getCertificationsFromDb(),
    getBlogsFromDb(),
  ]);

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
      />

      {/* 3. Skills — Technical abilities and tools */}
      <SkillsSection initialSkills={skills} />

      {/* 4. Projects — Strongest work with GitHub & live demo links */}
      <ProjectsSection
        initialProjects={projects}
        initialGithubUrl={heroAbout?.githubUrl}
      />

      {/* 5. Resume — Education, experience, certifications & downloadable CV */}
      <ResumeSection
        initialEducation={education}
        initialExperience={experience}
        initialCertifications={certifications}
        resumeUrl={heroAbout?.resumeUrl}
        name={heroAbout?.name}
      />

      {/* 6. Blog — Technical articles & tutorials */}
      <BlogSection initialBlogs={blogs} />

      {/* 7. Contact — Email, social profiles & contact form */}
      <ContactSection initialHeroData={heroAbout} />

      {/* Section Navigation - Mobile Bottom Bar & Desktop Sidebar */}
      <SectionNavigation />
    </PageWrapper>
  );
}
