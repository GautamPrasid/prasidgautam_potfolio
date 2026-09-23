import { PageWrapper } from "@/components/page-wrapper";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { EducationSection } from "@/components/sections/education-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { ContactSection } from "@/components/sections/contact-section";
import {
  getHeroAboutFromDb,
  getSocialLinksFromDb,
  getSkillsFromDb,
  getEducationFromDb,
  getExperienceFromDb,
  getProjectsFromDb,
  getCertificationsFromDb,
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
  ] = await Promise.all([
    getHeroAboutFromDb(),
    getSocialLinksFromDb(),
    getSkillsFromDb(),
    getEducationFromDb(),
    getExperienceFromDb(),
    getProjectsFromDb(),
    getCertificationsFromDb(),
  ]);

  return (
    <PageWrapper>
      <HeroSection initialHeroData={heroAbout} initialSocialLinks={socialLinks} />
      <AboutSection
        initialHeroData={heroAbout}
        initialEducation={education}
        initialProjectCount={projects.length}
        initialCertCount={certifications.length}
        initialTechCount={skills.length}
      />
      <SkillsSection initialSkills={skills} />
      <EducationSection initialEducation={education} />
      <ExperienceSection initialExperience={experience} />
      <ProjectsSection
        initialProjects={projects}
        initialGithubUrl={heroAbout?.githubUrl}
      />
      <CertificationsSection initialCertifications={certifications} />
      <ContactSection initialHeroData={heroAbout} />
    </PageWrapper>
  );
}
