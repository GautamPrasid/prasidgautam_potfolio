"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Home, User, Wrench, FolderGit2, FileText, BookOpen, Mail } from "lucide-react";
import { NAV_ITEMS } from "@/components/navbar";

const HEADER_HEIGHT = 64;

const SECTION_ICONS = {
  home: Home,
  about: User,
  skills: Wrench,
  projects: FolderGit2,
  resume: FileText,
  blog: BookOpen,
  contact: Mail,
};

export function SectionNavigation() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string>("home");

  // Sync active section from window hash on initial mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.replace("#", "");
    if (hash && NAV_ITEMS.some((item) => item.id === hash)) {
      setActiveSection(hash);
      const timer = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - HEADER_HEIGHT;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen to hash changes (e.g. browser back/forward or external anchor clicks)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && NAV_ITEMS.some((item) => item.id === hash)) {
        setActiveSection(hash);
      } else if (!hash && window.scrollY < 120) {
        setActiveSection("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  // Scroll tracking to update active section as the user scrolls through the page
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = NAV_ITEMS.map((item) => item.id);
    let ticking = false;

    const updateOnScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 1. If at bottom of page, contact section is active
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection("contact");
        ticking = false;
        return;
      }

      // 2. If near top of page, home is active
      if (scrollY < 120) {
        setActiveSection("home");
        ticking = false;
        return;
      }

      // 3. Find the section currently in the viewport reading band (just below the sticky header)
      const targetLine = scrollY + HEADER_HEIGHT + 140;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY;
          if (top <= targetLine) {
            current = id;
          }
        }
      }

      setActiveSection(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateOnScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      if (pathname !== "/") {
        // Allow default browser link navigation to `/#${sectionId}` on non-home routes
        return;
      }

      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - HEADER_HEIGHT;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        setActiveSection(sectionId);
        if (window.location.hash !== `#${sectionId}`) {
          window.history.pushState(null, "", `#${sectionId}`);
        }
      }
    },
    [pathname]
  );

  // Hide entirely on admin dashboard pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Mobile: Bottom Navigation Bar */}
      <motion.nav
        initial={prefersReducedMotion ? false : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.5rem)",
        }}
        aria-label="Mobile Section Navigation"
      >
        <div className="mx-2 mb-2 px-2 py-2 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl pointer-events-auto">
          <div className="flex items-center justify-around gap-1 overflow-x-auto scrollbar-none">
            {NAV_ITEMS.map((item) => {
              const Icon = SECTION_ICONS[item.id as keyof typeof SECTION_ICONS];
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={pathname === "/" ? item.href : `/${item.href}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-2 py-1.5 rounded-xl transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-section"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", bounce: 0.15, duration: 0.5 }
                      }
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-[9px] font-medium truncate max-w-[52px] transition-colors ${
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Desktop & Tablet: Left Floating Vertical Sidebar */}
      <motion.nav
        initial={prefersReducedMotion ? false : { x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
        className="hidden lg:flex fixed left-3 xl:left-5 2xl:left-7 top-1/2 -translate-y-1/2 z-30"
        aria-label="Section Navigation"
      >
        <div className="flex flex-col gap-2 xl:gap-2.5 p-2 xl:p-2.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl">
          {NAV_ITEMS.map((item) => {
            const Icon = SECTION_ICONS[item.id as keyof typeof SECTION_ICONS];
            const isActive = activeSection === item.id;

            return (
              <div key={item.id} className="relative group">
                <a
                  href={pathname === "/" ? item.href : `/${item.href}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex items-center justify-center w-10 h-10 xl:w-11 xl:h-11 rounded-xl transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-section"
                      className="absolute inset-0 bg-primary rounded-xl shadow-md shadow-primary/30"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", bounce: 0.15, duration: 0.5 }
                      }
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 relative z-10 transition-colors duration-200 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                </a>

                {/* Tooltip */}
                <div
                  role="tooltip"
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-popover border border-border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50"
                >
                  <span className="text-xs font-semibold text-popover-foreground">
                    {item.label}
                  </span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
                </div>
              </div>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
