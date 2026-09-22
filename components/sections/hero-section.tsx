"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20"
      aria-label="Hero Section"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center space-y-6"
      >
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 inline-block">
          Welcome to my portfolio
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight">
          Hero Section Placeholder
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          This section will contain the hero headline, interactive intro, CTA buttons, and resume download link.
        </p>
      </motion.div>
    </section>
  );
}
