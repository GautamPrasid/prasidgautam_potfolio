import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getBlogBySlug, getBlogsFromDb } from "@/lib/supabase-db";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  BookOpen,
  ArrowRight,
  Home,
  ShieldAlert,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function isUserAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    return Boolean(admin);
  } catch {
    return false;
  }
}

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const FULL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatBlogDate(dateStr?: string, full = true): string {
  if (!dateStr) return "Recently Published";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getUTCFullYear();
    const month = (full ? FULL_MONTHS : SHORT_MONTHS)[d.getUTCMonth()];
    const day = d.getUTCDate();
    return `${month} ${day}, ${year}`;
  } catch {
    return dateStr;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  const isAdmin = await isUserAdmin();
  if (!blog || (blog.published === false && !isAdmin)) {
    return {
      title: "Article Not Found | Blog",
    };
  }

  return {
    title: `${blog.published ? "" : "[Draft Preview] "}${blog.title}`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.publishedAt,
      tags: blog.tags,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const blog = await getBlogBySlug(params.slug);
  const isAdmin = await isUserAdmin();

  if (!blog || (blog.published === false && !isAdmin)) {
    notFound();
  }

  const allBlogs = await getBlogsFromDb();
  const otherBlogs = allBlogs
    .filter((b) => b.published !== false && b.id !== blog.id && b.slug !== blog.slug)
    .slice(0, 2);

  return (
    <article className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        {/* Admin Draft Banner */}
        {blog.published === false && isAdmin && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                Admin Preview Mode
              </span>
              <span>This article is unpublished (Draft) and only visible to administrators. Public visitors will see a 404.</span>
            </div>
            <Link
              href="/admin/blogs"
              className="underline text-xs hover:text-amber-500 font-semibold shrink-0"
            >
              Back to CMS
            </Link>
          </div>
        )}
        {/* ── Navigation / Back Bar ──────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-border/80 hover:border-primary/50 text-foreground hover:text-primary text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Articles</span>
          </Link>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/#blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {blog.category}
            </span>
          </nav>
        </div>

        {/* ── Header: Meta & Title ───────────────────────────────── */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-sm uppercase tracking-wider">
              {blog.category}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" />
              {blog.readTime}
            </span>
            {blog.publishedAt && (
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                {formatBlogDate(blog.publishedAt, true)}
              </span>
            )}
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground leading-[1.15] tracking-tight">
            {blog.title}
          </h1>
        </header>

        {/* ── Cover Image ────────────────────────────────────────── */}
        {blog.coverImage ? (
          <div className="relative w-full h-64 sm:h-96 md:h-[440px] rounded-3xl overflow-hidden bg-muted shadow-xl border border-border/60">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-64 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/15 to-card border border-border flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/40" />
          </div>
        )}

        {/* ── Excerpt Callout ────────────────────────────────────── */}
        {blog.excerpt && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border-l-4 border-primary text-base sm:text-lg italic text-foreground/90 leading-relaxed shadow-sm">
            <BookOpen className="w-5 h-5 text-primary mb-2 not-italic inline-block mr-2" />
            {blog.excerpt}
          </div>
        )}

        {/* ── Main Article Body ──────────────────────────────────── */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground text-base sm:text-lg leading-relaxed space-y-6 whitespace-pre-wrap">
          {blog.content}
        </div>

        {/* ── Tags Section ───────────────────────────────────────── */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-6 border-t border-border flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Tags:
            </span>
            {blog.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-card text-foreground text-xs font-medium border border-border/80 shadow-sm"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* ── Footer Navigation & Related Articles ───────────────── */}
        <footer className="pt-10 border-t border-border space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/#blog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </Link>

            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Return to Portfolio Home →
            </Link>
          </div>

          {/* More Articles */}
          {otherBlogs.length > 0 && (
            <div className="pt-8 border-t border-border/60 space-y-4">
              <h3 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Continue Reading</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherBlogs.map((other) => (
                  <Link
                    key={other.id}
                    href={`/blog/${other.slug || other.id}`}
                    className="group p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-sm hover:shadow-md transition-all flex gap-4 items-center"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                      {other.coverImage ? (
                        <Image
                          src={other.coverImage}
                          alt={other.title}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                        {other.category}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {other.title}
                      </h4>
                      <span className="text-[11px] text-muted-foreground mt-0.5 block">
                        {other.readTime}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </footer>
      </div>
    </article>
  );
}
