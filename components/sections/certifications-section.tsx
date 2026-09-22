"use client";

import { motion } from "framer-motion";

export function CertificationsSection() {
  return (
    <section
      id="certifications"
      className="min-h-[60vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20 border-t border-border/40"
      aria-label="Certifications Section"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center space-y-4"
      >
        <h2 className="font-heading text-3xl sm:text-5xl font-bold text-foreground">
          Certifications &amp; Licenses
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Certifications section placeholder — professional certificates, credentials, and achievements.
        </p>
      </motion.div>
    </section>
  );
}
