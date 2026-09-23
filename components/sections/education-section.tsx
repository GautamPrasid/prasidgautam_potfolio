"use client";

import { motion } from "framer-motion";
import { EDUCATION_DATA, EducationItem } from "@/lib/data";
import { GraduationCap, Calendar, MapPin, BookOpen } from "lucide-react";

export function EducationSection() {
  return (
    <section
      id="education"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-20"
      aria-label="Education Section"
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
            Academic Background
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Education Journey
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            My academic progression, degree specializations, and foundational coursework.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 md:pl-10 space-y-12">
          {/* Animated Connecting Vertical Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute left-3 sm:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30 origin-top"
          />

          {EDUCATION_DATA.map((item: EducationItem, idx: number) => {
            const isEnrolled = item.status === "Enrolled";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative group"
              >
                {/* Timeline Pulsing Node Circle */}
                <div className="absolute -left-[31px] sm:-left-[35px] md:-left-[39px] top-1.5 flex items-center justify-center">
                  <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-card border-2 border-primary shadow-md">
                    {isEnrolled && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
                    )}
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isEnrolled ? "bg-primary" : "bg-accent"
                      }`}
                    />
                  </div>
                </div>

                {/* Main Card Content */}
                <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
                  {/* Top Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors">
                          {item.degree}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                            isEnrolled
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                        <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                        <span>{item.institution}</span>
                      </div>
                    </div>

                    {/* Metadata Badges (Duration & Location) */}
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

                  {/* Description Paragraph */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Key Coursework Tags */}
                  {item.courses && item.courses.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        <span>Key Coursework &amp; Modules:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.courses.map((course, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-3 py-1 rounded-xl bg-muted/80 text-foreground text-xs font-medium border border-border/60 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// Export alias for Education
export { EducationSection as Education };
