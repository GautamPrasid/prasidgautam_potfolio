"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [activeSection, setActiveSection] = useState<string>("home");

  // Track active section with IntersectionObserver
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - HEADER_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Mobile: Bottom Navigation Bar */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.5rem)",
        }}
        aria-label="Section Navigation"
      >
        <div className="mx-2 mb-2 px-2 py-2.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl">
          <div className="flex items-center justify-around gap-1 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => {
              const Icon = SECTION_ICONS[item.id as keyof typeof SECTION_ICONS];
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex flex-col items-center justify-center min-w-[60px] min-h-[56px] px-2 py-2 rounded-xl transition-colors flex-shrink-0"
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-section"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-medium truncate max-w-[56px] transition-colors ${
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

      {/* Desktop: Left Sidebar - Only show on very large screens */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-30"
        aria-label="Section Navigation"
      >
        <div className="flex flex-col gap-3 px-3 py-4 rounded-2xl bg-card border border-border shadow-xl">
          {NAV_ITEMS.map((item) => {
            const Icon = SECTION_ICONS[item.id as keyof typeof SECTION_ICONS];
            const isActive = activeSection === item.id;

            return (
              <div key={item.id} className="relative group">
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl transition-all hover:scale-110"
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-section"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 relative z-10 transition-colors ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                </a>

                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-popover border border-border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap">
                  <span className="text-sm font-medium text-popover-foreground">
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
