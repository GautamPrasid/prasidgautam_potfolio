"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SKILL_CATEGORIES,
  SkillCategory,
  Skill,
} from "@/lib/data";
import { getSkillsFromDb } from "@/lib/supabase-db";

import {
  Code,
  FileCode,
  Terminal,
  Cpu,
  Layout,
  Globe,
  Atom,
  Palette,
  Sparkles,
  Server,
  Layers,
  Network,
  Database,
  HardDrive,
  Boxes,
  GitBranch,
  Container,
  Laptop,
  Cloud,
  Brain,
  Users,
  CheckSquare,
  Wrench,
  LucideIcon,
} from "lucide-react";

// Icon mapping helper
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  FileCode,
  Terminal,
  Cpu,
  Layout,
  Globe,
  Atom,
  Palette,
  Sparkles,
  Server,
  Layers,
  Network,
  Database,
  HardDrive,
  Boxes,
  GitBranch,
  Container,
  Laptop,
  Cloud,
  Brain,
  Users,
  CheckSquare,
};

export interface SkillsSectionProps {
  initialSkills?: Skill[];
}

export function SkillsSection({ initialSkills = [] }: SkillsSectionProps = {}) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>("All");

  useEffect(() => {
    if (initialSkills && initialSkills.length > 0) {
      setSkills(initialSkills);
    }
  }, [initialSkills]);

  useEffect(() => {
    if (initialSkills && initialSkills.length > 0) return;
    let active = true;
    async function fetchSkills() {
      const data = await getSkillsFromDb();
      if (active) {
        setSkills(data ?? []);
      }
    }
    fetchSkills();
    return () => {
      active = false;
    };
  }, [initialSkills]);

  const safeSkills = skills ?? [];
  const filteredSkills =
    selectedCategory === "All"
      ? safeSkills
      : safeSkills.filter((skill) => skill.category === selectedCategory);


  return (
    <section
      id="skills"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
      aria-label="Skills Section"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
        suppressHydrationWarning
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 inline-block uppercase">
            Technical Expertise
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Skills &amp; Technologies
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            A comprehensive overview of languages, frameworks, databases, tools, and professional capabilities I leverage daily.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {SKILL_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border shadow-sm"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Skill Card Grid (2 cols mobile, 3 cols tablet, 4 cols desktop) */}
        {filteredSkills.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-card border border-dashed border-border p-8 max-w-md mx-auto">
            <Wrench className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No skills added yet.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill: Skill) => {

              const IconComponent = ICON_MAP[skill.iconName] || Wrench;
              return (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  suppressHydrationWarning
                  className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                        {skill.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                        {skill.name}
                      </h3>
                      {skill.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Level indicator bar if present */}
                  {skill.level && (
                    <div className="pt-4 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                        <span>Proficiency</span>
                        <span className="text-foreground font-semibold">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        )}
      </motion.div>
    </section>
  );
}


// Export alias for Skills
export { SkillsSection as Skills };
