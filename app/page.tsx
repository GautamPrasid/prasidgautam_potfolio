import { PageWrapper } from "@/components/page-wrapper";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { EducationSection } from "@/components/sections/education-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <EducationSection />
      <ExperienceSection />
      <ProjectsSection />
      <CertificationsSection />
      <ContactSection />
    </PageWrapper>
  );
}
