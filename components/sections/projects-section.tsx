"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  PROJECT_FILTERS,
  ProjectFilter,
  Project,
} from "@/lib/data";
import { getProjectsFromDb, getHeroAboutFromDb, SectionHeadingItem } from "@/lib/supabase-db";
import {
  ExternalLink,
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Sparkles,
  FolderGit2,
  Loader2,
  BookOpen,
} from "lucide-react";
import { ProjectCaseStudyDialog } from "@/components/project-case-study-dialog";

/** Show 4 projects/repos initially */
const PROJECTS_PER_PAGE = 4;

export interface ProjectsSectionProps {
  initialProjects?: Project[];
  initialGithubUrl?: string | null;
  sectionContent?: SectionHeadingItem;
}

export function ProjectsSection({
  initialProjects = [],
  initialGithubUrl = null,
  sectionContent,
}: ProjectsSectionProps = {}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState<ProjectFilter>("All");
  const [githubUrl, setGithubUrl] = useState<string | null>(initialGithubUrl);
  const [visibleCount, setVisibleCount] = useState<number>(PROJECTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [selectedCaseStudyProject, setSelectedCaseStudyProject] = useState<Project | null>(null);

  // Reset pagination when category changes
  useEffect(() => {
    setVisibleCount(PROJECTS_PER_PAGE);
  }, [selectedCategory]);

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

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;
  const remainingCount = filteredProjects.length - visibleCount;

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PROJECTS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, []);

  const handleShowLess = useCallback(() => {
    setVisibleCount(PROJECTS_PER_PAGE);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="projects"
      className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
      aria-label="Projects Section"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-10 sm:space-y-12"
        suppressHydrationWarning
      >
        {/* Section Heading */}
        {(sectionContent?.badge || sectionContent?.heading || sectionContent?.subtext) && (
          <div className="mx-auto w-full min-w-0 max-w-3xl space-y-3 text-center sm:space-y-4">
            {sectionContent.badge && (
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                {sectionContent.badge}
              </span>
            )}
            {sectionContent.heading && (
              <h2 className="break-words font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {sectionContent.heading}
              </h2>
            )}
            {sectionContent.subtext && (
              <p className="break-words text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                {sectionContent.subtext}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap max-w-full">
          {PROJECT_FILTERS.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 min-h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
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

        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            suppressHydrationWarning
            className="py-12 sm:py-16 px-6 sm:px-8 text-center rounded-3xl bg-card/60 border border-dashed border-border/80 max-w-lg mx-auto backdrop-blur-sm space-y-3"
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
          <div className="space-y-10">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((project: Project) => {
                  const hasImage = !!project.image?.trim();
                  const hasGithub = !!project.github?.trim();
                  const hasDemo = !!project.demo?.trim();

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
                      className="rounded-3xl bg-card border border-border/80 hover:border-primary/50 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group min-w-0"
                    >
                      <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted flex items-center justify-center">
                        {hasImage ? (
                          <>
                            <Image
                              src={project.image!}
                              alt={project.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                              className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50 text-muted-foreground/60 select-none">
                            <FolderGit2 className="w-10 h-10 mb-2 opacity-40 stroke-[1.5]" />
                            <span className="text-xs font-medium uppercase tracking-wider">No image preview</span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/60 shadow-sm flex items-center gap-1.5 max-w-[200px] truncate">
                            <Sparkles className="w-3 h-3 text-primary shrink-0" />
                            <span className="truncate">{project.category}</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between space-y-5 sm:space-y-6 min-w-0">
                        <div className="space-y-2.5 sm:space-y-3 min-w-0">
                          <h3 className="font-heading font-bold text-lg sm:text-2xl text-foreground group-hover:text-primary transition-colors leading-snug break-words">
                            {project.title}
                          </h3>
                          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed break-words">
                            {project.description}
                          </p>
                        </div>

                        <div className="space-y-4 pt-2">
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {project.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2.5 sm:px-3 py-1 rounded-xl bg-muted/80 text-foreground text-xs font-medium border border-border/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedCaseStudyProject(project)}
                              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 sm:px-3.5 py-2.5 rounded-xl bg-card border border-border/90 hover:border-primary text-foreground hover:text-primary shadow-sm hover:shadow-md transition-all duration-200 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>Case Study</span>
                            </button>

                            <div className="flex items-center gap-2">
                              {hasGithub && (
                                <a
                                  href={project.github!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`View ${project.title} source code on GitHub`}
                                  className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-2.5 rounded-xl bg-muted hover:bg-foreground hover:text-background text-foreground transition-all duration-200 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                >
                                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                  </svg>
                                  <span className="hidden sm:inline">Code</span>
                                </a>
                              )}

                              {hasDemo ? (
                                <a
                                  href={project.demo!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Open live demo of ${project.title}`}
                                  className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all duration-200 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                >
                                  <span>Live Demo</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Read More / Load More Repos Button */}
            {hasMore ? (
              <div className="flex flex-col items-center gap-3 pt-2">
                {/* Count Indicator */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="h-px w-12 bg-border" />
                  <span>
                    Showing {visibleProjects.length} of {filteredProjects.length} repositories
                  </span>
                  <div className="h-px w-12 bg-border" />
                </div>

                {/* Progress bar */}
                <div className="w-48 h-1 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={false}
                    animate={{ width: `${(visibleProjects.length / filteredProjects.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Read More button */}
                <motion.button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="group relative mt-1 min-h-11 max-w-full px-5 sm:px-8 py-3.5 rounded-2xl bg-card border-2 border-primary/20 hover:border-primary/60 text-foreground font-semibold text-sm shadow-sm hover:shadow-xl transition-all duration-300 flex flex-wrap justify-center items-center gap-2.5 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Loading more repos...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-primary font-bold">Load More Repos</span>
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold">
                        +{Math.min(remainingCount, PROJECTS_PER_PAGE)}
                      </span>
                      <ArrowDown className="w-4 h-4 text-primary group-hover:translate-y-0.5 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>
            ) : (
              filteredProjects.length > PROJECTS_PER_PAGE && (
                <div className="flex flex-col items-center gap-2 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>All {filteredProjects.length} repositories displayed</span>
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <button
                    onClick={handleShowLess}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Show less (4 repos)</span>
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {githubUrl?.trim() && (
          <div className="pt-4 sm:pt-6 flex justify-center">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-card border border-border hover:border-primary/50 text-foreground font-semibold shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 sm:gap-3 group min-h-[44px] text-xs sm:text-sm"
            >
              <FolderGit2 className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform shrink-0" />
              <span>View All Repositories on GitHub</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>
          </div>
        )}
      </motion.div>

      {/* Case Study Dialog Modal */}
      <ProjectCaseStudyDialog
        project={selectedCaseStudyProject}
        isOpen={Boolean(selectedCaseStudyProject)}
        onClose={() => setSelectedCaseStudyProject(null)}
      />
    </section>
  );
}

export { ProjectsSection as Projects };
