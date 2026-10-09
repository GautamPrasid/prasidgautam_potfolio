"use client";

import { useState, useEffect, useRef } from "react";
import { Project, PROJECT_CATEGORIES, PROJECT_FILTERS, ProjectCategory } from "@/lib/data";
import { getProjectsFromDb } from "@/lib/supabase-db";
import {
  saveProjectAction,
  deleteProjectAction,
  reorderProjectsAction,
  uploadAssetAction,
} from "@/app/admin/actions";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Star,
  Upload,
  X,
  Loader2,
  ImageIcon,
} from "lucide-react";

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getProjectsFromDb();
      if (active) {
        setProjects(data ?? []);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Modal & UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("Full-Stack");
  const [tagsText, setTagsText] = useState("");
  const [image, setImage] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [featured, setFeatured] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setCategory("Full-Stack");
    setTagsText("Next.js, TypeScript, Tailwind CSS");
    setImage("");
    setGithub("");
    setDemo("");
    setFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setCategory(proj.category);
    setTagsText(proj.tags ? proj.tags.join(", ") : "");
    setImage(proj.image || "");
    setGithub(proj.github || "");
    setDemo(proj.demo || "");
    setFeatured(proj.featured || false);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "projects");
      if (image) {
        formData.append("previousUrl", image);
      }

      const res = await uploadAssetAction(formData);
      if (res.success && res.data?.publicUrl) {
        setImage(res.data.publicUrl);
        showToast("Project screenshot uploaded successfully.");
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

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tagsArray = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      if (editingProject) {
        await saveProjectAction({
          id: editingProject.id,
          title,
          description,
          category,
          tags: tagsArray,
          image: image || null,
          github: github || null,
          demo: demo || null,
          featured,
        });

        setProjects(
          projects.map((p) =>
            p.id === editingProject.id
              ? {
                  ...p,
                  title,
                  description,
                  category,
                  tags: tagsArray,
                  image: image || undefined,
                  github: github || undefined,
                  demo: demo || undefined,
                  featured,
                }
              : p
          )
        );
        showToast(`Updated "${title}".`);
      } else {
        const res = await saveProjectAction({
          title,
          description,
          category,
          tags: tagsArray,
          image: image || null,
          github: github || null,
          demo: demo || null,
          featured,
          order_index: projects.length + 1,
        });

        const newProject: Project = {
          id: res.data?.id || `proj-${Date.now()}`,
          title,
          description,
          category,
          tags: tagsArray,
          image: image || undefined,
          github: github || undefined,
          demo: demo || undefined,
          featured,
        };
        setProjects([...projects, newProject]);
        showToast(`Added project "${title}".`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save project failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to save project: ${msg}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    try {
      await deleteProjectAction(deletingProject.id);
      setProjects(projects.filter((p) => p.id !== deletingProject.id));
      showToast(`Deleted "${deletingProject.title}".`);
    } catch (err) {
      console.error("Delete project failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to delete project: ${msg}`);
    }
    setDeletingProject(null);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setProjects(updated);

    try {
      await reorderProjectsAction([
        { id: updated[targetIndex].id, order_index: targetIndex + 1 },
        { id: updated[index].id, order_index: index + 1 },
      ]);
      showToast("Reordered projects.");
    } catch (err) {
      console.error("Reorder projects failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to reorder projects: ${msg}`);
    }
  };

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-primary" />
            <span>Projects Manager</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, update, reorder, and showcase your featured software engineering projects.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
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
        {PROJECT_FILTERS.map((cat) => (
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

      {/* Projects List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-xs space-y-2">
            <FolderGit2 className="w-8 h-8 mx-auto text-muted-foreground/50" />
            <p className="font-medium">No projects found in this category.</p>
            <p className="text-[11px]">Click &quot;Add New Project&quot; above to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredProjects.map((proj, index) => (
              <div
                key={proj.id}
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
                      disabled={index === projects.length - 1}
                      className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center text-muted-foreground relative">
                    {proj.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={proj.image}
                        alt={proj.title}
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
                        {proj.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-semibold">
                        {proj.category}
                      </span>
                      {proj.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {proj.description}
                    </p>
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Links & Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View GitHub Repository"
                    >
                      <GitBranch className="w-4 h-4" />
                    </a>
                  )}
                  {proj.demo && (
                    <a
                      href={proj.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingProject(proj)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Portfolio Showcase"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {PROJECT_CATEGORIES.map((cat) => (
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
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Mark as Featured
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of key features, architecture, and technology stack..."
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Tags / Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="Next.js, TypeScript, Supabase, Tailwind CSS"
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
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload image"
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
                {image && (
                  <div className="mt-2 w-full h-32 rounded-xl border border-border overflow-hidden bg-muted relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={demo}
                    onChange={(e) => setDemo(e.target.value)}
                    placeholder="https://myproject.vercel.app"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
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
                  {editingProject ? "Update Project" : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">
              Delete Project?
            </h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete &ldquo;{deletingProject.title}&rdquo;? This action cannot be undone.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setDeletingProject(null)}
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
