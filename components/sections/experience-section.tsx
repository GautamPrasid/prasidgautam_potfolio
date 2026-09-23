"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExperienceItem } from "@/lib/data";
import { getExperienceFromDb } from "@/lib/supabase-db";
import { Briefcase, Calendar, MapPin, CheckCircle2, Code2 } from "lucide-react";

export interface ExperienceSectionProps {
  initialExperience?: ExperienceItem[];
}

export function ExperienceSection({ initialExperience = [] }: ExperienceSectionProps = {}) {
  const [experience, setExperience] = useState<ExperienceItem[]>(initialExperience);

  useEffect(() => {
    if (initialExperience && initialExperience.length > 0) {
      setExperience(initialExperience);
    }
  }, [initialExperience]);

  useEffect(() => {
    if (initialExperience && initialExperience.length > 0) return;
    let active = true;
    async function fetchExperience() {
      const data = await getExperienceFromDb();
      if (active) {
        setExperience(data ?? []);
      }
    }
    fetchExperience();
    return () => {
      active = false;
    };
  }, [initialExperience]);

  const safeExperience = experience ?? [];

  return (
    <section
      id="experience"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-20"
      aria-label="Experience Section"
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
            Work &amp; Involvement
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Work Experience &amp; Projects
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Practical experience gained through freelance development, campus leadership roles, and hackathons.
          </p>
        </div>

        {/* Experience Timeline Grid */}
        {safeExperience.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-card border border-dashed border-border p-8 max-w-md mx-auto">
            <Briefcase className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No experience records added yet.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 md:pl-10 space-y-12">
            {/* Connecting Vertical Line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute left-3 sm:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30 origin-top"
            />

            {safeExperience.map((item: ExperienceItem, idx: number) => {


            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                suppressHydrationWarning
                className="relative group"
              >
                {/* Node Indicator Dot */}
                <div className="absolute -left-[31px] sm:-left-[35px] md:-left-[39px] top-1.5 flex items-center justify-center">
                  <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-card border-2 border-primary shadow-md">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                </div>

                {/* Experience Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
                  {/* Card Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors">
                          {item.role}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {item.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                        <Briefcase className="w-4 h-4 text-primary shrink-0" />
                        <span>{item.company}</span>
                      </div>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-2.5 text-sm sm:text-base text-muted-foreground">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack Pills */}
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1 flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-primary" /> Stack:
                      </span>
                      {item.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-lg bg-muted text-foreground text-xs font-medium border border-border/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          </div>
        )}
      </motion.div>
    </section>
  );
}


// Export alias for Experience
export { ExperienceSection as Experience };
