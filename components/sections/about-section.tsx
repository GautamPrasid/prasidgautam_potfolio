"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { GraduationCap, Code2, Award, Rocket, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  const stats = [
    {
      label: "Projects Completed",
      value: 15,
      suffix: "+",
      icon: Code2,
    },
    {
      label: "Certifications",
      value: 8,
      suffix: "+",
      icon: Award,
    },
    {
      label: "Technologies Mastered",
      value: 12,
      suffix: "+",
      icon: Rocket,
    },
  ];

  const highlights = [
    "BCA Undergraduate at La Grande International College",
    "Full-Stack Web Development with Next.js, React & Node.js",
    "Database design & backend services with Supabase & PostgreSQL",
    "UI/UX craftsmanship using Tailwind CSS & Framer Motion",
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
            <div className="space-y-4 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <p>
                Hello! I&apos;m <strong className="text-foreground font-semibold">Prasid Gautam</strong>, a passionate software developer currently pursuing my <strong className="text-primary font-semibold">Bachelor of Computer Applications (BCA)</strong> at <strong className="text-foreground font-semibold">La Grande International College</strong>.
              </p>
              <p>
                My journey into tech started with a curiosity for how web platforms work behind the scenes. Over the years, that curiosity grew into a dedication to building scalable web applications, sleek user interfaces, and robust server architectures.
              </p>
              <p>
                I thrive at the intersection of frontend aesthetics and backend functionality. Whether crafting responsive user interfaces with Next.js and Tailwind CSS or building real-time backend integrations with Supabase, I prioritize code quality, performance, and user-centric design.
              </p>
            </div>

            {/* Academic & Skill Highlights List */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: College Card & Interactive Info Box */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* College & Degree Feature Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

              <div className="flex items-center gap-4 mb-4">
                <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground">
                    Education &amp; Degree
                  </h3>
                  <p className="text-xs text-primary font-medium uppercase tracking-wider">
                    Academic Background
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground text-base">
                  Bachelor of Computer Applications (BCA)
                </p>
                <p className="text-muted-foreground">
                  La Grande International College
                </p>
                <p className="text-xs text-primary/80 pt-1">
                  Focus: Software Engineering, Data Structures, Web Development &amp; Database Systems
                </p>
              </div>
            </div>

            {/* Personal Philosophy / Mission Quote */}
            <div className="p-6 rounded-3xl bg-muted/40 border border-border/80 text-muted-foreground text-sm italic relative">
              &ldquo;Building software isn&apos;t just about writing syntax—it&apos;s about solving real-world problems with elegant, scalable technology.&rdquo;
            </div>
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
