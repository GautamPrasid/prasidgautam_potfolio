"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, Code2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Resume", href: "#resume", id: "resume" },
  { label: "Blog", href: "#blog", id: "blog" },
  { label: "Contact", href: "#contact", id: "contact" },
];

/** Height of the sticky header in px — used to correct scrollIntoView offset. */
const HEADER_HEIGHT = 64;

/** Tailwind lg = 1024px — desktop nav breakpoint */
const DESKTOP_BREAKPOINT = 1024;

export function Navbar({ siteName }: { siteName?: string }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionElements = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => sectionElements.forEach((el) => observer.unobserve(el));
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpenRef.current) closeMenu();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT && isOpenRef.current) {
        closeMenu();
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [closeMenu]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const scrollToSection = useCallback((id: string) => {
    // Use rAF to ensure DOM has settled (important after drawer close animation)
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (!element) return;
      const top =
        element.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "instant" : "smooth" });
    });
  }, [prefersReducedMotion]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const menuWasOpen = isOpenRef.current;
      closeMenu();
      // On mobile: wait for drawer slide-out before scrolling so scroll target is correct
      if (menuWasOpen) {
        setTimeout(() => scrollToSection(id), 50);
      } else {
        scrollToSection(id);
      }
    },
    [closeMenu, scrollToSection]
  );

  if (pathname?.startsWith("/admin")) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const drawerVariants = {
    hidden: { x: prefersReducedMotion ? 0 : "100%", opacity: prefersReducedMotion ? 0 : 1 },
    visible: { x: 0, opacity: 1 },
  };
  const drawerTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, damping: 25, stiffness: 200 };

  return (
    <>
      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/60 shadow-sm"
            : "bg-background/40 backdrop-blur-sm border-b border-transparent"
        }`}
        style={{ paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
            aria-label="Home page"
          >
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">
              {siteName?.trim() || "Portfolio"}
              <span className="text-primary">.</span>
            </span>
          </a>

          {/* Desktop links — visible at lg (≥1024px) */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 30 }
                      }
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
          </div>

          {/* Mobile/tablet controls — visible below lg (<1024px) */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="min-w-11 min-h-11 flex items-center justify-center rounded-xl text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile drawer + backdrop ────────────────────────────────────────
          IMPORTANT: Rendered as siblings of <header>, NOT inside it.
          The <header> has z-40 which creates a stacking context — any fixed
          children are clipped to that context and can appear under page
          content. By placing these here at the root level, their z-indexes
          (z-40 backdrop, z-50 drawer) are global and properly overlay all
          page elements. */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              onClick={closeMenu}
              suppressHydrationWarning
              className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              aria-hidden="true"
            />

            <motion.div
              key="drawer"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={drawerTransition}
              suppressHydrationWarning
              className="fixed right-0 top-16 bottom-0 w-72 max-w-[calc(100vw-2rem)] bg-card border-l border-border z-50 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto"
              style={{
                paddingRight: "env(safe-area-inset-right)",
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              <div className="flex flex-col gap-2 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1">
                  Navigation
                </p>
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className={`min-h-11 px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 flex items-center justify-between ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </a>
                  );
                })}
              </div>

              <div className="p-5 sm:p-6 pt-0 border-t border-border flex flex-col gap-3">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "contact")}
                  className="min-h-11 w-full py-3 text-center text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-200 flex items-center justify-center"
                >
                  Contact Me
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
