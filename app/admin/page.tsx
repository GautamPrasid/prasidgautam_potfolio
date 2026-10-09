"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderGit2,
  BookOpen,
  Wrench,
  Award,
  ArrowRight,
  User,
  GraduationCap,
  Briefcase,
  Share2,
  Mail,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-db";

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState({
    projects: 0,
    blogs: 0,
    skills: 0,
    certifications: 0,
    messages: 0,
  });

  useEffect(() => {
    let active = true;
    async function loadCounts() {
      const client = getSupabaseClient();
      if (!client) return;

      try {
        const [proj, blg, skl, cert, msg] = await Promise.all([
          client.from("projects").select("*", { count: "exact", head: true }),
          client.from("blogs").select("*", { count: "exact", head: true }),
          client.from("skills").select("*", { count: "exact", head: true }),
          client.from("certifications").select("*", { count: "exact", head: true }),
          client.from("messages").select("*", { count: "exact", head: true }),
        ]);

        if (active) {
          setCounts({
            projects: proj.count ?? 0,
            blogs: blg.count ?? 0,
            skills: skl.count ?? 0,
            certifications: cert.count ?? 0,
            messages: msg.count ?? 0,
          });
        }
      } catch {
        // default 0
      }
    }
    loadCounts();
    return () => {
      active = false;
    };
  }, []);

  const metrics = [
    {
      title: "Projects",
      count: counts.projects,
      label: "Featured Work",
      href: "/admin/projects",
      icon: FolderGit2,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Blogs",
      count: counts.blogs,
      label: "Published Articles",
      href: "/admin/blogs",
      icon: BookOpen,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Skills",
      count: counts.skills,
      label: "Technologies & Soft Skills",
      href: "/admin/skills",
      icon: Wrench,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Certifications",
      count: counts.certifications,
      label: "Verified Credentials",
      href: "/admin/certifications",
      icon: Award,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  const quickLinks = [
    { title: "Hero & About", desc: "Edit name, roles, bio & stats", href: "/admin/hero", icon: User },
    { title: "Skills Manager", desc: "Add, edit or reorder skills", href: "/admin/skills", icon: Wrench },
    { title: "Projects Showcase", desc: "Manage GitHub & demo links", href: "/admin/projects", icon: FolderGit2 },
    { title: "Education History", desc: "Update degrees & coursework", href: "/admin/education", icon: GraduationCap },
    { title: "Experience & Roles", desc: "Manage career & hackathons", href: "/admin/experience", icon: Briefcase },
    { title: "Certifications", desc: "Upload badge credentials", href: "/admin/certifications", icon: Award },
    { title: "Blogs CMS", desc: "Write articles & tutorials", href: "/admin/blogs", icon: BookOpen },
    { title: "Social Links", desc: "Manage header/footer profiles", href: "/admin/social-links", icon: Share2 },
    { title: "Messages Inbox", desc: "View contact form submissions", href: "/admin/messages", icon: Mail },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your portfolio content, view contact inquiries, and update section details.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.title}
              href={m.href}
              className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex items-center justify-between group"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {m.title}
                </p>
                <p className="font-heading text-3xl font-extrabold text-foreground">
                  {m.count}
                </p>
                <p className="text-[11px] text-muted-foreground">{m.label}</p>
              </div>
              <div className={`p-3.5 rounded-2xl border ${m.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Links Grid */}
      <div className="space-y-4 pt-4">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Content Managers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-sm hover:shadow-md transition-all flex items-start justify-between group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {link.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
