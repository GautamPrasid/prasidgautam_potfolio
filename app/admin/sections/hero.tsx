"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  Upload,
  FileText,
  ExternalLink,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { getHeroAboutFromDb, getSupabaseClient } from "@/lib/supabase-db";
import { saveHeroAboutAction } from "@/app/admin/actions";

export default function HeroAboutManagerPage() {
  const [heroId, setHeroId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");

  const [resumeUrl, setResumeUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [connectHeading, setConnectHeading] = useState("Connect With Me");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  const [philosophyQuote, setPhilosophyQuote] = useState("");
  const [responseTimeText, setResponseTimeText] = useState("");

  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);

  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [profileUploadError, setProfileUploadError] = useState<string | null>(null);

  const [projectsCount, setProjectsCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [techCount, setTechCount] = useState(0);

  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getHeroAboutFromDb();
      if (active && data) {
        if (data.id) setHeroId(data.id);
        setName(data.name ?? "");
        setRoles(data.roles ?? []);
        setBio(data.bioText ?? "");
        setAbout(data.aboutText ?? "");
        setResumeUrl(data.resumeUrl ?? "");
        setProfileImageUrl(data.profileImageUrl ?? "");
        setGithubUrl(data.githubUrl ?? "");
        setContactEmail(data.contactEmail ?? "");
        setContactPhone(data.contactPhone ?? "");
        setLocation(data.location ?? "");
        setConnectHeading(data.connectHeading ?? "Connect With Me");
        setHighlights(data.highlights ?? []);
        setPhilosophyQuote(data.philosophyQuote ?? "");
        setResponseTimeText(data.responseTimeText ?? "");
        setProjectsCount(data.stats?.projects ?? 0);
        setCertsCount(data.stats?.certifications ?? 0);
        setTechCount(data.stats?.technologies ?? 0);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);


  const extractStoragePath = (url: string, folder: string): string | null => {
    if (!url || !url.includes(`/portfolio-assets/${folder}/`)) return null;
    const parts = url.split(`/portfolio-assets/${folder}/`);
    return parts[1] ? `${folder}/${parts[1]}` : null;
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setResumeUploadError("Please select a valid PDF file for the resume.");
      return;
    }

    setIsUploadingResume(true);
    setResumeUploadError(null);

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Supabase client not initialized.");
      }

      // Delete old file from storage if present to avoid orphaned files
      const oldPath = extractStoragePath(resumeUrl, "resume");
      if (oldPath) {
        await client.storage.from("portfolio-assets").remove([oldPath]);
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `resume/${fileName}`;

      const { error: uploadErr } = await client.storage
        .from("portfolio-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadErr) {
        throw uploadErr;
      }

      const {
        data: { publicUrl },
      } = client.storage.from("portfolio-assets").getPublicUrl(filePath);

      setResumeUrl(publicUrl);
    } catch (err: unknown) {
      console.error("Resume upload failed:", err);
      const message =
        err instanceof Error ? err.message : "PDF upload failed. Check portfolio-assets bucket.";
      setResumeUploadError(message);
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileUploadError("Please select a valid image file.");
      return;
    }

    setIsUploadingProfile(true);
    setProfileUploadError(null);

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Supabase client not initialized.");
      }

      // Delete old file from storage if present to avoid orphaned files
      const oldPath = extractStoragePath(profileImageUrl, "profile");
      if (oldPath) {
        await client.storage.from("portfolio-assets").remove([oldPath]);
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadErr } = await client.storage
        .from("portfolio-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadErr) {
        throw uploadErr;
      }

      const {
        data: { publicUrl },
      } = client.storage.from("portfolio-assets").getPublicUrl(filePath);

      setProfileImageUrl(publicUrl);
    } catch (err: unknown) {
      console.error("Profile photo upload failed:", err);
      const message =
        err instanceof Error ? err.message : "Image upload failed. Check portfolio-assets bucket.";
      setProfileUploadError(message);
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole("");
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles(roles.filter((r) => r !== roleToRemove));
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (itemToRemove: string) => {
    setHighlights(highlights.filter((h) => h !== itemToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    try {
      await saveHeroAboutAction({
        id: heroId || "a0000000-0000-0000-0000-000000000001",
        name,
        roles,
        bio_text: bio,
        about_text: about,
        resume_url: resumeUrl.trim() || null,
        profile_image_url: profileImageUrl.trim() || null,
        github_url: githubUrl.trim() || null,
        contact_email: contactEmail.trim() || null,
        contact_phone: contactPhone.trim() || null,
        location: location.trim() || null,
        connect_heading: connectHeading.trim() || "Connect With Me",
        highlights,
        philosophy_quote: philosophyQuote.trim() || null,
        response_time_text: responseTimeText.trim() || null,
        stats: {
          projects: projectsCount,
          certifications: certsCount,
          technologies: techCount,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      const message = err instanceof Error ? err.message : "Save failed unexpectedly.";
      setSaveError(message);
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Hero &amp; About Manager
          </h1>
          <p className="text-xs text-muted-foreground">
            Edit your intro headline, rotating role tags, bio narrative, and stats.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Hero &amp; About information saved successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-start gap-2">
          <span className="shrink-0 mt-0.5">✕</span>
          <span><strong>Save failed:</strong> {saveError}</span>
        </div>
      )}

      {/* Editor & Live Preview 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-5">
            <h2 className="font-heading font-bold text-base text-foreground border-b border-border pb-3">
              Personal Information &amp; Roles
            </h2>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Roles Array */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Rotating Roles
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-medium flex items-center gap-1.5"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(role)}
                      className="hover:text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Add new role (e.g. UI/UX Designer)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-3.5 py-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Hero Bio */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Hero Short Bio Paragraph
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* About Narrative */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                About Section Narrative
              </label>
              <textarea
                rows={5}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Enter narrative paragraphs (separate paragraphs with new lines)..."
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Highlights Array */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Key Highlights / Bullets
              </label>
              <div className="space-y-1.5 mb-2">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="px-3 py-1.5 rounded-xl bg-muted/60 text-foreground border border-border text-xs font-medium flex items-center justify-between gap-2"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(item)}
                      className="hover:text-rose-500 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add bullet highlight (e.g. BCA Undergraduate)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3.5 py-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Philosophy Quote */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Personal Philosophy / Mission Quote
              </label>
              <textarea
                rows={2}
                value={philosophyQuote}
                onChange={(e) => setPhilosophyQuote(e.target.value)}
                placeholder="e.g. Building software isn't just about writing syntax..."
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Profile Image & PDF Resume Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-5">
            <h2 className="font-heading font-bold text-base text-foreground border-b border-border pb-3 flex items-center justify-between">
              <span>Profile Image &amp; Resume Document</span>
              <UserCheck className="w-4 h-4 text-primary" />
            </h2>

            {/* Profile Photo Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Profile Photo
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                {profileImageUrl ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border bg-muted shrink-0">
                    <Image
                      src={profileImageUrl}
                      alt={name ? `${name} profile photo preview` : "Profile photo preview"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted border border-dashed border-border flex items-center justify-center shrink-0 text-muted-foreground">
                    <Upload className="w-5 h-5 opacity-50" />
                  </div>
                )}

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-sm hover:bg-primary/90 flex items-center gap-1.5 transition-colors">
                      {isUploadingProfile ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{profileImageUrl ? "Replace Photo" : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingProfile}
                        onChange={handleProfileUpload}
                        className="hidden"
                      />
                    </label>

                    {profileImageUrl && (
                      <button
                        type="button"
                        onClick={() => setProfileImageUrl("")}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  {profileImageUrl ? (
                    <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                      {profileImageUrl}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      No profile photo uploaded yet. (Defaults to site fallback)
                    </p>
                  )}
                  {profileUploadError && (
                    <p className="text-[11px] text-rose-500 font-medium">{profileUploadError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume PDF Upload */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Resume Document (PDF)
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-sm hover:bg-primary/90 flex items-center gap-1.5 transition-colors">
                      {isUploadingResume ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{resumeUrl ? "Replace Resume (PDF)" : "Upload Resume (PDF)"}</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        disabled={isUploadingResume}
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>

                    {resumeUrl && (
                      <>
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-primary" />
                          <span>View PDF</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => setResumeUrl("")}
                          className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </>
                    )}
                  </div>
                  {resumeUrl ? (
                    <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                      {resumeUrl}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      No resume PDF uploaded yet.
                    </p>
                  )}
                  {resumeUploadError && (
                    <p className="text-[11px] text-rose-500 font-medium">{resumeUploadError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-base text-foreground border-b border-border pb-3">
              Social &amp; Contact Links
            </h2>

            {/* GitHub URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Used in: Hero social icons, Projects &quot;View All&quot; button, Footer.
                Leave blank to hide all GitHub links.
              </p>
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Contact Email Address
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. hello@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +977 9800000000"
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pokhara, Nepal"
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Connect Heading */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Connect Section Heading
              </label>
              <input
                type="text"
                value={connectHeading}
                onChange={(e) => setConnectHeading(e.target.value)}
                placeholder="e.g. Connect With Me"
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Average Response Time Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Average Response Time Banner
              </label>
              <input
                type="text"
                value={responseTimeText}
                onChange={(e) => setResponseTimeText(e.target.value)}
                placeholder="e.g. Average response time: Within 24 hours."
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Stats Editor Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-base text-foreground border-b border-border pb-3">
              Stats Counter Numbers
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-muted-foreground">
                  Projects Count
                </label>
                <input
                  type="number"
                  value={projectsCount}
                  onChange={(e) => setProjectsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm font-bold text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-muted-foreground">
                  Certifications Count
                </label>
                <input
                  type="number"
                  value={certsCount}
                  onChange={(e) => setCertsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm font-bold text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-muted-foreground">
                  Technologies Count
                </label>
                <input
                  type="number"
                  value={techCount}
                  onChange={(e) => setTechCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm font-bold text-foreground"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Live Preview Side Panel */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Eye className="w-4 h-4 text-primary" />
            <span>Live Site Preview</span>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-lg space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Hero Section
              </span>
              <h3 className="font-heading text-xl font-extrabold text-foreground">
                Hi, I&apos;m <span className="text-primary">{name}</span> 👋
              </h3>
              {roles[0] && (
                <p className="text-xs font-semibold text-primary">
                  {roles[0]}
                </p>
              )}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {bio}
              </p>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                About Section
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                {about}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2 rounded-xl bg-muted/60 border border-border">
                <p className="font-heading text-base font-bold text-foreground">{projectsCount}+</p>
                <p className="text-[10px] text-muted-foreground">Projects</p>
              </div>
              <div className="p-2 rounded-xl bg-muted/60 border border-border">
                <p className="font-heading text-base font-bold text-foreground">{certsCount}+</p>
                <p className="text-[10px] text-muted-foreground">Certs</p>
              </div>
              <div className="p-2 rounded-xl bg-muted/60 border border-border">
                <p className="font-heading text-base font-bold text-foreground">{techCount}+</p>
                <p className="text-[10px] text-muted-foreground">Tech</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
