"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EducationItem, ExperienceItem, CertificationItem } from "@/lib/data";
import {
  GraduationCap,
  Briefcase,
  Award,
  Calendar,
  MapPin,
  BookOpen,
  ExternalLink,
  Download,
  FileText,
} from "lucide-react";

export interface ResumeSectionProps {
  initialEducation?: EducationItem[];
  initialExperience?: ExperienceItem[];
  initialCertifications?: CertificationItem[];
  resumeUrl?: string;
  name?: string;
}

type TabType = "all" | "experience" | "education" | "certifications";

export function ResumeSection({
  initialEducation = [],
  initialExperience = [],
  initialCertifications = [],
  resumeUrl,
  name,
}: ResumeSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabs: { id: TabType; label: string; icon: typeof Briefcase; count: number }[] = [
    { id: "all", label: "All Overview", icon: FileText, count: initialExperience.length + initialEducation.length + initialCertifications.length },
    { id: "experience", label: "Experience", icon: Briefcase, count: initialExperience.length },
    { id: "education", label: "Education", icon: GraduationCap, count: initialEducation.length },
    { id: "certifications", label: "Certifications", icon: Award, count: initialCertifications.length },
  ];

  return (
    <section
      id="resume"
      className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20"
      aria-label="Resume Section"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-10 sm:space-y-12"
        suppressHydrationWarning
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 inline-block uppercase">
            Qualifications &amp; Career
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Resume &amp; Credentials
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            My professional journey, academic background, industry certifications, and key accomplishments.
          </p>

          {/* Download CV / Resume Button */}
          {resumeUrl && (
            <div className="pt-2 flex justify-center">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={name ? `${name.replace(/\s+/g, "_")}_Resume.pdf` : "Resume.pdf"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 group min-h-[44px] text-sm"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download Official CV</span>
              </a>
            </div>
          )}
        </div>

        {/* Tab Filter Nav */}
        <div className="flex justify-center overflow-x-auto max-w-full py-2 scrollbar-none">
          <div className="inline-flex p-1.5 rounded-2xl bg-card border border-border/80 shadow-sm gap-1 max-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none min-h-[44px] ${
                    isActive
                      ? "text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeResumeTab"
                      className="absolute inset-0 bg-primary rounded-xl shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12 sm:space-y-16"
          >
            {/* Experience Subsection */}
            {(activeTab === "all" || activeTab === "experience") && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                      Work Experience
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Roles, leadership, and professional contributions
                    </p>
                  </div>
                </div>

                {initialExperience.length === 0 ? (
                  <div className="py-8 text-center rounded-2xl bg-card border border-dashed border-border p-6 text-xs sm:text-sm text-muted-foreground">
                    No experience added yet.
                  </div>
                ) : (
                  <div className="relative pl-6 sm:pl-8 space-y-8">
                    <div className="absolute left-3 sm:left-4 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30" />

                    {initialExperience.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="relative group min-w-0"
                      >
                        {/* Timeline Node Centered on Line */}
                        <div className="absolute -left-[22px] sm:-left-[26px] top-2 flex items-center justify-center">
                          <div className="h-5 w-5 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-sm">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                        </div>

                        <div className="p-5 sm:p-6 lg:p-8 rounded-2xl bg-card border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-md transition-all space-y-4 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                            <div className="min-w-0">
                              <h4 className="font-heading font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors break-words">
                                {item.role}
                              </h4>
                              <p className="text-xs sm:text-sm font-semibold text-primary/90">
                                {item.company}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border">
                                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                {item.duration}
                              </span>
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border">
                                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                                {item.location}
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                                {item.type}
                              </span>
                            </div>
                          </div>

                          {item.bullets && item.bullets.length > 0 && (
                            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                              {item.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                  <span className="break-words">{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {item.technologies && item.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {item.technologies.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2.5 py-0.5 rounded-lg bg-muted text-foreground text-xs font-medium border border-border/60"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Education Subsection */}
            {(activeTab === "all" || activeTab === "education") && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                      Education
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Degrees, academic institutions, and coursework
                    </p>
                  </div>
                </div>

                {initialEducation.length === 0 ? (
                  <div className="py-8 text-center rounded-2xl bg-card border border-dashed border-border p-6 text-xs sm:text-sm text-muted-foreground">
                    No education history added yet.
                  </div>
                ) : (
                  <div className="relative pl-6 sm:pl-8 space-y-8">
                    <div className="absolute left-3 sm:left-4 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30" />

                    {initialEducation.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="relative group min-w-0"
                      >
                        <div className="absolute -left-[22px] sm:-left-[26px] top-2 flex items-center justify-center">
                          <div className="h-5 w-5 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-sm">
                            <div className="h-2 w-2 rounded-full bg-accent" />
                          </div>
                        </div>

                        <div className="p-5 sm:p-6 lg:p-8 rounded-2xl bg-card border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-md transition-all space-y-4 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-heading font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors break-words">
                                  {item.degree}
                                </h4>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                                  {item.status}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                {item.institution}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border">
                                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                {item.duration}
                              </span>
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border">
                                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                                {item.location}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-muted-foreground break-words">{item.description}</p>

                          {item.courses && item.courses.length > 0 && (
                            <div className="pt-1 space-y-1.5">
                              <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>Coursework:</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {item.courses.map((course, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="px-2.5 py-0.5 rounded-lg bg-muted text-foreground text-xs font-medium border border-border/60"
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certifications Subsection */}
            {(activeTab === "all" || activeTab === "certifications") && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                      Certifications
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Verified professional credentials and specialized training
                    </p>
                  </div>
                </div>

                {initialCertifications.length === 0 ? (
                  <div className="py-8 text-center rounded-2xl bg-card border border-dashed border-border p-6 text-xs sm:text-sm text-muted-foreground">
                    No certifications added yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {initialCertifications.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group min-w-0"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                              {item.issuer}
                            </span>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>

                          <h4 className="font-heading font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors break-words">
                            {item.title}
                          </h4>

                          {item.skills && item.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {item.skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {item.credentialUrl && (
                          <div className="pt-2 border-t border-border/60">
                            <a
                              href={item.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline min-h-[44px]"
                            >
                              <span>Verify Credential</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
