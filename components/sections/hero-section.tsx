"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, User } from "lucide-react";
import { getHeroAboutFromDb, getSocialLinksFromDb, HeroAboutData } from "@/lib/supabase-db";
import { SocialLinkItem } from "@/lib/data";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

export interface HeroSectionProps {
  initialHeroData?: HeroAboutData | null;
  initialSocialLinks?: SocialLinkItem[];
}

export function HeroSection({
  initialHeroData = null,
  initialSocialLinks = [],
}: HeroSectionProps = {}) {
  const [heroData, setHeroData] = useState<HeroAboutData | null>(initialHeroData);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(initialSocialLinks);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (initialHeroData) {
      setHeroData(initialHeroData);
    }
  }, [initialHeroData]);

  useEffect(() => {
    if (initialSocialLinks && initialSocialLinks.length > 0) {
      setSocialLinks(initialSocialLinks);
    }
  }, [initialSocialLinks]);

  useEffect(() => {
    if (initialHeroData && initialSocialLinks.length > 0) return;
    let active = true;
    async function load() {
      const [hData, sLinks] = await Promise.all([
        getHeroAboutFromDb(),
        getSocialLinksFromDb(),
      ]);
      if (active) {
        if (hData) setHeroData(hData);
        setSocialLinks(sLinks ?? []);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [initialHeroData, initialSocialLinks.length]);

  const roles = heroData?.roles && heroData.roles.length > 0 ? heroData.roles : [];

  useEffect(() => {
    if (roles.length <= 1) return;
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <section
      id="home"
      className="min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 scroll-mt-20 relative overflow-hidden"
      aria-label="Hero Section"
    >
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-56 h-56 sm:w-72 sm:h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        {/* Left Column: Text Intro & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6"
          suppressHydrationWarning
        >
          {/* Availability Pill */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-card border border-border shadow-sm text-xs sm:text-sm font-medium text-foreground">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="truncate">Available for new opportunities</span>
          </div>

          {/* Main Title & Typewriter Roles */}
          <div className="space-y-2.5 sm:space-y-3 w-full">
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Hi, I&apos;m <span className="text-primary">{heroData?.name}</span> 👋
            </h1>

            {roles.length > 0 && (
              <div className="h-9 sm:h-12 flex items-center justify-center lg:justify-start flex-wrap">
                <span className="text-lg sm:text-2xl lg:text-3xl font-semibold text-muted-foreground mr-2">
                  I am a
                </span>
                <div className="relative overflow-hidden inline-block text-left min-w-[160px] sm:min-w-[280px] max-w-full">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={roleIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent inline-block truncate max-w-full"
                    >
                      {roles[roleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Bio Paragraph */}
          {heroData?.bioText && (
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
              {heroData.bioText}
            </p>
          )}

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto pt-2">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 group min-h-[44px]"
            >
              <span>View Projects</span>
              <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-card border border-border text-foreground font-semibold hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group min-h-[44px]"
            >
              <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              <span>Contact Me</span>
            </a>
          </div>

          {/* Social Icon Row */}
          <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
            {heroData?.connectHeading && (
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hidden sm:inline">
                {heroData.connectHeading}:
              </span>
            )}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => (
                  <motion.a
                    key={social.id}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="p-3 rounded-2xl bg-card border border-border text-foreground hover:text-primary hover:border-primary/50 shadow-sm transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <DynamicIcon name={social.iconName} className="w-5 h-5" />
                  </motion.a>
                ))
              ) : (
                <>
                  {heroData?.githubUrl && (
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href={heroData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile"
                      className="p-3 rounded-2xl bg-card border border-border text-foreground hover:text-primary hover:border-primary/50 shadow-sm transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <DynamicIcon name="Github" className="w-5 h-5" />
                    </motion.a>
                  )}
                  {heroData?.contactEmail && (
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href={`mailto:${heroData.contactEmail}`}
                      aria-label="Send Email"
                      className="p-3 rounded-2xl bg-card border border-border text-foreground hover:text-primary hover:border-primary/50 shadow-sm transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Mail className="w-5 h-5" />
                    </motion.a>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Profile Photo with Animated Blur Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center items-center pt-4 lg:pt-0"
          suppressHydrationWarning
        >
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 group">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-75 blur-xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

            <div className="relative w-full h-full rounded-full p-2 bg-card border-2 border-border/80 shadow-2xl overflow-hidden flex items-center justify-center">
              {heroData?.profileImageUrl ? (
                <Image
                  src={heroData.profileImageUrl}
                  alt={heroData?.name ? `${heroData.name} profile photo` : "Profile photo"}
                  fill
                  unoptimized
                  priority
                  className="rounded-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-muted/60 flex flex-col items-center justify-center text-muted-foreground/60 select-none p-4 text-center space-y-1">
                  <User className="w-14 h-14 sm:w-20 sm:h-20 text-muted-foreground/40 stroke-[1.5]" />
                  <span className="text-xs font-medium uppercase tracking-wider opacity-60">
                    No Profile Photo
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { HeroSection as Hero };
