"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  ImagePlus,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Layers,
  Share2,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import {
  getSiteSettingsFromDb,
  getSupabaseClient,
  SectionContentData,
  DEFAULT_SECTION_CONTENT,
} from "@/lib/supabase-db";
import { saveSiteSettingsAction, uploadAssetAction } from "@/app/admin/actions";

const VISIBILITY_SECTIONS: {
  key: "about" | "skills" | "projects" | "resume" | "blog" | "contact";
  label: string;
  desc: string;
}[] = [
  { key: "about", label: "About Me", desc: "Bio, stats, education summary, and personal narrative" },
  { key: "skills", label: "Skills & Technologies", desc: "Technical skill categories, proficiencies, and tools" },
  { key: "projects", label: "Projects Showcase", desc: "Featured projects with GitHub links and live demos" },
  { key: "resume", label: "Work & Education", desc: "Career timeline, academic degrees, and certifications" },
  { key: "blog", label: "Blog & Articles", desc: "Engineering deep-dives, articles, and tutorials" },
  { key: "contact", label: "Contact & Connect", desc: "Contact form, direct email/phone, and social links" },
];

const SECTION_CONFIGS: {
  key: "about" | "skills" | "projects" | "resume" | "blog";
  label: string;
  desc: string;
  defaultBadge: string;
  defaultHeading: string;
  defaultSubtext: string;
}[] = [
  {
    key: "about",
    label: "About Section",
    desc: "Badge, heading, and intro for the about section",
    defaultBadge: "About Me",
    defaultHeading: "My Background & Story",
    defaultSubtext: "A quick look at my journey, education, and development experience.",
  },
  {
    key: "skills",
    label: "Skills Section",
    desc: "Badge, heading, and intro for technical skills",
    defaultBadge: "Technical Expertise",
    defaultHeading: "Skills & Technologies",
    defaultSubtext: "Tools, languages, and frameworks I use to build modern applications.",
  },
  {
    key: "projects",
    label: "Projects Section",
    desc: "Badge, heading, and intro for project showcase",
    defaultBadge: "Portfolio Showcase",
    defaultHeading: "Featured Projects",
    defaultSubtext: "A curated collection of web applications, full-stack systems, and open-source projects.",
  },
  {
    key: "resume",
    label: "Resume Section",
    desc: "Badge, heading, and intro for qualifications and career",
    defaultBadge: "Career & Qualifications",
    defaultHeading: "Work & Education",
    defaultSubtext: "My professional journey, academic background, and verified industry certifications.",
  },
  {
    key: "blog",
    label: "Blog Section",
    desc: "Badge, heading, and intro for articles and insights",
    defaultBadge: "Articles & Insights",
    defaultHeading: "Latest from the Blog",
    defaultSubtext: "Thoughts, engineering deep-dives, and tutorials on modern web development, architecture, and technology.",
  },
];

export default function WebsiteSettingsPage() {
  const [siteName, setSiteName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [footerText, setFooterText] = useState("");
  const [sectionContent, setSectionContent] = useState<SectionContentData>({});
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const previewSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  useEffect(() => {
    let active = true;
    async function load() {
      const settings = await getSiteSettingsFromDb();
      if (!active) return;
      if (settings) {
        setSiteName(settings.siteName || "");
        setDescription(settings.siteDescription || "");
        setLogoUrl(settings.logoUrl || "");
        setOgImageUrl(settings.ogImageUrl || "");
        setFooterText(settings.footerText || "");
        setSectionContent(settings.sectionContent || {});
        setSectionVisibility(settings.sectionVisibility || {});
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
      if (logoUrl) formData.set("previousUrl", logoUrl);
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

  async function handleOgUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setMessage("");

    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      setError("Choose a PNG, JPG, WebP, or GIF image for social preview.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5MB or less.");
      event.target.value = "";
      return;
    }

    setUploadingOg(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "site");
      if (ogImageUrl) formData.set("previousUrl", ogImageUrl);
      const result = await uploadAssetAction(formData);
      if (!result.success || !result.data?.publicUrl) throw new Error(result.message || "Social preview upload failed.");
      setOgImageUrl(result.data.publicUrl);
      setMessage("Social preview image uploaded. Click Save Website Settings to publish it.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not upload social preview image.");
    } finally {
      setUploadingOg(false);
      event.target.value = "";
    }
  }

  const toggleSection = (key: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  };

  const updateSectionField = (
    key: keyof SectionContentData,
    field: string,
    value: string
  ) => {
    setSectionContent((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: value,
      },
    }));
  };

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
        og_image_url: ogImageUrl,
        footer_text: footerText,
        section_content: sectionContent,
        section_visibility: sectionVisibility,
      });
      if (!result.success) throw new Error(result.message);
      setMessage(result.message);
      // Re-read the public row so the form reflects the persisted values.
      const client = getSupabaseClient();
      if (client) {
        const { data } = await client
          .from("site_settings")
          .select("site_name,site_description,logo_url,og_image_url,footer_text,section_content,section_visibility")
          .eq("id", true)
          .maybeSingle();
        if (data) {
          setSiteName(data.site_name ?? siteName);
          setDescription(data.site_description ?? description);
          setLogoUrl(data.logo_url ?? "");
          setOgImageUrl(data.og_image_url ?? "");
          setFooterText(data.footer_text ?? "");
          setSectionContent((data.section_content as SectionContentData) ?? sectionContent);
          setSectionVisibility((data.section_visibility as Record<string, boolean>) ?? sectionVisibility);
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
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Control the public website identity, section headings, footer text, browser favicon, and search-engine description. Changes are stored in Supabase and used by the live website.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Website Identity */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Website identity</h2>
          <p className="mt-1 text-sm text-muted-foreground">This name is used for the browser/search title and site identity.</p>
          <label htmlFor="site-name" className="mt-5 block text-sm font-medium">Website name</label>
          <input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} maxLength={100} required className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="e.g. My Portfolio" />
        </section>

        {/* Website Logo / Favicon */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Website logo / favicon</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload an image or paste a public HTTPS image URL. The saved logo is used as the website favicon metadata.</p>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {logoUrl ? <img src={logoUrl} alt="Website logo preview" className="h-full w-full object-contain p-2" /> : <Globe className="h-9 w-9 text-muted-foreground" />}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="logo-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/60">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                  {uploading ? "Uploading logo…" : "Upload logo"}
                </label>
                <input id="logo-upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleLogoUpload} disabled={uploading} className="sr-only" />

                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove logo
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP or GIF · maximum 5 MB. A square image works best.</p>
            </div>
          </div>
          <label htmlFor="logo-url" className="mt-5 block text-sm font-medium">Logo image URL</label>
          <input id="logo-url" type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="https://…" />
          <p className="mt-2 text-xs text-muted-foreground">Changing this field only previews the logo. Click Save Website Settings to publish it.</p>
        </section>

        {/* Social Sharing & Open Graph Preview (OG Image) */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <div className="flex items-center gap-2 text-primary">
            <Share2 className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-foreground">Social Preview (Open Graph &amp; Twitter)</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload or paste an image URL (recommended: 1200×630px) used when your website link is shared on Twitter, LinkedIn, Facebook, Slack, and other platforms. If empty, social image tags are omitted.
          </p>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative flex h-36 w-full sm:w-60 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/40">
              {ogImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ogImageUrl} alt="Social preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-muted-foreground p-4 text-center">
                  <Share2 className="h-8 w-8 opacity-40" />
                  <span className="text-xs">No OG Image Set</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor="og-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/60"
                >
                  {uploadingOg ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                  {uploadingOg ? "Uploading OG image…" : "Upload OG image"}
                </label>
                <input
                  id="og-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleOgUpload}
                  disabled={uploadingOg}
                  className="sr-only"
                />

                {ogImageUrl && (
                  <button
                    type="button"
                    onClick={() => setOgImageUrl("")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove image
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP or GIF · maximum 5 MB. 1200×630px landscape ratio recommended.</p>
            </div>
          </div>

          <label htmlFor="og-url" className="mt-5 block text-sm font-medium">
            Social preview image URL
          </label>
          <input
            id="og-url"
            type="url"
            value={ogImageUrl}
            onChange={(e) => setOgImageUrl(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="https://… or upload above"
          />
        </section>

        {/* Section Visibility Controls */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-5">
          <div className="flex items-center gap-2 text-primary">
            <Eye className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-foreground">Section Visibility</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Control which sections appear on the live homepage and in navigation menus (Navbar and Footer). A section only renders if it is marked visible here AND has published content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {VISIBILITY_SECTIONS.map((sec) => {
              const isVisible = sectionVisibility[sec.key] !== false; // default true
              return (
                <div
                  key={sec.key}
                  className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
                    isVisible
                      ? "border-border bg-background/60"
                      : "border-border/60 bg-muted/30 opacity-75"
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{sec.label}</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          isVisible
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{sec.desc}</p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isVisible}
                    onClick={() => toggleSection(sec.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary ${
                      isVisible ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span className="sr-only">Toggle {sec.label}</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isVisible ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Search Engine Description */}
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
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Globe className="h-4 w-4" /><span>{previewSiteUrl}</span></div>
            <p className="mt-1 text-lg text-blue-700 dark:text-blue-400">{siteName || "Website name"} | Portfolio</p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{description || "Your website description will appear here."}</p>
          </div>
        </section>

        {/* Footer Text */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Footer Text</h2>
          <p className="mt-1 text-sm text-muted-foreground">Optional custom text displayed in the bottom sub-footer bar. Rendered only if non-empty.</p>
          <label htmlFor="footer-text" className="mt-5 block text-sm font-medium">Footer text</label>
          <input
            id="footer-text"
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            maxLength={200}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. All rights reserved."
          />
        </section>

        {/* Section Headings and Content */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Layers className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-foreground">Section Headings &amp; Titles</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSectionContent((prev) => ({
                  ...DEFAULT_SECTION_CONTENT,
                  ...prev,
                  about: { ...DEFAULT_SECTION_CONTENT.about, ...(prev.about || {}) },
                  skills: { ...DEFAULT_SECTION_CONTENT.skills, ...(prev.skills || {}) },
                  projects: { ...DEFAULT_SECTION_CONTENT.projects, ...(prev.projects || {}) },
                  resume: { ...DEFAULT_SECTION_CONTENT.resume, ...(prev.resume || {}) },
                  blog: { ...DEFAULT_SECTION_CONTENT.blog, ...(prev.blog || {}) },
                  contact: { ...DEFAULT_SECTION_CONTENT.contact, ...(prev.contact || {}) },
                }));
                setMessage("Populated with recommended section titles! Click Save Website Settings below to store in Supabase.");
              }}
              className="inline-flex items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              Fill Recommended Titles
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure the badge, heading, and subtext for each section on the portfolio. If a field is left empty, the recommended default title displays automatically.
          </p>

          <div className="space-y-6 divide-y divide-border">
            {SECTION_CONFIGS.map((sec) => {
              const current = sectionContent[sec.key] || {};
              return (
                <div key={sec.key} className="pt-6 first:pt-0 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{sec.label}</h3>
                    <p className="text-xs text-muted-foreground">{sec.desc}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground">Badge</label>
                      <input
                        type="text"
                        value={current.badge || ""}
                        onChange={(e) => updateSectionField(sec.key, "badge", e.target.value)}
                        placeholder={sec.defaultBadge}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground">Heading / Title</label>
                      <input
                        type="text"
                        value={current.heading || ""}
                        onChange={(e) => updateSectionField(sec.key, "heading", e.target.value)}
                        placeholder={sec.defaultHeading}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground">Subtext / Description</label>
                      <input
                        type="text"
                        value={current.subtext || ""}
                        onChange={(e) => updateSectionField(sec.key, "subtext", e.target.value)}
                        placeholder={sec.defaultSubtext}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Contact Section Group */}
            <div className="pt-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Contact &amp; Footer Connect Copy</h3>
                <p className="text-xs text-muted-foreground">Configure the contact section header, direct contact card prompt, and footer chat card copy.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">Badge</label>
                  <input
                    type="text"
                    value={sectionContent.contact?.badge || ""}
                    onChange={(e) => updateSectionField("contact", "badge", e.target.value)}
                    placeholder="e.g. Contact"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">Heading</label>
                  <input
                    type="text"
                    value={sectionContent.contact?.heading || ""}
                    onChange={(e) => updateSectionField("contact", "heading", e.target.value)}
                    placeholder="e.g. Get in Touch"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">Subtext</label>
                  <input
                    type="text"
                    value={sectionContent.contact?.subtext || ""}
                    onChange={(e) => updateSectionField("contact", "subtext", e.target.value)}
                    placeholder="e.g. Send a message..."
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">Footer Connect Heading</label>
                  <input
                    type="text"
                    value={sectionContent.contact?.connectHeading || ""}
                    onChange={(e) => updateSectionField("contact", "connectHeading", e.target.value)}
                    placeholder="e.g. Let's Connect"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">CTA Card Title</label>
                  <input
                    type="text"
                    value={sectionContent.contact?.ctaHeading || ""}
                    onChange={(e) => updateSectionField("contact", "ctaHeading", e.target.value)}
                    placeholder="e.g. Have a project in mind?"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">CTA Card Subtitle</label>
                  <input
                    type="text"
                    value={sectionContent.contact?.ctaSubtext || ""}
                    onChange={(e) => updateSectionField("contact", "ctaSubtext", e.target.value)}
                    placeholder="e.g. Let's discuss how I can help."
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
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
