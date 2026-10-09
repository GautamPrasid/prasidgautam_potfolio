"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard,
  User,
  Wrench,
  GraduationCap,
  Briefcase,
  Award,
  FolderGit2,
  BookOpen,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Share2,
} from "lucide-react";

const ADMIN_NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Hero & About", href: "/admin/hero", icon: User },
  { label: "Skills", href: "/admin/skills", icon: Wrench },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Certifications", href: "/admin/certifications", icon: Award },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { label: "Social Links", href: "/admin/social-links", icon: Share2 },
  { label: "Messages Inbox", href: "/admin/messages", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Skip sidebar shell on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createBrowserClient(supabaseUrl, supabaseKey);
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-base text-foreground">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-foreground hover:bg-muted"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-card border-r border-border p-5 flex flex-col justify-between transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:h-screen`}
      >
        <div className="space-y-6">
          {/* Sidebar Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-border">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-foreground">
                Portfolio CMS
              </h2>
              <p className="text-[10px] text-muted-foreground">Admin Workspace</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-4 border-t border-border space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium bg-muted/60 text-foreground hover:bg-muted transition-colors"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
