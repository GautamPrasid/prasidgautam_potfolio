"use client";

import { useState, useEffect } from "react";
import { Skill, SKILL_CATEGORIES } from "@/lib/data";
import { getSkillsFromDb } from "@/lib/supabase-db";
import {
  saveSkillAction,
  deleteSkillAction,
  reorderSkillsAction,
} from "@/app/admin/actions";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Wrench, CheckCircle2, X } from "lucide-react";

export default function SkillsManagerPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getSkillsFromDb();
      if (active) {
        setSkills(data ?? []);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Skill["category"]>("Languages");
  const [iconName, setIconName] = useState("Code");
  const [level, setLevel] = useState<number>(85);
  const [description, setDescription] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingSkill(null);
    setName("");
    setCategory("Languages");
    setIconName("Code");
    setLevel(85);
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setIconName(skill.iconName);
    setLevel(skill.level || 85);
    setDescription(skill.description || "");
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingSkill) {
        await saveSkillAction({
          id: editingSkill.id,
          name,
          category,
          icon_name: iconName,
          level,
          description,
        });
        setSkills(
          skills.map((s) =>
            s.id === editingSkill.id
              ? { ...s, name, category, iconName, level, description }
              : s
          )
        );
        showToast(`Updated "${name}" successfully.`);
      } else {
        const res = await saveSkillAction({
          name,
          category,
          icon_name: iconName,
          level,
          description,
          order_index: skills.length + 1,
        });

        const newSkillItem: Skill = {
          id: res.data?.id || `skill-${Date.now()}`,
          name,
          category,
          iconName,
          level,
          description,
        };
        setSkills([...skills, newSkillItem]);
        showToast(`Added "${name}" successfully.`);
      }
    } catch (err) {
      console.error("Save skill failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to save skill: ${msg}`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSkill) return;
    try {
      await deleteSkillAction(deletingSkill.id);
      setSkills(skills.filter((s) => s.id !== deletingSkill.id));
      showToast(`Deleted "${deletingSkill.name}".`);
    } catch (err) {
      console.error("Delete skill failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to delete skill: ${msg}`);
    }
    setDeletingSkill(null);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const updated = [...skills];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSkills(updated);

    try {
      await reorderSkillsAction([
        { id: updated[targetIndex].id, order_index: targetIndex + 1 },
        { id: updated[index].id, order_index: index + 1 },
      ]);
      showToast("Reordered skills.");
    } catch (err) {
      console.error("Reorder skills failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to reorder skills: ${msg}`);
    }
  };


  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Skills Manager
          </h1>
          <p className="text-xs text-muted-foreground">
            Add, edit, reorder, or remove skills displayed on your site.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${activeCategory === cat
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Table List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border">
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === skills.length - 1}
                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-foreground truncate">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase font-semibold">
                      {skill.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {skill.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEditModal(skill)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingSkill(skill)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Skill Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js 14"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Skill["category"])}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Languages">Languages</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools/DevOps">Tools/DevOps</option>
                    <option value="Soft Skills">Soft Skills</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Proficiency %
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Icon Identifier
                </label>
                <input
                  type="text"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  placeholder="e.g. Code, Globe, Server"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short overview of concepts or tools masteries..."
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
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
                  {editingSkill ? "Update Skill" : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSkill && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">
              Delete Skill?
            </h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete &ldquo;{deletingSkill.name}&rdquo;? This action cannot be undone.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setDeletingSkill(null)}
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
