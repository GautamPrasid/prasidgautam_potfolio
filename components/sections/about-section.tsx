"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { GraduationCap, Code2, Award, Rocket, CheckCircle2 } from "lucide-react";
import { EducationItem } from "@/lib/data";
import {
  getProjectsFromDb,
  getCertificationsFromDb,
  getSkillsFromDb,
  getEducationFromDb,
  getHeroAboutFromDb,
  HeroAboutData,
} from "@/lib/supabase-db";

export interface AboutSectionProps {
  initialHeroData?: HeroAboutData | null;
  initialEducation?: EducationItem[];
  initialProjectCount?: number;
  initialCertCount?: number;
  initialTechCount?: number;
}

export function AboutSection({
  initialHeroData = null,
  initialEducation,
  initialProjectCount = 0,
  initialCertCount = 0,
  initialTechCount = 0,
}: AboutSectionProps = {}) {
  const findCurrentEdu = (edus?: EducationItem[]) => {
    if (!edus || edus.length === 0) return null;
    return (
      edus.find(
        (e) =>
          e.status === "Enrolled" ||
          e.status?.toLowerCase().includes("progress") ||
          e.status?.toLowerCase().includes("current") ||
          e.status?.toLowerCase().includes("enrolled")
      ) ?? null
    );
  };

  const [projectCount, setProjectCount] = useState<number>(initialProjectCount);
  const [certCount, setCertCount] = useState<number>(initialCertCount);
  const [techCount, setTechCount] = useState<number>(initialTechCount);
  const [currentEducation, setCurrentEducation] = useState<EducationItem | null>(() =>
    findCurrentEdu(initialEducation)
  );
  const [heroData, setHeroData] = useState<HeroAboutData | null>(initialHeroData);

  useEffect(() => {
    if (initialHeroData) setHeroData(initialHeroData);
    if (initialEducation) setCurrentEducation(findCurrentEdu(initialEducation));
    if (initialProjectCount !== undefined) setProjectCount(initialProjectCount);
    if (initialCertCount !== undefined) setCertCount(initialCertCount);
    if (initialTechCount !== undefined) setTechCount(initialTechCount);
  }, [initialHeroData, initialEducation, initialProjectCount, initialCertCount, initialTechCount]);

  useEffect(() => {
    if (initialHeroData && initialEducation) return;
    let active = true;
    async function loadStats() {
      const [projects, certs, skills, education, hero] = await Promise.all([
        getProjectsFromDb(),
        getCertificationsFromDb(),
        getSkillsFromDb(),
        getEducationFromDb(),
        getHeroAboutFromDb(),
      ]);
      if (active) {
        setProjectCount(projects.length);
        setCertCount(certs.length);
        setTechCount(skills.length);
        setCurrentEducation(findCurrentEdu(education));
        setHeroData(hero);
      }
    }
    loadStats();
    return () => {
      active = false;
    };
  }, [initialHeroData, initialEducation]);

  const stats = [
    {
      label: "Projects Completed",
      value: projectCount,
      suffix: "+",
      icon: Code2,
    },
    {
      label: "Certifications",
      value: certCount,
      suffix: "+",
      icon: Award,
    },
    {
      label: "Technologies Mastered",
      value: techCount,
      suffix: "+",
      icon: Rocket,
    },
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
      aria-label="About Section"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-16"
        suppressHydrationWarning
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 inline-block uppercase">
            About Me
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Driven by Passion, Focused on Excellence
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Here is a look into my background, academic journey, and what drives me as a software developer.
          </p>
        </div>

        {/* Two-Column Grid Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative & Story */}
          <div className="lg:col-span-7 space-y-6">
            {heroData?.aboutText && (
              <div className="space-y-4 text-foreground/90 text-base sm:text-lg leading-relaxed">
                {heroData.aboutText.split("\n").map((para, idx) =>
                  para.trim() ? <p key={idx}>{para.trim()}</p> : null
                )}
              </div>
            )}

            {/* Academic & Skill Highlights List */}
            {heroData?.highlights && heroData.highlights.length > 0 && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {heroData.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: College Card & Interactive Info Box */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* College & Degree Feature Card - Only rendered if current/enrolled education exists */}
            {currentEducation && (
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-foreground">
                      Current Education
                    </h3>
                    <p className="text-xs text-primary font-medium uppercase tracking-wider">
                      Currently Pursuing • {currentEducation.duration}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground text-base">
                    {currentEducation.degree}
                  </p>
                  <p className="text-muted-foreground font-medium">
                    {currentEducation.institution} ({currentEducation.location})
                  </p>
                  {currentEducation.description && (
                    <p className="text-xs text-muted-foreground/90 pt-1 leading-relaxed">
                      {currentEducation.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Personal Philosophy / Mission Quote */}
            {heroData?.philosophyQuote && (
              <div className="p-6 rounded-3xl bg-muted/40 border border-border/80 text-muted-foreground text-sm italic relative">
                &ldquo;{heroData.philosophyQuote}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Small Stats Row: Animated Count-Up Numbers */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md flex items-center gap-5 transition-all duration-300"
              >
                <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// Export alias for About
export { AboutSection as About };
