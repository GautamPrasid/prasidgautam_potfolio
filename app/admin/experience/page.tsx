"use client";

import { useState } from "react";
import { EXPERIENCE_DATA, ExperienceItem } from "@/lib/data";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Briefcase, CheckCircle2, X } from "lucide-react";

export default function ExperienceManagerPage() {
  const [items, setItems] = useState<ExperienceItem[]>(EXPERIENCE_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ExperienceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState<ExperienceItem["type"]>("Freelance");
  const [bulletsText, setBulletsText] = useState("");
  const [techText, setTechText] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setRole("");
    setCompany("");
    setLocation("");
    setDuration("");
    setType("Freelance");
    setBulletsText("");
    setTechText("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExperienceItem) => {
    setEditingItem(item);
    setRole(item.role);
    setCompany(item.company);
    setLocation(item.location);
    setDuration(item.duration);
    setType(item.type);
    setBulletsText(item.bullets.join("\n"));
    setTechText(item.technologies.join(", "));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) return;

    const bulletsArray = bulletsText
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const techArray = techText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingItem) {
      setItems(
        items.map((it) =>
          it.id === editingItem.id
            ? { ...it, role, company, location, duration, type, bullets: bulletsArray, technologies: techArray }
            : it
        )
      );
      showToast(`Updated "${role}".`);
    } else {
      const newItem: ExperienceItem = {
        id: `exp-${Date.now()}`,
        role,
        company,
        location,
        duration,
        type,
        bullets: bulletsArray,
        technologies: techArray,
      };
      setItems([...items, newItem]);
      showToast(`Added "${role}".`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingItem) return;
    setItems(items.filter((it) => it.id !== deletingItem.id));
    showToast("Deleted experience record.");
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
    showToast("Reordered experience records.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Experience Manager
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your roles, company history, bulleted impact, and technologies.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-5 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="flex flex-col gap-0.5 pt-1">
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

                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-1">
                  <Briefcase className="w-5 h-5" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-foreground">
                      {item.role}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-foreground/80">
                    {item.company} &bull; {item.location} ({item.duration})
                  </p>

                  <ul className="text-xs text-muted-foreground space-y-1 pt-1 list-disc list-inside">
                    {item.bullets.slice(0, 2).map((b, idx) => (
                      <li key={idx} className="truncate">{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-1">
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
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingItem ? "Edit Experience" : "Add New Experience"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Role Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full-Stack Developer"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Company / Org</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Self-Employed / Club"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Remote / Nepal"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="2023 - Present"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ExperienceItem["type"])}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Freelance">Freelance</option>
                    <option value="College Role">College Role</option>
                    <option value="Project / Hackathon">Project / Hackathon</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Bullet Points (One per line)</label>
                <textarea
                  rows={4}
                  value={bulletsText}
                  onChange={(e) => setBulletsText(e.target.value)}
                  placeholder="Architected web applications...&#10;Optimized performance..."
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Tech Stack (Comma Separated)</label>
                <input
                  type="text"
                  value={techText}
                  onChange={(e) => setTechText(e.target.value)}
                  placeholder="Next.js, React, Supabase"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md">Save Experience</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">Delete Experience Record?</h3>
            <p className="text-xs text-muted-foreground">Are you sure you want to delete &ldquo;{deletingItem.role}&rdquo;?</p>
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
