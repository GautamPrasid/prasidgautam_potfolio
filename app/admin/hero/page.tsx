"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, Eye } from "lucide-react";

export default function HeroAboutManagerPage() {
  const [name, setName] = useState("Prasid Gautam");
  const [roles, setRoles] = useState<string[]>([
    "Full-Stack Developer",
    "BCA Student",
    "Problem Solver",
  ]);
  const [newRole, setNewRole] = useState("");
  const [bio, setBio] = useState(
    "Passionate Full-Stack Developer and BCA student at La Grande International College. I craft modern, performant web applications with clean architecture and intuitive user experiences."
  );
  const [about, setAbout] = useState(
    "Hello! I'm Prasid Gautam, a passionate software developer currently pursuing my Bachelor of Computer Applications (BCA) at La Grande International College. My journey into tech started with a curiosity for how web platforms work behind the scenes. Over the years, that curiosity grew into a dedication to building scalable web applications, sleek user interfaces, and robust server architectures."
  );

  const [projectsCount, setProjectsCount] = useState(15);
  const [certsCount, setCertsCount] = useState(8);
  const [techCount, setTechCount] = useState(12);

  const [saved, setSaved] = useState(false);

  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole("");
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles(roles.filter((r) => r !== roleToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
                Hi, I&apos;m <span className="text-primary">{name || "Your Name"}</span> 👋
              </h3>
              <p className="text-xs font-semibold text-primary">
                {roles[0] || "Full-Stack Developer"}
              </p>
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
