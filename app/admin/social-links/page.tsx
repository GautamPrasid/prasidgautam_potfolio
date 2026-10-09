"use client";

import { useState, useEffect } from "react";
import { SocialLinkItem } from "@/lib/data";
import { getSocialLinksFromDb } from "@/lib/supabase-db";
import {
  saveSocialLinkAction,
  deleteSocialLinkAction,
  reorderSocialLinksAction,
} from "@/app/admin/actions";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Share2,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

const ICON_PRESETS = [
  // Brand icons (Simple Icons)
  "Github",
  "Linkedin",
  "Twitter",
  "X",
  "Instagram",
  "Facebook",
  "Youtube",
  "Whatsapp",
  "Telegram",
  "Discord",
  "Slack",
  "Reddit",
  "Tiktok",
  "Medium",
  "Dribbble",
  "Behance",
  "Figma",
  "Codepen",
  "Stackoverflow",
  // Generic icons (Lucide)
  "Mail",
  "Phone",
  "Globe",
  "Link",
];

// Auto-detect icon based on URL
function detectIconFromUrl(url: string): string {
  const lowercaseUrl = url.toLowerCase();
  
  // Brand detection (Simple Icons)
  if (lowercaseUrl.includes("github")) return "Github";
  if (lowercaseUrl.includes("linkedin")) return "Linkedin";
  if (lowercaseUrl.includes("twitter")) return "Twitter";
  if (lowercaseUrl.includes("x.com")) return "X";
  if (lowercaseUrl.includes("instagram")) return "Instagram";
  if (lowercaseUrl.includes("facebook")) return "Facebook";
  if (lowercaseUrl.includes("youtube")) return "Youtube";
  if (lowercaseUrl.includes("whatsapp") || lowercaseUrl.includes("wa.me")) return "Whatsapp";
  if (lowercaseUrl.includes("telegram") || lowercaseUrl.includes("t.me")) return "Telegram";
  if (lowercaseUrl.includes("discord")) return "Discord";
  if (lowercaseUrl.includes("slack")) return "Slack";
  if (lowercaseUrl.includes("reddit")) return "Reddit";
  if (lowercaseUrl.includes("tiktok")) return "Tiktok";
  if (lowercaseUrl.includes("medium")) return "Medium";
  if (lowercaseUrl.includes("dribbble")) return "Dribbble";
  if (lowercaseUrl.includes("behance")) return "Behance";
  if (lowercaseUrl.includes("figma")) return "Figma";
  if (lowercaseUrl.includes("codepen")) return "Codepen";
  if (lowercaseUrl.includes("stackoverflow")) return "Stackoverflow";
  
  // Generic detection (Lucide)
  if (lowercaseUrl.includes("mailto:") || lowercaseUrl.includes("@")) return "Mail";
  if (lowercaseUrl.includes("tel:")) return "Phone";
  
  return "Globe"; // Default fallback
}

export default function SocialLinksManagerPage() {
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialLinkItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<SocialLinkItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [iconName, setIconName] = useState("Github");

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getSocialLinksFromDb();
      if (active) {
        setLinks(data ?? []);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setPlatform("");
    setUrl("");
    setIconName("Globe");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SocialLinkItem) => {
    setEditingItem(item);
    setPlatform(item.platform);
    setUrl(item.url);
    // Auto-detect icon from URL if current icon seems wrong
    const detectedIcon = detectIconFromUrl(item.url);
    setIconName(detectedIcon);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;

    try {
      if (editingItem) {
        await saveSocialLinkAction({
          id: editingItem.id,
          platform: platform.trim(),
          url: url.trim(),
          icon_name: iconName.trim(),
        });
        setLinks(
          links.map((l) =>
            l.id === editingItem.id
              ? { ...l, platform: platform.trim(), url: url.trim(), iconName: iconName.trim() }
              : l
          )
        );
        showToast(`Updated "${platform}" successfully.`);
      } else {
        const newOrderIndex = links.length > 0 ? Math.max(...links.map((l) => l.orderIndex)) + 1 : 1;
        const res = await saveSocialLinkAction({
          platform: platform.trim(),
          url: url.trim(),
          icon_name: iconName.trim(),
          order_index: newOrderIndex,
        });

        const newLink: SocialLinkItem = {
          id: res.data?.id || `social-${Date.now()}`,
          platform: platform.trim(),
          url: url.trim(),
          iconName: iconName.trim(),
          orderIndex: newOrderIndex,
        };

        setLinks([...links, newLink]);
        showToast(`Added "${platform}" link.`);
      }
    } catch (err) {
      console.error("Save social link failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to save social link: ${msg}`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    try {
      await deleteSocialLinkAction(deletingItem.id);
      setLinks(links.filter((l) => l.id !== deletingItem.id));
      showToast(`Deleted social link.`);
    } catch (err) {
      console.error("Delete social link failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to delete social link: ${msg}`);
    }
    setDeletingItem(null);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const updated = [...links];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate order index
    const reordered = updated.map((item, idx) => ({ ...item, orderIndex: idx + 1 }));
    setLinks(reordered);

    try {
      await reorderSocialLinksAction([
        { id: updated[targetIndex].id, order_index: targetIndex + 1 },
        { id: updated[index].id, order_index: index + 1 },
      ]);
      showToast("Reordered social links.");
    } catch (err) {
      console.error("Reorder social links failed:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      showToast(`Failed to reorder social links: ${msg}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Share2 className="w-6 h-6 text-primary" />
            <span>Social &amp; Contact Links</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your external social profiles and contact links for the header and footer.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Link</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-card border border-border">
            <Share2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">No social links added yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click &quot;Add Social Link&quot; above to add your first profile link.
            </p>
          </div>
        ) : (
          links.map((link, idx) => (
            <div
              key={link.id}
              className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <DynamicIcon name={link.iconName} className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-heading font-semibold text-sm text-foreground truncate">
                    {link.platform}
                  </h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground disabled:opacity-30 transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === links.length - 1}
                  className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground disabled:opacity-30 transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(link)}
                  className="p-2 rounded-xl bg-muted/60 hover:bg-primary hover:text-primary-foreground text-foreground transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingItem(link)}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-card border border-border shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="font-heading font-bold text-base text-foreground">
                {editingItem ? "Edit Social Link" : "Add New Social Link"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Platform Name
                </label>
                <input
                  type="text"
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. GitHub, LinkedIn, Twitter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  URL
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setUrl(newUrl);
                    // Auto-detect icon when URL changes
                    if (newUrl) {
                      const detected = detectIconFromUrl(newUrl);
                      setIconName(detected);
                    }
                  }}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {url && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Auto-detected: {detectIconFromUrl(url)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Icon Selection
                </label>

                {/* Live Preview */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <DynamicIcon name={iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Current Icon</p>
                    <p className="text-[10px] text-muted-foreground">{iconName}</p>
                  </div>
                </div>

                {/* Visual Preset Chips with Icons */}
                <div className="flex flex-wrap gap-1.5">
                  {ICON_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setIconName(preset)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                        iconName === preset
                          ? "bg-primary text-primary-foreground shadow-sm scale-105"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      }`}
                      title={preset}
                    >
                      <DynamicIcon name={preset} className="w-3.5 h-3.5" />
                      <span>{preset}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  required
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  placeholder="Or type custom icon name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-[10px] text-muted-foreground">
                  Browse icons: Brand logos at{" "}
                  <a
                    href="https://simpleicons.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    simpleicons.org
                  </a>
                  , Generic at{" "}
                  <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    lucide.dev
                  </a>
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-sm"
                >
                  {editingItem ? "Save Changes" : "Add Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-card border border-border shadow-xl space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">Confirm Deletion</h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete the social link for &quot;{deletingItem.platform}&quot;?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-sm"
              >
                Delete Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
