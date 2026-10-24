"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { BlogPost } from "@/lib/data";
import { BLOG_CATEGORIES, DEFAULT_BLOGS } from "@/lib/data";
import type { SectionHeadingItem } from "@/lib/supabase-db";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Loader2,
  Newspaper,
  Sparkles,
  Tag,
  X,
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
  return full
    ? `${month} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
    : `${month} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export interface BlogSectionProps {
  initialBlogs?: BlogPost[];
  sectionContent?: SectionHeadingItem;
}

export function BlogSection({ initialBlogs = [], sectionContent }: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
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

  useEffect(() => {
    if (!selectedBlog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedBlog(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedBlog]);

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
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28"
    >
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-10 sm:space-y-12"
      >
        <div className="mx-auto max-w-3xl space-y-3 text-center sm:space-y-4">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            {sectionContent?.badge || "Articles & Insights"}
          </span>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {sectionContent?.heading || "Latest from the Blog"}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base md:text-lg">
            {sectionContent?.subtext ||
              "Thoughts, engineering deep-dives, and tutorials on modern web development, architecture, and technology."}
          </p>
        </div>

        {publishedBlogs.length > 0 && (
          <div className="flex max-w-full justify-center overflow-x-auto py-2 scrollbar-none">
            <div className="inline-flex max-w-full gap-1 rounded-2xl border border-border/80 bg-card p-1.5 shadow-sm">
              {categories.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={active}
                    className={`relative min-h-11 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-200 focus:outline-none sm:px-4 sm:text-sm ${
                      active
                        ? "font-semibold text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="activeBlogCategoryTab"
                        className="absolute inset-0 rounded-xl bg-primary shadow-md"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {filteredBlogs.length === 0 ? (
          <div className="mx-auto max-w-md space-y-3 rounded-3xl border border-dashed border-border bg-card p-6 py-12 text-center sm:p-8 sm:py-16">
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
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleBlogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    layout
                    initial={false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                      duration: 0.3,
                      delay: index >= visibleCount - BLOGS_PER_PAGE
                        ? (index % BLOGS_PER_PAGE) * 0.08
                        : 0,
                    }}
                    className="group flex min-w-0 flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl sm:p-6"
                  >
                    <div className="min-w-0 space-y-4">
                      <button
                        type="button"
                        onClick={() => setSelectedBlog(blog)}
                        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={`Read article: ${blog.title}`}
                      >
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
                      </button>

                      <div className="flex items-center justify-between gap-3 pt-1 text-xs text-muted-foreground">
                        <span className="flex min-w-0 items-center gap-1.5 truncate">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="truncate">{formatBlogDate(blog.publishedAt)}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-accent" />
                          {blog.readTime}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedBlog(blog)}
                        className="block w-full space-y-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <h3 className="line-clamp-2 break-words font-heading text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
                          {blog.title}
                        </h3>
                        <p className="line-clamp-3 break-words text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {blog.excerpt}
                        </p>
                      </button>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/60 pt-4">
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
                      <button
                        type="button"
                        onClick={() => setSelectedBlog(blog)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                      >
                        Read Article
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              {hasMore ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="h-px w-12 bg-border" />
                    <span>Showing {visibleBlogs.length} of {filteredBlogs.length} articles</span>
                    <div className="h-px w-12 bg-border" />
                  </div>
                  <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={false}
                      animate={{ width: `${(visibleBlogs.length / filteredBlogs.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <motion.button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl border-2 border-primary/20 bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:border-primary/60 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
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
                      className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
                    >
                      View All Blogs <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-xs text-muted-foreground sm:flex-row">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    All {filteredBlogs.length} articles displayed
                  </span>
                  <Link
                    href="/blog"
                    className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-5 py-2.5 font-medium text-foreground transition-all hover:border-primary/50 hover:text-primary"
                  >
                    View All in Blog Archive <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {filteredBlogs.length > BLOGS_PER_PAGE && (
                    <button
                      type="button"
                      onClick={handleShowLess}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                      Show less (3 cards)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence initial={false}>
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
              aria-label="Close article reader"
            />
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              role="dialog"
              aria-modal="true"
              aria-label={selectedBlog.title}
              className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl sm:max-h-[85vh]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border bg-card/80 p-4 backdrop-blur-md sm:p-6">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                      {selectedBlog.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {selectedBlog.readTime}
                    </span>
                    {selectedBlog.publishedAt && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatBlogDate(selectedBlog.publishedAt, true)}
                      </span>
                    )}
                  </div>
                  <h3 className="break-words font-heading text-xl font-bold leading-snug text-foreground sm:text-2xl">
                    {selectedBlog.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBlog(null)}
                  className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-w-0 space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-6">
                {selectedBlog.coverImage && (
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-muted sm:h-64">
                    <Image
                      src={selectedBlog.coverImage}
                      alt={selectedBlog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                    />
                  </div>
                )}
                {selectedBlog.excerpt && (
                  <div className="break-words rounded-xl border border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5 p-4 text-xs italic leading-relaxed text-muted-foreground sm:text-sm">
                    <BookOpen className="mb-2 h-4 w-4 text-primary" />
                    {selectedBlog.excerpt}
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words text-xs leading-relaxed text-foreground sm:text-base">
                  {selectedBlog.content}
                </div>
                {selectedBlog.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    <Tag className="h-4 w-4 shrink-0 text-primary" />
                    {selectedBlog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-border/60 bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="border-t border-border pt-5">
                  <Link
                    href={`/blog/${selectedBlog.slug || selectedBlog.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Open full article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {publishedBlogs.length > 1 && (
                  <div className="space-y-4 border-t border-border pt-5">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" /> Continue Reading
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {publishedBlogs
                        .filter((blog) => blog.id !== selectedBlog.id)
                        .slice(0, 2)
                        .map((blog) => (
                          <button
                            key={blog.id}
                            type="button"
                            onClick={() => setSelectedBlog(blog)}
                            className="group/suggestion flex items-center gap-3 rounded-xl border border-border/40 bg-muted/50 p-3 text-left transition-all duration-200 hover:border-primary/30 hover:bg-muted"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                              {blog.coverImage ? (
                                <Image
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15">
                                  <BookOpen className="h-4 w-4 text-primary/40" />
                                </div>
                              )}
                            </div>
                            <span className="min-w-0 flex-1">
                              <span className="line-clamp-2 block text-xs font-bold leading-snug text-foreground transition-colors group-hover/suggestion:text-primary">
                                {blog.title}
                              </span>
                              <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Clock className="h-2.5 w-2.5" /> {blog.readTime}
                              </span>
                            </span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover/suggestion:text-primary" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
