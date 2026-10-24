"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost } from "@/lib/data";
import { BLOG_CATEGORIES, DEFAULT_BLOGS } from "@/lib/data";
import type { SectionHeadingItem } from "@/lib/supabase-db";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  Newspaper,
  Sparkles,
} from "lucide-react";

const BLOGS_PER_PAGE = 3;
const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const FULL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatBlogDate(dateStr?: string, full = false): string {
  if (!dateStr) return full ? "Recently Published" : "Published";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const month = (full ? FULL_MONTHS : SHORT_MONTHS)[date.getUTCMonth()];
  return `${month} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export interface BlogSectionProps {
  initialBlogs?: BlogPost[];
  sectionContent?: SectionHeadingItem;
}

export function BlogSection({ initialBlogs = [], sectionContent }: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sourceBlogs = useMemo(
    () => (initialBlogs.length > 0 ? initialBlogs : DEFAULT_BLOGS),
    [initialBlogs],
  );
  const publishedBlogs = useMemo(
    () => sourceBlogs.filter((blog) => blog.published !== false),
    [sourceBlogs],
  );
  const filteredBlogs = useMemo(
    () =>
      selectedCategory === "All"
        ? publishedBlogs
        : publishedBlogs.filter((blog) => blog.category === selectedCategory),
    [publishedBlogs, selectedCategory],
  );
  const visibleBlogs = useMemo(
    () => filteredBlogs.slice(0, visibleCount),
    [filteredBlogs, visibleCount],
  );
  const categories = useMemo(() => ["All", ...BLOG_CATEGORIES], []);
  const hasMore = visibleCount < filteredBlogs.length;
  const remainingCount = filteredBlogs.length - visibleCount;

  useEffect(() => {
    setVisibleCount(BLOGS_PER_PAGE);
  }, [selectedCategory]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((count) => count + BLOGS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore]);

  const handleShowLess = useCallback(() => {
    setVisibleCount(BLOGS_PER_PAGE);
    document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="blog"
      aria-label="Blog Section"
      className="mx-auto w-full min-w-0 max-w-7xl scroll-mt-20 overflow-x-clip px-4 py-14 sm:px-6 sm:py-20 md:px-8 md:py-28"
    >
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-10 sm:space-y-12"
      >
        {/* Section Heading */}
        <div className="mx-auto w-full min-w-0 max-w-3xl space-y-3 text-center sm:space-y-4">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            {sectionContent?.badge || "Articles & Insights"}
          </span>
          <h2 className="break-words font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {sectionContent?.heading || "Latest from the Blog"}
          </h2>
          <p className="break-words text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
            {sectionContent?.subtext ||
              "Thoughts, engineering deep-dives, and tutorials on modern web development, architecture, and technology."}
          </p>
        </div>

        {/* Category Filters */}
        {publishedBlogs.length > 0 && (
          <div className="scrollbar-none flex w-full min-w-0 justify-start overflow-x-auto overscroll-x-contain py-2 sm:justify-center">
            <div className="inline-flex w-max min-w-max gap-1 rounded-2xl border border-border/80 bg-card p-1.5 shadow-sm">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative min-h-[44px] whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-4 sm:text-sm ${
                      isActive
                        ? "font-semibold text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeBlogCategoryTab"
                        className="absolute inset-0 rounded-xl bg-primary shadow-md"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Blog Cards Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="mx-auto max-w-md space-y-3 rounded-3xl border border-dashed border-border bg-card p-6 text-center sm:p-8 sm:py-16">
            <Newspaper className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
              No articles found in this category
            </h3>
            <p className="text-xs text-muted-foreground">
              Try switching back to &quot;All&quot; to see all published articles.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visibleBlogs.map((blog, idx) => {
                  const articleHref = `/blog/${blog.slug || blog.id}`;

                  return (
                    <motion.article
                      key={blog.id}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{
                        duration: 0.4,
                        delay:
                          idx >= visibleCount - BLOGS_PER_PAGE
                            ? (idx % BLOGS_PER_PAGE) * 0.1
                            : 0,
                      }}
                      className="group flex min-w-0 w-full flex-col justify-between rounded-3xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl sm:p-6"
                    >
                      <Link
                        href={articleHref}
                        className="block min-w-0 w-full space-y-4 rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                      >
                        {/* Cover Image */}
                        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-muted sm:h-52">
                          {blog.coverImage ? (
                            <Image
                              src={blog.coverImage}
                              alt={blog.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-card">
                              <BookOpen className="h-12 w-12 text-primary/40" />
                            </div>
                          )}
                          <span className="absolute left-3 top-3 max-w-[170px] truncate rounded-full border border-border bg-background/90 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur-md">
                            {blog.category}
                          </span>
                        </div>

                        {/* Date & Reading Time */}
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-1 text-xs text-muted-foreground">
                          <span className="flex min-w-0 items-center gap-1.5 truncate">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                            <span className="truncate">{formatBlogDate(blog.publishedAt)}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-accent" />
                            {blog.readTime}
                          </span>
                        </div>

                        {/* Title & Excerpt */}
                        <div className="space-y-2 min-w-0">
                          <h3 className="line-clamp-2 break-words font-heading text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
                            {blog.title}
                          </h3>
                          <p className="line-clamp-3 break-words text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {blog.excerpt}
                          </p>
                        </div>
                      </Link>

                      {/* Card Footer: Tags & Read Article Redirect Link */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                          {blog.tags.length > 2 && (
                            <span className="px-1 text-[10px] text-muted-foreground">
                              +{blog.tags.length - 2}
                            </span>
                          )}
                        </div>
                        <Link
                          href={articleHref}
                          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                          <span>Read Article</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col items-stretch justify-center gap-3 pt-4 sm:flex-row sm:items-center sm:gap-4">
              {hasMore ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="h-px w-12 bg-border" />
                    <span>
                      Showing {visibleBlogs.length} of {filteredBlogs.length} articles
                    </span>
                    <div className="h-px w-12 bg-border" />
                  </div>

                  <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      initial={false}
                      animate={{
                        width: `${(visibleBlogs.length / filteredBlogs.length) * 100}%`,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>

                  <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
                    <motion.button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="group relative flex min-h-11 w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl border-2 border-primary/20 bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:border-primary/60 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span className="font-bold text-primary">Read More</span>
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                            +{Math.min(remainingCount, BLOGS_PER_PAGE)}
                          </span>
                          <ArrowDown className="h-4 w-4 text-primary transition-transform group-hover:translate-y-0.5" />
                        </>
                      )}
                    </motion.button>

                    <Link
                      href="/blog"
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
                    >
                      <span>View All Blogs</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-xs text-muted-foreground sm:flex-row">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>All {filteredBlogs.length} articles displayed</span>
                  </div>

                  <Link
                    href="/blog"
                    className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-card px-5 py-2.5 font-medium text-foreground transition-all hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <span>View All in Blog Archive</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {filteredBlogs.length > BLOGS_PER_PAGE && (
                    <button
                      type="button"
                      onClick={handleShowLess}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span>Show less (3 cards)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
