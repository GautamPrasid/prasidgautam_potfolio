"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  PROJECT_CATEGORIES,
  ProjectCategory,
  Project,
} from "@/lib/data";
import { getProjectsFromDb, getHeroAboutFromDb } from "@/lib/supabase-db";
import { ExternalLink, ArrowUpRight, Sparkles, FolderGit2 } from "lucide-react";

export interface ProjectsSectionProps {
  initialProjects?: Project[];
  initialGithubUrl?: string | null;
}

export function ProjectsSection({
  initialProjects = [],
  initialGithubUrl = null,
}: ProjectsSectionProps = {}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [githubUrl, setGithubUrl] = useState<string | null>(initialGithubUrl);

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  useEffect(() => {
    if (initialGithubUrl !== undefined) {
      setGithubUrl(initialGithubUrl);
    }
  }, [initialGithubUrl]);

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) return;
    let active = true;
    async function fetchProjects() {
      const [projectData, heroData] = await Promise.all([
        getProjectsFromDb(),
        getHeroAboutFromDb(),
      ]);
      if (active) {
        setProjects(projectData ?? []);
        setGithubUrl(heroData?.githubUrl ?? null);
      }
    }
    fetchProjects();
    return () => {
      active = false;
    };
  }, [initialProjects]);

  const safeProjects = projects ?? [];
  const filteredProjects =
    selectedCategory === "All"
      ? safeProjects
      : safeProjects.filter((project) => project.category === selectedCategory);


  return (
    <section
      id="projects"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
      aria-label="Projects Section"
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
            Portfolio Showcase
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            A curated selection of full-stack web applications, real-time tools, and software projects I&apos;ve engineered.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {PROJECT_CATEGORIES.map((category) => {
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

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            suppressHydrationWarning
            className="py-16 px-8 text-center rounded-3xl bg-card/60 border border-dashed border-border/80 max-w-lg mx-auto backdrop-blur-sm space-y-3"
          >
            <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 w-fit mx-auto">
              <FolderGit2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground">
              {safeProjects.length === 0 ? "No Projects Added Yet" : "No Projects in This Category"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {safeProjects.length === 0
                ? "Portfolio project showcases and repositories will appear here once published."
                : `No projects currently found under "${selectedCategory}". Try selecting another category.`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project: Project) => {
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  suppressHydrationWarning
                  className="rounded-3xl bg-card border border-border/80 hover:border-primary/50 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Image Container with Zoom & Overlay or Placeholder */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted flex items-center justify-center">
                    {project.image ? (
                      <>
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50 text-muted-foreground/60 select-none">
                        <FolderGit2 className="w-10 h-10 mb-2 opacity-40 stroke-[1.5]" />
                        <span className="text-xs font-medium uppercase tracking-wider">No image preview</span>
                      </div>
                    )}

                    {/* Category Badge Pill */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/60 shadow-sm flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-3 py-1 rounded-xl bg-muted/80 text-foreground text-xs font-medium border border-border/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Links Row (GitHub & Live Demo) */}
                      <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-muted hover:bg-foreground hover:text-background text-foreground transition-all duration-200"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                          <span>Code Repository</span>
                        </a>

                        {project.demo ? (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all duration-200"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Backend API Only
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        )}

        {/* View All on GitHub Button — only shown when a real GitHub URL is configured */}
        {githubUrl && (
          <div className="pt-8 flex justify-center">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-card border border-border hover:border-primary/50 text-foreground font-semibold shadow-md hover:shadow-xl transition-all duration-200 flex items-center gap-3 group"
            >
              <FolderGit2 className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
              <span>View All Repositories on GitHub</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
}

// Export alias for Projects
export { ProjectsSection as Projects };
