"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Download, Send } from "lucide-react";

const ROLES = [
  "Full-Stack Developer",
  "BCA Student",
  "Problem Solver",
];

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleHireMeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-20 relative overflow-hidden"
      aria-label="Hero Section"
    >
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Text Intro & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
        >
          {/* Availability Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border shadow-sm text-xs sm:text-sm font-medium text-foreground">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>Available for new opportunities</span>
          </div>

          {/* Main Title & Typewriter Roles */}
          <div className="space-y-3">
            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Hi, I&apos;m <span className="text-primary">Prasid Gautam</span> 👋
            </h1>

            <div className="h-10 sm:h-12 flex items-center justify-center lg:justify-start">
              <span className="text-xl sm:text-3xl font-semibold text-muted-foreground mr-2">
                I am a
              </span>
              <div className="relative overflow-hidden inline-block text-left min-w-[240px] sm:min-w-[320px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="font-heading text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent inline-block"
                  >
                    {ROLES[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bio Paragraph */}
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
            Passionate Full-Stack Developer and BCA student at La Grande International College.
            I craft modern, performant web applications with clean architecture and intuitive user experiences.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
            <a
              href="#contact"
              onClick={handleHireMeClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Hire Me</span>
              <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href="/resume/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Prasid_Gautam_Resume.pdf"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-card border border-border text-foreground font-semibold hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group"
            >
              <Download className="w-4 h-4 text-primary group-hover:-translate-y-0.5 transition-transform" />
              <span>Download Resume</span>
            </a>
          </div>

          {/* Social Icon Row */}
          <div className="pt-4 flex items-center gap-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hidden sm:inline">
              Connect:
            </span>
            <div className="flex items-center gap-3">
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-3 rounded-2xl bg-card border border-border text-foreground hover:text-primary hover:border-primary/50 shadow-sm transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-3 rounded-2xl bg-card border border-border text-foreground hover:text-primary hover:border-primary/50 shadow-sm transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:prasid.gautam@example.com"
                aria-label="Send Email"
                className="p-3 rounded-2xl bg-card border border-border text-foreground hover:text-primary hover:border-primary/50 shadow-sm transition-all"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Profile Photo with Animated Blur Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center items-center"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 group">
            {/* Animated Gradient Glow Ring */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-75 blur-xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

            {/* Inner Border Wrapper */}
            <div className="relative w-full h-full rounded-full p-2 bg-card border-2 border-border/80 shadow-2xl overflow-hidden">
              <Image
                src="/images/profile.jpg"
                alt="Prasid Gautam Profile"
                fill
                priority
                className="rounded-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Export alias for Hero
export { HeroSection as Hero };
