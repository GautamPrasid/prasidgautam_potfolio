"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost, BLOG_CATEGORIES } from "@/lib/data";
import { SectionHeadingItem } from "@/lib/supabase-db";
import {
  BookOpen,
  Clock,
  Calendar,
  X,
  Tag,
  ArrowRight,
  ArrowDown,
  Newspaper,
  Sparkles,
  TrendingUp,
  Eye,
  ChevronRight,
  Loader2,
} from "lucide-react";

/** Number of blog cards to show initially and per "Read More" click */
const BLOGS_PER_PAGE = 3;

export interface BlogSectionProps {
  initialBlogs?: BlogPost[];
  sectionContent?: SectionHeadingItem;
}

export function BlogSection({ initialBlogs = [], sectionContent }: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(BLOGS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(BLOGS_PER_PAGE);
  }, [selectedCategory]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedBlog) {
        setSelectedBlog(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBlog]);

  // Lock body scroll when modal reader is open
  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBlog]);

  const publishedBlogs = useMemo(() => {
    return initialBlogs.filter((b) => b.published !== false);
  }, [initialBlogs]);

  const filteredBlogs = useMemo(() => {
    if (selectedCategory === "All") return publishedBlogs;
    return publishedBlogs.filter((b) => b.category === selectedCategory);
  }, [publishedBlogs, selectedCategory]);

  // Paginated: only show `visibleCount` blogs
  const visibleBlogs = useMemo(() => {
    return filteredBlogs.slice(0, visibleCount);
  }, [filteredBlogs, visibleCount]);

  const hasMore = visibleCount < filteredBlogs.length;
  const remainingCount = filteredBlogs.length - visibleCount;

  const categories = useMemo(() => {
    return ["All", ...BLOG_CATEGORIES];
  }, []);

  // Featured blog: pick the most recent published blog
  const featuredBlog = useMemo(() => {
    if (publishedBlogs.length === 0) return null;
    const sorted = [...publishedBlogs].sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
    return sorted[0];
  }, [publishedBlogs]);

  // Latest blogs for the sidebar (exclude featured, take up to 4)
  const latestBlogs = useMemo(() => {
    if (publishedBlogs.length <= 1) return [];
    const sorted = [...publishedBlogs].sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
    return sorted.slice(1, 5);
  }, [publishedBlogs]);

  // Open the article reader modal
  const openReader = useCallback((blog: BlogPost) => {
    setSelectedBlog(blog);
  }, []);

  // Load more blogs with a small simulated delay for polish
  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Brief delay for smooth animation feel
    setTimeout(() => {
      setVisibleCount((prev) => prev + BLOGS_PER_PAGE);
      setIsLoadingMore(false);
    }, 400);
  }, []);

  return (
    <section
      id="blog"
      className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20"
      aria-label="Blog Section"
    >
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-10 sm:space-y-12"
      >
        {/* Section Header */}
        {(sectionContent?.badge || sectionContent?.heading || sectionContent?.subtext) && (
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {sectionContent.badge && (
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 inline-block uppercase">
                {sectionContent.badge}
              </span>
            )}
            {sectionContent.heading && (
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                {sectionContent.heading}
              </h2>
            )}
            {sectionContent.subtext && (
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                {sectionContent.subtext}
              </p>
            )}
          </div>
        )}

        {/* Category Filter Tabs */}
        {publishedBlogs.length > 0 && (
          <div className="flex justify-center overflow-x-auto max-w-full py-2 scrollbar-none">
            <div className="inline-flex p-1.5 rounded-2xl bg-card border border-border/80 shadow-sm gap-1 max-w-full">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none min-h-[44px] ${
                      isActive
                        ? "text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeBlogCategoryTab"
                        className="absolute inset-0 bg-primary rounded-xl shadow-md"
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
          <div className="py-12 sm:py-16 text-center rounded-3xl bg-card border border-dashed border-border p-6 sm:p-8 max-w-md mx-auto space-y-3">
            <Newspaper className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
              No articles found
            </h3>
            <p className="text-xs text-muted-foreground">
              Check back soon for new articles and guides!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleBlogs.map((blog, idx) => (
                  <motion.article
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx >= visibleCount - BLOGS_PER_PAGE ? (idx % BLOGS_PER_PAGE) * 0.12 : 0 }}
                    onClick={() => openReader(blog)}
                    className="p-5 rounded-3xl bg-card border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer min-w-0"
                  >
                    <div className="space-y-4 min-w-0">
                      {/* Cover Image */}
                      <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-muted">
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
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-background/90 backdrop-blur-md text-primary border border-border shadow-sm truncate max-w-[150px]">
                            {blog.category}
                          </span>
                        </div>
                      </div>

                      {/* Date & Read Time */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 truncate">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toLocaleDateString("en-US", { timeZone: "UTC",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Published"}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                          {blog.readTime}
                        </span>
                      </div>

                      {/* Title & Excerpt */}
                      <div className="space-y-2 min-w-0">
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words">
                          {blog.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed break-words">
                          {blog.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Read Action */}
                    <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 2).map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="text-[10px] px-1 text-muted-foreground">
                            +{blog.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-xs font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                ✦ READ MORE BUTTON — Loads more blog cards
                ═══════════════════════════════════════════════════════════ */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-col items-center gap-3 pt-2"
              >
                {/* Progress indicator */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="h-px w-12 bg-border" />
                  <span>
                    Showing {visibleCount} of {filteredBlogs.length} articles
                  </span>
                  <div className="h-px w-12 bg-border" />
                </div>

                {/* Progress bar */}
                <div className="w-48 h-1 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={false}
                    animate={{ width: `${(visibleCount / filteredBlogs.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Read More Button */}
                <motion.button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="group relative mt-2 px-8 py-3.5 rounded-2xl bg-card border-2 border-primary/20 hover:border-primary/50 text-foreground font-semibold text-sm shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-3 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <span className="relative z-10 flex items-center gap-2.5">
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-primary font-bold">Read More</span>
                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold">
                          +{Math.min(remainingCount, BLOGS_PER_PAGE)}
                        </span>
                        <ArrowDown className="w-4 h-4 text-primary group-hover:translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </span>

                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/0 group-hover:ring-primary/20 transition-all duration-300" />
                </motion.button>
              </motion.div>
            )}

            {/* All loaded indicator */}
            {!hasMore && filteredBlogs.length > BLOGS_PER_PAGE && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>You&apos;ve seen all {filteredBlogs.length} articles</span>
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
              </motion.div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            ✦ FEATURED & LATEST — Read Article Section
            ═══════════════════════════════════════════════════════════════ */}
        {publishedBlogs.length > 0 && featuredBlog && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 sm:mt-20 space-y-8"
          >
            {/* Section Heading */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Featured & Latest
                </h3>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-border via-primary/20 to-transparent" />
            </div>

            {/* Featured + Latest Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
              {/* ── Featured Article (Large Hero Card) ────────────── */}
              <motion.article
                onClick={() => openReader(featuredBlog)}
                className="lg:col-span-3 group cursor-pointer relative rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-primary/40 shadow-sm hover:shadow-2xl transition-all duration-500"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Featured Cover Image */}
                <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden">
                  {featuredBlog.coverImage ? (
                    <Image
                      src={featuredBlog.coverImage}
                      alt={featuredBlog.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-card flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-primary/30" />
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-primary text-primary-foreground shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                      <TrendingUp className="w-3 h-3" />
                      Featured
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-background/80 backdrop-blur-md text-primary border border-border/50 shadow-sm">
                      {featuredBlog.category}
                    </span>
                  </div>
                </div>

                {/* Featured Content */}
                <div className="p-6 sm:p-8 space-y-4 -mt-12 relative z-10">
                  {/* Meta Row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {featuredBlog.publishedAt
                        ? new Date(featuredBlog.publishedAt).toLocaleDateString("en-US", { timeZone: "UTC",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently Published"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {featuredBlog.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2">
                    {featuredBlog.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>

                  {/* Tags + Read Article CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {featuredBlog.tags.slice(0, 3).map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-muted/80 text-muted-foreground font-medium border border-border/40"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-sm font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Eye className="w-4 h-4" />
                      Read Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Bottom Gradient Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.article>

              {/* ── Latest Articles Sidebar ───────────────────────── */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {/* Sidebar Header */}
                <div className="flex items-center gap-2 px-1">
                  <Newspaper className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Latest Articles
                  </span>
                </div>

                {latestBlogs.length > 0 ? (
                  latestBlogs.map((blog, idx) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      onClick={() => openReader(blog)}
                      className="group cursor-pointer flex gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300 min-w-0"
                      whileHover={{ x: 4 }}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                        {blog.coverImage ? (
                          <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            sizes="96px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-primary/40" />
                          </div>
                        )}
                        {/* Number Badge */}
                        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-sm">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className="space-y-1.5">
                          {/* Category Badge */}
                          <span className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider">
                            {blog.category}
                          </span>

                          {/* Title */}
                          <h5 className="font-heading font-bold text-sm sm:text-[15px] text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {blog.title}
                          </h5>
                        </div>

                        {/* Meta + Read */}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {blog.publishedAt
                                ? new Date(blog.publishedAt).toLocaleDateString("en-US", { timeZone: "UTC",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Recent"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {blog.readTime}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            Read
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6 rounded-2xl bg-card border border-dashed border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      More articles coming soon!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          ✦ ARTICLE READER MODAL — Opens when "Read" or "Read Article" is clicked
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-label={selectedBlog.title}
              className="relative w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-border flex items-start justify-between gap-4 bg-card/80 backdrop-blur-md">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      {selectedBlog.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedBlog.readTime}
                    </span>
                    {selectedBlog.publishedAt && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(selectedBlog.publishedAt).toLocaleDateString("en-US", { timeZone: "UTC",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground leading-snug break-words">
                    {selectedBlog.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedBlog(null)}
                  className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 min-w-0">
                {selectedBlog.coverImage && (
                  <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-muted">
                    <Image
                      src={selectedBlog.coverImage}
                      alt={selectedBlog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Excerpt callout */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 text-xs sm:text-sm italic text-muted-foreground break-words leading-relaxed">
                  <BookOpen className="w-4 h-4 text-primary mb-2" />
                  {selectedBlog.excerpt}
                </div>

                {/* Article content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground text-xs sm:text-base whitespace-pre-wrap leading-relaxed break-words">
                  {selectedBlog.content}
                </div>

                {/* Tags */}
                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div className="pt-4 border-t border-border flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-primary shrink-0" />
                    {selectedBlog.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-medium border border-border/60"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read more articles suggestion at bottom of reader */}
                {publishedBlogs.length > 1 && (
                  <div className="pt-6 border-t border-border space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      Continue Reading
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {publishedBlogs
                        .filter((b) => b.id !== selectedBlog.id)
                        .slice(0, 2)
                        .map((blog) => (
                          <button
                            key={blog.id}
                            onClick={() => setSelectedBlog(blog)}
                            className="group/suggestion text-left p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/40 hover:border-primary/30 transition-all duration-200 flex gap-3 items-center"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                              {blog.coverImage ? (
                                <Image
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-primary/40" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-foreground group-hover/suggestion:text-primary transition-colors line-clamp-2 leading-snug">
                                {blog.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {blog.readTime}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/suggestion:text-primary shrink-0 transition-colors" />
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
