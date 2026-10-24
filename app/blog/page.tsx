import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogsFromDb, getHeroAboutFromDb, getSiteSettingsFromDb } from "@/lib/supabase-db";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, hero] = await Promise.all([getSiteSettingsFromDb(), getHeroAboutFromDb()]);
  const author = hero?.name?.trim() || siteSettings?.siteName?.trim() || "Portfolio";
  return {
    title: `Blog & Articles | ${author}`,
    description: `Explore engineering tutorials, software architecture guides, and technical insights by ${author}.`,
  };
}

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatBlogDate(dateStr?: string): string {
  if (!dateStr) return "Published";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getUTCFullYear();
    const month = SHORT_MONTHS[d.getUTCMonth()];
    const day = d.getUTCDate();
    return `${month} ${day}, ${year}`;
  } catch {
    return dateStr;
  }
}

export default async function BlogArchivePage() {
  const blogs = await getBlogsFromDb();
  const publishedBlogs = blogs.filter((b) => b.published !== false);

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation & Header */}
        <div className="space-y-6">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-border/80 hover:border-primary/50 text-foreground hover:text-primary text-sm font-semibold shadow-sm hover:shadow-md transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home Portfolio</span>
          </Link>

          <div className="space-y-3">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 inline-block uppercase">
              Articles & Guides
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              All Blog Articles
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-3xl">
              A comprehensive library of technical articles, architectural patterns, and practical guides on full-stack web development and software engineering.
            </p>
          </div>
        </div>

        {/* Grid of articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {publishedBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug || blog.id}`}
              className="p-5 sm:p-6 rounded-3xl bg-card border border-border/80 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-muted">
                  {blog.coverImage ? (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/20 to-card flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-background/90 backdrop-blur-md text-primary border border-border shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{formatBlogDate(blog.publishedAt)}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                    {blog.readTime}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-border/60 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {blog.tags.slice(0, 2).map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground text-xs font-semibold transition-all duration-300 shrink-0">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
