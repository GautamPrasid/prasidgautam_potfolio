"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CertificationItem } from "@/lib/data";
import { getCertificationsFromDb } from "@/lib/supabase-db";
import { Award, ExternalLink, Calendar, CheckSquare } from "lucide-react";

export interface CertificationsSectionProps {
  initialCertifications?: CertificationItem[];
}

export function CertificationsSection({
  initialCertifications = [],
}: CertificationsSectionProps = {}) {
  const [certifications, setCertifications] = useState<CertificationItem[]>(initialCertifications);

  useEffect(() => {
    if (initialCertifications && initialCertifications.length > 0) {
      setCertifications(initialCertifications);
    }
  }, [initialCertifications]);

  useEffect(() => {
    if (initialCertifications && initialCertifications.length > 0) return;
    let active = true;
    async function fetchCerts() {
      const data = await getCertificationsFromDb();
      if (active) {
        setCertifications(data ?? []);
      }
    }
    fetchCerts();
    return () => {
      active = false;
    };
  }, [initialCertifications]);

  const safeCerts = certifications ?? [];

  return (
    <section
      id="certifications"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
      aria-label="Certifications Section"
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
            Credentials &amp; Learning
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Certifications &amp; Licenses
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Professional development certificates earned across industry-leading platforms.
          </p>
        </div>

        {/* Certifications Grid (1 col mobile, 2 cols tablet, 2-4 cols desktop) */}
        {safeCerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            suppressHydrationWarning
            className="py-16 px-8 text-center rounded-3xl bg-card/60 border border-dashed border-border/80 max-w-lg mx-auto backdrop-blur-sm space-y-3"
          >
            <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 w-fit mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground">
              No Certifications Added Yet
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Certifications, licenses, and verified credentials will appear here once published.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {safeCerts.map((cert: CertificationItem, idx: number) => {

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                suppressHydrationWarning
                className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Decorative Gradient Accent Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
                    cert.issuerColor || "from-primary to-accent"
                  }`}
                />

                <div className="space-y-4 pt-1">
                  {/* Issuer & Date Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        {cert.issuer}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{cert.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors leading-snug">
                    {cert.title}
                  </h3>

                  {/* Skills Covered Pills */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-primary" /> Core Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-0.5 rounded-md bg-muted/70 text-foreground text-xs font-medium border border-border/40"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* View Certificate Action Button */}
                <div className="pt-6 border-t border-border/60 mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">
                    Verified Credential
                  </span>
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-foreground transition-all duration-200 group/link"
                  >
                    <span>View Certificate</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
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

// Export alias for Certifications
export { CertificationsSection as Certifications };
