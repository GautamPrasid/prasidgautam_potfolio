"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, Code2, ArrowUpRight, Heart, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocialLinksFromDb } from "@/lib/supabase-db";
import { SocialLinkItem } from "@/lib/data";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

export interface FooterProps {
  initialSocialLinks?: SocialLinkItem[];
  siteName?: string;
  bio?: string;
  location?: string;
}

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export function Footer({ initialSocialLinks = [], siteName, bio }: FooterProps = {}) {
  const pathname = usePathname();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(initialSocialLinks);

  useEffect(() => {
    if (initialSocialLinks && initialSocialLinks.length > 0) {
      setSocialLinks(initialSocialLinks);
    }
  }, [initialSocialLinks]);

  useEffect(() => {
    if (initialSocialLinks && initialSocialLinks.length > 0) return;
    let active = true;
    getSocialLinksFromDb().then((links) => {
      if (active) setSocialLinks(links ?? []);
    });
    return () => {
      active = false;
    };
  }, [initialSocialLinks]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Do not render public footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card/60 backdrop-blur-xl border-t border-border/70 mt-28 overflow-hidden transition-colors duration-300">
      {/* Top Ambient Glow / Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-24 bg-primary/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-border/60">
          {/* Column 1: Brand & Bio & Live Status (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, "#home")}
              className="inline-flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl p-1 -ml-1"
              aria-label="Home page"
            >
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20 transition-all duration-300">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                {siteName || "Prasid Gautam"}<span className="text-primary">.</span>
              </span>
            </a>

            {bio && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {bio}
              </p>
            )}

            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Available for freelance &amp; full-time opportunities
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </p>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors py-1 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect & CTA Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Let&apos;s Connect
            </p>

            {/* Dynamic Social Links */}
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.platform}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 hover:bg-primary hover:text-primary-foreground border border-border/60 hover:border-primary text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <DynamicIcon name={social.iconName} className="w-4 h-4" />
                    <span>{social.platform}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Follow and connect on social platforms.
              </p>
            )}

            {/* Quick Contact CTA Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-primary/10 border border-primary/20 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Have a project in mind?
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Let&apos;s discuss how I can help.
                </p>
              </div>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 transition-all duration-200 shrink-0"
              >
                <span>Chat</span>
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1 text-center sm:text-left">
            &copy; {currentYear} Prasid Gautam. Made with{" "}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" /> in Nepal.
          </p>

          <div className="flex items-center gap-4">
            <span>
              Built with Next.js &amp; Tailwind CSS
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1 py-0.5"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            suppressHydrationWarning
            className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring z-40 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary/25"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
