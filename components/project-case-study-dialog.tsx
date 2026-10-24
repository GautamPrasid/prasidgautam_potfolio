"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/data";
import { getCaseStudyForProject } from "@/lib/case-studies";
import {
  X,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  FolderGit2,
} from "lucide-react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

interface ProjectCaseStudyDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectCaseStudyDialog({
  project,
  isOpen,
  onClose,
}: ProjectCaseStudyDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!project) return null;

  const caseStudy = getCaseStudyForProject(project.title, project.category);
  const hasGithub = Boolean(project.github?.trim());
  const hasDemo = Boolean(project.demo?.trim());

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl text-foreground z-10 scrollbar-none"
          >
            {/* Header Image / Gradient Bar */}
            <div className="relative w-full h-48 sm:h-64 bg-muted overflow-hidden">
              {project.image ? (
                <>
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/15 via-accent/10 to-card text-muted-foreground select-none">
                  <FolderGit2 className="w-12 h-12 mb-2 text-primary/40" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                    {project.category} Project
                  </span>
                </div>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Case Study Dialog"
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-background/80 hover:bg-background text-foreground border border-border/80 shadow-md backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Category & Badge */}
              <div className="absolute bottom-4 left-6 z-10 flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{project.category}</span>
                </span>
                {project.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                    Featured Case Study
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
              {/* Title & Overview */}
              <div className="space-y-3">
                <h2
                  id="case-study-title"
                  className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                >
                  {project.title}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* 1. The Problem / Challenge */}
              <div className="space-y-2 p-5 rounded-2xl bg-muted/40 border border-border/70">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <span>The Problem &amp; Context</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {caseStudy.problem}
                </p>
              </div>

              {/* 2. My Contribution & Architecture */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Role &amp; Technical Architecture</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {caseStudy.contribution}
                </p>
                <div className="p-3.5 rounded-xl bg-background border border-border/80 text-xs font-medium text-foreground/90">
                  <span className="font-bold text-primary mr-1.5">Architecture:</span>
                  {caseStudy.architecture}
                </div>
              </div>

              {/* 3. Key Implemented Features */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Key Implemented Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {caseStudy.keyFeatures.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Technologies Used */}
              {project.tags && project.tags.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Technologies &amp; Tools Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground text-xs font-semibold shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {hasGithub && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-muted hover:bg-foreground hover:text-background text-foreground text-sm font-semibold transition-all duration-200 min-h-[44px] min-w-[44px]"
                    >
                      <DynamicIcon name="Github" className="w-4 h-4" />
                      <span>View GitHub Repository</span>
                    </a>
                  )}

                  {hasDemo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-md transition-all duration-200 min-h-[44px] min-w-[44px]"
                    >
                      <span>Open Live Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors min-h-[44px]"
                >
                  Close Case Study
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
