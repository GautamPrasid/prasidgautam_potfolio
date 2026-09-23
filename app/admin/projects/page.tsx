"use client";

import { useState } from "react";
import Image from "next/image";
import { PROJECTS_DATA, Project } from "@/lib/data";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, CheckCircle2, X } from "lucide-react";

export default function ProjectsManagerPage() {
  const [items, setItems] = useState<Project[]>(PROJECTS_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [deletingItem, setDeletingItem] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [image, setImage] = useState("/images/projects/saas-dashboard.jpg");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [category, setCategory] = useState<Project["category"]>("Full-Stack");
  const [featured, setFeatured] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setTagsText("Next.js 14, TypeScript, Tailwind CSS");
    setImage("/images/projects/saas-dashboard.jpg");
    setGithub("https://github.com");
    setDemo("https://vercel.app");
    setCategory("Full-Stack");
    setFeatured(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Project) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setTagsText(item.tags.join(", "));
    setImage(item.image);
    setGithub(item.github);
    setDemo(item.demo || "");
    setCategory(item.category);
    setFeatured(item.featured || false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tagsArray = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingItem) {
      setItems(
        items.map((it) =>
          it.id === editingItem.id
            ? { ...it, title, description, tags: tagsArray, image, github, demo: demo.trim() || undefined, category, featured }
            : it
        )
      );
      showToast(`Updated "${title}".`);
    } else {
      const newItem: Project = {
        id: `proj-${Date.now()}`,
        title,
        description,
        tags: tagsArray,
        image,
        github,
        demo: demo.trim() || undefined,
        category,
        featured,
      };
      setItems([...items, newItem]);
      showToast(`Added "${title}".`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingItem) return;
    setItems(items.filter((it) => it.id !== deletingItem.id));
    showToast("Deleted project.");
    setDeletingItem(null);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItems(updated);
    showToast("Reordered projects.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Projects Showcase Manager
          </h1>
          <p className="text-xs text-muted-foreground">
            Add, edit, reorder featured web apps, repositories, and demo URLs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="p-5 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="flex flex-col gap-0.5 pt-2">
                <button
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0}
                  className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(index, "down")}
                  disabled={index === items.length - 1}
                  className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thumbnail Preview */}
              <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-foreground truncate">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeletingItem(item)}
                className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingItem ? "Edit Project" : "Add New Project"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aura Analytics Dashboard"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of project features..."
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Project["category"])}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Web Apps">Web Apps</option>
                    <option value="Backend">Backend</option>
                    <option value="Mini Projects">Mini Projects</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Image URL</label>
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="/images/projects/saas-dashboard.jpg"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">GitHub Repo URL</label>
                  <input
                    type="url"
                    required
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    value={demo}
                    onChange={(e) => setDemo(e.target.value)}
                    placeholder="https://project.vercel.app"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Tech Stack Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="Next.js 14, TypeScript, Supabase"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">Delete Project?</h3>
            <p className="text-xs text-muted-foreground">Are you sure you want to delete &ldquo;{deletingItem.title}&rdquo;?</p>
            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setDeletingItem(null)} className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold">Cancel</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
