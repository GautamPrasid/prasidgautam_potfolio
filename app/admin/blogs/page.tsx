"use client";

import { useState, useEffect, useRef } from "react";
import { BlogPost, BLOG_CATEGORIES, BLOG_FILTERS, BlogCategory } from "@/lib/data";
import { getBlogsFromDb } from "@/lib/supabase-db";
import {
  saveBlogAction,
  deleteBlogAction,
  reorderBlogsAction,
  uploadAssetAction,
} from "@/app/admin/actions";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  BookOpen,
  CheckCircle2,
  Upload,
  X,
  Loader2,
  ImageIcon,
  Eye,
  EyeOff,
  Clock,
  Tag,
} from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogsManagerPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getBlogsFromDb();
      if (active) {
        setBlogs(data ?? []);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Modal & UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<BlogPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<BlogCategory>("Web Development");
  const [tagsText, setTagsText] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [published, setPublished] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingBlog) {
      setSlug(slugify(val));
    }
  };

  const handleOpenAddModal = () => {
    setEditingBlog(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("Web Development");
    setTagsText("WebDev, Next.js, Engineering");
    setCoverImage("");
    setReadTime("5 min read");
    setPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCategory(blog.category);
    setTagsText(blog.tags ? blog.tags.join(", ") : "");
    setCoverImage(blog.coverImage || "");
    setReadTime(blog.readTime || "5 min read");
    setPublished(blog.published);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blogs");
      if (coverImage) {
        formData.append("previousUrl", coverImage);
      }

      const res = await uploadAssetAction(formData);
      if (res.success && res.data?.publicUrl) {
        setCoverImage(res.data.publicUrl);
        showToast("Blog cover image uploaded successfully.");
      } else {
        showToast(`Upload failed: ${res.message}`);
      }
    } catch (err) {
      console.error("Image upload error:", err);
      showToast("Upload failed due to network error.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) return;

    const finalSlug = slug.trim() ? slugify(slug) : slugify(title);
    const tagsArray = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      if (editingBlog) {
        await saveBlogAction({
          id: editingBlog.id,
          title,
          slug: finalSlug,
          excerpt,
          content,
          cover_image: coverImage || null,
          category,
          tags: tagsArray,
          read_time: readTime,
          published,
        });

        setBlogs(
          blogs.map((b) =>
            b.id === editingBlog.id
              ? {
                  ...b,
                  title,
                  slug: finalSlug,
                  excerpt,
                  content,
                  coverImage: coverImage || undefined,
                  category,
                  tags: tagsArray,
                  readTime,
                  published,
                }
              : b
          )
        );
        showToast(`Updated blog "${title}".`);
      } else {
        const res = await saveBlogAction({
          title,
          slug: finalSlug,
          excerpt,
          content,
          cover_image: coverImage || null,
          category,
          tags: tagsArray,
          read_time: readTime,
          published,
          order_index: blogs.length + 1,
        });

        const newBlog: BlogPost = {
          id: res.data?.id || `blog-${Date.now()}`,
          title,
          slug: finalSlug,
          excerpt,
          content,
          coverImage: coverImage || undefined,
          category,
          tags: tagsArray,
          readTime,
          published,
        };
        setBlogs([...blogs, newBlog]);
        showToast(`Published blog post "${title}".`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save blog failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to save blog: ${msg}`);
    }
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    const updatedStatus = !blog.published;
    try {
      await saveBlogAction({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        cover_image: blog.coverImage || null,
        category: blog.category,
        tags: blog.tags,
        read_time: blog.readTime,
        published: updatedStatus,
      });

      setBlogs(
        blogs.map((b) => (b.id === blog.id ? { ...b, published: updatedStatus } : b))
      );
      showToast(
        `Article "${blog.title}" is now ${updatedStatus ? "Published" : "Draft"}.`
      );
    } catch (err) {
      console.error("Toggle publish failed:", err);
      showToast("Failed to update publish status.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBlog) return;
    try {
      await deleteBlogAction(deletingBlog.id);
      setBlogs(blogs.filter((b) => b.id !== deletingBlog.id));
      showToast(`Deleted "${deletingBlog.title}".`);
    } catch (err) {
      console.error("Delete blog failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to delete blog: ${msg}`);
    }
    setDeletingBlog(null);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blogs.length) return;

    const updated = [...blogs];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlogs(updated);

    try {
      await reorderBlogsAction([
        { id: updated[targetIndex].id, order_index: targetIndex + 1 },
        { id: updated[index].id, order_index: index + 1 },
      ]);
      showToast("Reordered blog articles.");
    } catch (err) {
      console.error("Reorder blogs failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to reorder blogs: ${msg}`);
    }
  };

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-primary" />
            <span>Blogs Manager</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Write, edit, organize, and publish technical articles, tutorials, and career insights.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Article</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {BLOG_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-xs space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/50" />
            <p className="font-medium">No blog posts found in this category.</p>
            <p className="text-[11px]">Click &quot;Add New Article&quot; above to compose your first blog.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredBlogs.map((blog, index) => (
              <div
                key={blog.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                {/* Left Section */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-0.5 shrink-0 pt-0.5 sm:pt-0">
                    <button
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, "down")}
                      disabled={index === blogs.length - 1}
                      className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail / Cover */}
                  <div className="w-16 h-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center text-muted-foreground relative">
                    {blog.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 opacity-40" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-sm text-foreground truncate">
                        {blog.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-semibold">
                        {blog.category}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                          blog.published
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {blog.published ? (
                          <>
                            <Eye className="w-3 h-3" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Draft
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.readTime}
                      </span>
                      <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                        /{blog.slug}
                      </span>
                      {blog.tags && blog.tags.length > 0 && (
                        <span className="flex items-center gap-1 text-[10px]">
                          <Tag className="w-3 h-3 opacity-60" />
                          {blog.tags.slice(0, 3).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleTogglePublish(blog)}
                    className={`p-2 rounded-lg transition-colors ${
                      blog.published
                        ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    title={blog.published ? "Unpublish (Set to Draft)" : "Publish Article"}
                  >
                    {blog.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(blog)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Edit Blog"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingBlog(blog)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Blog"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingBlog ? "Edit Blog Post" : "Compose New Article"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Master Next.js 15 Server Actions and Supabase RLS"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="master-nextjs-15-server-actions"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    required
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 min read"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2.5 px-3.5 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-500" />
                      Publish Immediately
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Excerpt / Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short, compelling summary of what readers will learn in this post..."
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Blog Content (Markdown supported) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article body here in markdown format..."
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="React, Next.js, Supabase, WebDev"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Cover Image Upload & Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Cover Image
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload header image"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3.5 py-2 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload</span>
                  </button>
                </div>
                {coverImage && (
                  <div className="mt-2 w-full h-36 rounded-xl border border-border overflow-hidden bg-muted relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90"
                >
                  {editingBlog ? "Update Article" : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBlog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">
              Delete Article?
            </h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete &ldquo;{deletingBlog.title}&rdquo;? This action cannot be undone.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setDeletingBlog(null)}
                className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
