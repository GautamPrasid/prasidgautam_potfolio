"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost, BLOG_CATEGORIES } from "@/lib/data";
import {
  BookOpen,
  Clock,
  Calendar,
  X,
  Tag,
  ArrowRight,
  Newspaper,
} from "lucide-react";

export interface BlogSectionProps {
  initialBlogs?: BlogPost[];
}

export function BlogSection({ initialBlogs = [] }: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

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

  const categories = useMemo(() => {
    return ["All", ...BLOG_CATEGORIES];
  }, []);

  return (
    <section
      id="blog"
      className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20"
      aria-label="Blog Section"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-10 sm:space-y-12"
        suppressHydrationWarning
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 inline-block uppercase">
            Articles &amp; Tutorials
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Latest Writings &amp; Insights
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Thoughts, deep-dives, and guides on modern software engineering, web development, and AI.
          </p>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onClick={() => setSelectedBlog(blog)}
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
                        unoptimized
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
                          ? new Date(blog.publishedAt).toLocaleDateString(undefined, {
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

                {/* Footer / Read More Action */}
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
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform shrink-0">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>

      {/* Article Modal Reader */}
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
              <div className="p-4 sm:p-6 border-b border-border flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      {selectedBlog.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedBlog.readTime}
                    </span>
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
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-4 rounded-xl bg-muted/50 border border-border text-xs sm:text-sm italic text-muted-foreground break-words leading-relaxed">
                  {selectedBlog.excerpt}
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground text-xs sm:text-base whitespace-pre-wrap leading-relaxed break-words">
                  {selectedBlog.content}
                </div>

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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
