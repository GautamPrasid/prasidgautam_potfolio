"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  Code2,
  Mail,
  Phone,
  MapPin,
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
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  quickLinks?: { label: string; href: string }[];
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
  contactEmail,
  contactPhone,
  logoUrl,
  quickLinks,
}: FooterProps = {}) {
  const pathname = usePathname();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(initialSocialLinks);

  useEffect(() => {
    if (initialSocialLinks?.length) {
      setSocialLinks(initialSocialLinks);
    }
  }, [initialSocialLinks]);

  useEffect(() => {
    if (initialSocialLinks?.length) return;
    let active = true;
    getSocialLinksFromDb()
      .then((links) => {
        if (active && links) setSocialLinks(links);
      })
      .catch(() => {
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

  const hasTopBand = Boolean(siteName || bio || availabilityText || connectHeading || contactEmail);
  const hasSocialLinks = socialLinks.length > 0;
  const hasDirectContact = Boolean(contactEmail || contactPhone || location);
  const hasConnectColumn = hasSocialLinks || hasDirectContact;
  const locationInConnect = Boolean(hasConnectColumn && location);

  return (
    <footer className="relative isolate mt-20 overflow-hidden border-t border-border/70 bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-72 w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-8">
          {/* 1. Top band: rounded card with a faint indigo gradient and border */}
          {hasTopBand && (
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-card/85 to-card p-6 shadow-sm sm:p-8 lg:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl"
              />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: site name (logo + name), short bio clamped to 3 lines, availability pill */}
                <div className="max-w-2xl space-y-3.5">
                  {(siteName || logoUrl) && (
                    <a
                      href="#home"
                      onClick={(e) => scrollToSection(e, "#home")}
                      className="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={siteName ? `Go to homepage, ${siteName}` : "Go to homepage"}
                    >
                      {logoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={logoUrl}
                          alt={siteName || "Logo"}
                          className="h-10 w-10 rounded-xl object-contain border border-border/60 bg-background/50 p-1"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary transition-all duration-200 group-hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground motion-reduce:transition-none">
                          <Code2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                      {siteName && (
                        <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                          {siteName}
                          <span className="text-primary">.</span>
                        </span>
                      )}
                    </a>
                  )}

                  {bio && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {bio}
                    </p>
                  )}

                  {availabilityText && (
                    <div>
                      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="truncate">{availabilityText}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: connect_heading and Contact Me mailto button */}
                {(connectHeading || contactEmail) && (
                  <div className="flex flex-col items-start gap-4 lg:items-end lg:text-right shrink-0">
                    {connectHeading && (
                      <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl lg:max-w-md">
                        {connectHeading}
                      </h2>
                    )}
                    {contactEmail && (
                      <a
                        href={`mailto:${contactEmail}`}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
                      >
                        <span>Contact Me</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Link grid, 12-column */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Navigation: all section links in a clean 2-column grid */}
            <div className={hasConnectColumn ? "md:col-span-6 lg:col-span-5" : "md:col-span-12 max-w-md"}>
              <nav aria-label="Footer navigation">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
                  Navigation
                </h3>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {(quickLinks ?? QUICK_LINKS).map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className="group inline-flex min-h-[36px] items-center gap-2 rounded-md py-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-primary/30 transition-all duration-200 group-hover:w-3 group-hover:bg-primary motion-reduce:transition-none"
                        />
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none">
                          {link.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Connect: social links + email, phone, location */}
            {hasConnectColumn && (
              <div className="space-y-5 md:col-span-6 lg:col-span-7">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Connect
                </h3>

                {hasSocialLinks && (
                  <ul className="flex flex-wrap gap-2.5" aria-label="Social profiles">
                    {socialLinks.map((social) => (
                      <li key={social.id}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.platform}
                          className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-card/60 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.08] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transform-none"
                        >
                          <DynamicIcon name={social.iconName} className="h-4.5 w-4.5 shrink-0" />
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-popover px-2 py-0.5 text-[11px] font-medium text-popover-foreground shadow-md opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 whitespace-nowrap border border-border/50 z-20"
                          >
                            {social.platform}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {hasDirectContact && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {contactEmail && (
                      <li>
                        <a
                          href={`mailto:${contactEmail}`}
                          className="group inline-flex items-center gap-2.5 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          <Mail className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors duration-200" aria-hidden="true" />
                          <span className="truncate">{contactEmail}</span>
                        </a>
                      </li>
                    )}
                    {contactPhone && (
                      <li>
                        <a
                          href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                          className="group inline-flex items-center gap-2.5 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors duration-200" aria-hidden="true" />
                          <span>{contactPhone}</span>
                        </a>
                      </li>
                    )}
                    {location && (
                      <li className="inline-flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <span>{location}</span>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* 3. Divider: 1px gradient line */}
          <div
            aria-hidden="true"
            className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />

          {/* 4. Bottom bar */}
          <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center sm:text-left">
              {siteName ? `© ${currentYear} ${siteName}` : `© ${currentYear}`}
              {footerText ? ` · ${footerText}` : ""}
              {!locationInConnect && location ? ` · ${location}` : ""}
            </p>

            <div className="flex items-center justify-center sm:justify-end">
              <button
                onClick={scrollToTop}
                className="group inline-flex min-h-[36px] items-center gap-1.5 font-medium text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
              >
                <span>Back to top</span>
                <ArrowUp className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating back-to-top button (scroll-activated) */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-5 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none sm:bottom-6 sm:right-6"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
