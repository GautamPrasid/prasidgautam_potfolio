"use client";

import { useEffect, useState } from "react";
import { Globe, ImagePlus, Save, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { getSiteSettingsFromDb, getSupabaseClient } from "@/lib/supabase-db";
import { saveSiteSettingsAction, uploadAssetAction } from "@/app/admin/actions";

const DEFAULT_DESCRIPTION =
  "Explore the portfolio of Prasid Gautam, a BCA student and software developer in Nepal, showcasing web development projects, technical skills, education, and experience.";

export default function WebsiteSettingsPage() {
  const [siteName, setSiteName] = useState("Prasid Gautam");
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      const settings = await getSiteSettingsFromDb();
      if (!active) return;
      if (settings) {
        setSiteName(settings.siteName || "Prasid Gautam");
        setDescription(settings.siteDescription || DEFAULT_DESCRIPTION);
        setLogoUrl(settings.logoUrl || "");
      }
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, []);

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setMessage("");

    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      setError("Choose a PNG, JPG, WebP, or GIF image. For SVG logos, paste a trusted HTTPS logo URL instead.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5MB or less.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "site");
      const result = await uploadAssetAction(formData);
      if (!result.success || !result.data?.publicUrl) throw new Error(result.message || "Logo upload failed.");
      setLogoUrl(result.data.publicUrl);
      setMessage("Logo uploaded. Click Save Website Settings to publish it.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not upload logo.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await saveSiteSettingsAction({
        site_name: siteName,
        site_description: description,
        logo_url: logoUrl,
      });
      if (!result.success) throw new Error(result.message);
      setMessage(result.message);
      // Re-read the public row so the form reflects the persisted values.
      const client = getSupabaseClient();
      if (client) {
        const { data } = await client.from("site_settings").select("site_name,site_description,logo_url").eq("id", true).maybeSingle();
        if (data) {
          setSiteName(data.site_name ?? siteName);
          setDescription(data.site_description ?? description);
          setLogoUrl(data.logo_url ?? "");
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save website settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex items-center gap-3 py-16 text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading website settings…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <div className="mb-3 flex items-center gap-2 text-primary"><Globe className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.2em]">Site Configuration</span></div>
        <h1 className="text-3xl font-bold tracking-tight">Website Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Control the public website identity, browser favicon, and search-engine description from this admin panel. Changes are stored in Supabase and used by the live website.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Website identity</h2>
          <p className="mt-1 text-sm text-muted-foreground">This name is used for the browser/search title and site identity.</p>
          <label htmlFor="site-name" className="mt-5 block text-sm font-medium">Website name</label>
          <input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} maxLength={100} required className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Prasid Gautam" />
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Website logo / favicon</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload an image or paste a public HTTPS image URL. The saved logo is used as the website favicon metadata.</p>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {logoUrl ? <img src={logoUrl} alt="Website logo preview" className="h-full w-full object-contain p-2" /> : <Globe className="h-9 w-9 text-muted-foreground" />}
            </div>
            <div className="flex-1 space-y-3">
              <label htmlFor="logo-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/60">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {uploading ? "Uploading logo…" : "Upload logo"}
              </label>
              <input id="logo-upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleLogoUpload} disabled={uploading} className="sr-only" />
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP or GIF · maximum 5 MB. A square image works best.</p>
            </div>
          </div>
          <label htmlFor="logo-url" className="mt-5 block text-sm font-medium">Logo image URL</label>
          <input id="logo-url" type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="https://…" />
          <p className="mt-2 text-xs text-muted-foreground">Changing this field only previews the logo. Click Save Website Settings to publish it.</p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Search engine description</h2>
              <p className="mt-1 text-sm text-muted-foreground">Used for the homepage meta description and social sharing previews.</p>
            </div>
            <span className={description.length > 160 ? "text-xs font-medium text-amber-600" : "text-xs text-muted-foreground"}>{description.length}/320</span>
          </div>
          <label htmlFor="site-description" className="mt-5 block text-sm font-medium">Website description</label>
          <textarea id="site-description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={320} rows={4} required className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Describe your website for search results…" />
          <p className="mt-2 text-xs text-muted-foreground">Aim for around 150–160 characters. Google may choose a different snippet and updates its search results on its own schedule.</p>
          <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search result preview</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Globe className="h-4 w-4" /><span>https://www.prasidgautam.com.np</span></div>
            <p className="mt-1 text-lg text-blue-700 dark:text-blue-400">{siteName || "Website name"} | Portfolio</p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{description || "Your website description will appear here."}</p>
          </div>
        </section>

        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
        {message && <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{message}</div>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">Google Search Console <ExternalLink className="h-4 w-4" /></a>
          <button type="submit" disabled={saving || uploading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Website Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
