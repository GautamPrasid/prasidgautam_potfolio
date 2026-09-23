"use client";

import { useState, useEffect } from "react";
import { EducationItem } from "@/lib/data";
import { getEducationFromDb } from "@/lib/supabase-db";
import {
  saveEducationAction,
  deleteEducationAction,
  reorderEducationAction,
} from "@/app/admin/actions";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, GraduationCap, CheckCircle2, X } from "lucide-react";

export default function EducationManagerPage() {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<EducationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getEducationFromDb();
      if (active) {
        setItems(data ?? []);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Form State
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState<EducationItem["status"]>("Completed");
  const [description, setDescription] = useState("");
  const [coursesText, setCoursesText] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setDegree("");
    setInstitution("");
    setLocation("");
    setDuration("");
    setStatus("Completed");
    setDescription("");
    setCoursesText("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EducationItem) => {
    setEditingItem(item);
    setDegree(item.degree);
    setInstitution(item.institution);
    setLocation(item.location);
    setDuration(item.duration);
    setStatus(item.status);
    setDescription(item.description);
    setCoursesText(item.courses ? item.courses.join(", ") : "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree.trim() || !institution.trim()) return;

    const coursesArray = coursesText
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    try {
      if (editingItem) {
        await saveEducationAction({
          id: editingItem.id,
          degree,
          institution,
          location,
          duration,
          status,
          description,
          courses: coursesArray,
        });
        setItems(
          items.map((it) =>
            it.id === editingItem.id
              ? { ...it, degree, institution, location, duration, status, description, courses: coursesArray }
              : it
          )
        );
        showToast(`Updated "${degree}".`);
      } else {
        const res = await saveEducationAction({
          degree,
          institution,
          location,
          duration,
          status,
          description,
          courses: coursesArray,
          order_index: items.length + 1,
        });

        const newItem: EducationItem = {
          id: res.data?.id || `edu-${Date.now()}`,
          degree,
          institution,
          location,
          duration,
          status,
          description,
          courses: coursesArray,
        };
        setItems([...items, newItem]);
        showToast(`Added "${degree}".`);
      }
    } catch (err) {
      console.error("Save education failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to save education: ${msg}`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    try {
      await deleteEducationAction(deletingItem.id);
      setItems(items.filter((it) => it.id !== deletingItem.id));
      showToast(`Deleted education record.`);
    } catch (err) {
      console.error("Delete education failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to delete education: ${msg}`);
    }
    setDeletingItem(null);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItems(updated);

    try {
      await reorderEducationAction([
        { id: updated[targetIndex].id, order_index: targetIndex + 1 },
        { id: updated[index].id, order_index: index + 1 },
      ]);
      showToast("Reordered education records.");
    } catch (err) {
      console.error("Reorder education failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to reorder education: ${msg}`);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Education Manager
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage academic degrees, institutions, duration, and key coursework.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
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
                  <GraduationCap className="w-5 h-5" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-foreground">
                      {item.degree}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-foreground/80">
                    {item.institution} &bull; {item.location} ({item.duration})
                  </p>

                  <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                    {item.description}
                  </p>
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
                {editingItem ? "Edit Education" : "Add New Education"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Degree / Certificate</label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Computer Applications (BCA)"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Institution</label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="La Grande College"
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
                    placeholder="Pokhara, Nepal"
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
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EducationItem["status"])}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Enrolled">Enrolled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Courses (Comma Separated)</label>
                <input
                  type="text"
                  value={coursesText}
                  onChange={(e) => setCoursesText(e.target.value)}
                  placeholder="Data Structures, DBMS, Web Tech"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md">Save Education</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">Delete Education Record?</h3>
            <p className="text-xs text-muted-foreground">Are you sure you want to delete &ldquo;{deletingItem.degree}&rdquo;?</p>
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
