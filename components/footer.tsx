"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Code2,
  Heart,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocialLinksFromDb } from "@/lib/supabase-db";
import { SocialLinkItem } from "@/lib/data";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

export interface FooterProps {
  initialSocialLinks?: SocialLinkItem[];
  siteName?: string;
  bio?: string;
  location?: string;
  availabilityText?: string;
  footerText?: string;
  connectHeading?: string;
  ctaHeading?: string;
  ctaSubtext?: string;
}

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Resume", href: "#resume" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Footer({
  initialSocialLinks = [],
  siteName,
  bio,
  location,
  availabilityText,
  footerText,
  connectHeading,
  ctaHeading,
  ctaSubtext,
}: FooterProps = {}) {
  const pathname = usePathname();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(initialSocialLinks);

  useEffect(() => {
    if (initialSocialLinks?.length) setSocialLinks(initialSocialLinks);
  }, [initialSocialLinks]);

  useEffect(() => {
    if (initialSocialLinks?.length) return;
    let active = true;
    getSocialLinksFromDb().then((links) => {
      if (active) setSocialLinks(links ?? []);
    }).catch(() => {
      if (active) setSocialLinks([]);
    });
    return () => {
      active = false;
    };
  }, [initialSocialLinks]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (pathname === "/" || pathname === undefined) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (pathname?.startsWith("/admin")) return null;

  const currentYear = new Date().getFullYear();
  const brandName = siteName || "Prasid Gautam | Portfolio";

  return (
    <footer className="relative isolate mt-20 overflow-hidden border-t border-border/70 bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-72 w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {/* Contact callout */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.12] via-card/90 to-card p-6 shadow-sm sm:mb-14 sm:p-8 lg:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Open to opportunities
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                {ctaHeading || "Have an idea? Let’s build something useful."}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                {ctaSubtext || "I’m always happy to connect, discuss a project, or explore a new opportunity."}
              </p>
            </div>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Let’s connect
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 border-b border-border/70 pb-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:pb-12">
          <div className="space-y-5 md:col-span-2 lg:col-span-5">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, "#home")}
              aria-label="Go to homepage"
              className="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
                <Code2 className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {brandName}<span className="text-primary">.</span>
              </span>
            </a>
            {bio && (
              <p className="max-w-md text-sm leading-7 text-muted-foreground">
                {bio}
              </p>
            )}
            {availabilityText && (
              <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3.5 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>{availabilityText}</span>
              </div>
            )}
          </div>

          <nav aria-label="Footer navigation" className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-foreground">
              Explore
            </h3>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="group inline-flex min-h-10 items-center gap-1.5 rounded-md py-2 pr-2 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-70" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-foreground">
              {connectHeading || "Find me online"}
            </h3>
            {socialLinks.length > 0 ? (
              <ul className="flex flex-wrap gap-2.5">
                {socialLinks.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${social.platform} (opens in a new tab)`}
                      className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/80 bg-card/70 px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.08] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <DynamicIcon name={social.iconName} className="h-4 w-4 shrink-0" />
                      <span>{social.platform}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Social links will appear here soon.</p>
            )}
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Prefer email?{" "}
              <a href="mailto:gprasid10@gmail.com" className="font-medium text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Get in touch
              </a>
            </p>
          </div>
        </div>

        {/* Copyright and utility links */}
        <div className="flex flex-col gap-4 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:pt-7">
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center sm:justify-start">
            <span>© {currentYear} {brandName}</span>
            <span aria-hidden="true" className="text-border">/</span>
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" aria-label="love" />
            {location && <span>in {location}</span>}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
            {footerText && <span>{footerText}</span>}
            <button
              onClick={scrollToTop}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Scroll back to top"
            >
              Back to top <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-5 right-4 z-40 flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-6 sm:right-6"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
