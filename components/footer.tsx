"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        {...props}
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        {...props}
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    href: "https://twitter.com",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        {...props}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        {...props}
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:hello@example.com",
    icon: Mail,
  },
];

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

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

        {/* Center: Social Media Links */}
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${social.name}`}
                className="p-2.5 rounded-xl bg-muted/60 hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

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
            className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring z-40 transition-all duration-200"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
