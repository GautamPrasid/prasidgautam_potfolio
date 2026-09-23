"use client";

import { useState } from "react";
import { CERTIFICATIONS_DATA, CertificationItem } from "@/lib/data";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Award, CheckCircle2, ExternalLink, X } from "lucide-react";

export default function CertificationsManagerPage() {
  const [items, setItems] = useState<CertificationItem[]>(CERTIFICATIONS_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CertificationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [issuerColor, setIssuerColor] = useState("from-blue-500 to-indigo-600");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setIssuer("");
    setDate("");
    setCredentialUrl("");
    setSkillsText("");
    setIssuerColor("from-blue-500 to-indigo-600");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CertificationItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setIssuer(item.issuer);
    setDate(item.date);
    setCredentialUrl(item.credentialUrl);
    setSkillsText(item.skills.join(", "));
    setIssuerColor(item.issuerColor || "from-blue-500 to-indigo-600");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) return;

    const skillsArray = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingItem) {
      setItems(
        items.map((it) =>
          it.id === editingItem.id
            ? { ...it, title, issuer, date, credentialUrl, skills: skillsArray, issuerColor }
            : it
        )
      );
      showToast(`Updated "${title}".`);
    } else {
      const newItem: CertificationItem = {
        id: `cert-${Date.now()}`,
        title,
        issuer,
        date,
        credentialUrl,
        skills: skillsArray,
        issuerColor,
      };
      setItems([...items, newItem]);
      showToast(`Added "${title}".`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingItem) return;
    setItems(items.filter((it) => it.id !== deletingItem.id));
    showToast("Deleted certification.");
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
    showToast("Reordered certifications.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Certifications Manager
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your credentials, platform badges, issue dates, and URL verification links.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
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
              className="p-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
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
                    disabled={index === items.length - 1}
                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Award className="w-5 h-5" />
                </div>

                <div className="space-y-1 min-w-0">
                  <h3 className="font-heading font-bold text-sm text-foreground truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {item.issuer} &bull; {item.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={item.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
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
                {editingItem ? "Edit Certification" : "Add New Certification"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Certificate Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Meta Front-End Developer Professional Certificate"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Issuer Platform</label>
                  <input
                    type="text"
                    required
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Meta / Coursera / freeCodeCamp"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">Issue Date</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="2024"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Credential Verification URL</label>
                <input
                  type="url"
                  required
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Competencies (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="React, JavaScript, HTML5"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md">Save Certification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">Delete Certification?</h3>
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
