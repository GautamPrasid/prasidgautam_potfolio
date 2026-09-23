"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocialLinksFromDb } from "@/lib/supabase-db";
import { SocialLinkItem } from "@/lib/data";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

export interface FooterProps {
  initialSocialLinks?: SocialLinkItem[];
}

export function Footer({ initialSocialLinks = [] }: FooterProps = {}) {
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
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <footer className="relative bg-card border-t border-border mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-between gap-8 md:flex-row">
        {/* Left Side: Brand & Credit */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <span className="font-heading font-bold text-xl tracking-tight text-foreground">
            Portfolio<span className="text-primary">.</span>
          </span>
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              Next.js
            </a>{" "}
            &amp;{" "}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              Tailwind CSS
            </a>
            .
          </p>
        </div>

        {/* Center: Dynamic Social Media Links (Omitted if empty) */}
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${social.platform}`}
                className="p-2.5 rounded-xl bg-muted/60 hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <DynamicIcon name={social.iconName} className="w-5 h-5" />
              </a>
            ))}
          </div>
        )}

        {/* Right Side: Copyright */}
        <div className="text-sm text-muted-foreground text-center md:text-right">
          &copy; {new Date().getFullYear()} All rights reserved.
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
            className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring z-40 transition-all duration-200"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
