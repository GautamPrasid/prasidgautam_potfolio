import type { ComponentType, SVGProps } from "react";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import * as SimpleIcons from "simple-icons";

// Brand icons mapping (Simple Icons uses lowercase with "si" prefix)
const BRAND_ICONS: Record<string, string> = {
  Github: "siGithub",
  Linkedin: "siLinkedin",
  Twitter: "siTwitter",
  X: "siX",
  Instagram: "siInstagram",
  Facebook: "siFacebook",
  Youtube: "siYoutube",
  Whatsapp: "siWhatsapp",
  Telegram: "siTelegram",
  Discord: "siDiscord",
  Slack: "siSlack",
  Reddit: "siReddit",
  Tiktok: "siTiktok",
  Snapchat: "siSnapchat",
  Pinterest: "siPinterest",
  Codepen: "siCodepen",
  Stackoverflow: "siStackoverflow",
  Medium: "siMedium",
  Dribbble: "siDribbble",
  Behance: "siBehance",
  Figma: "siFigma",
};

export function DynamicIcon({ name, ...props }: LucideProps & { name: string }) {
  const key = (name || "Share2").trim();

  // Brand logos are intentionally not included in Lucide. Render GitHub's
  // official mark directly so it can never silently fall back to Share2.
  const normalized = key.toLowerCase().replace(/[\s_-]+/g, "");
  if (normalized === "github" || normalized === "githubicon") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        role="img"
        aria-label="GitHub"
        {...props}
      >
        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.77 2.05 3.48 1.45.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.24-5.07-5.5 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.27-2.6 5.22-5.08 5.5.4.35.75 1.03.75 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    );
  }

  const pascal = key
    .toLowerCase()
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const aliases: Record<string, string> = {
    Email: "Mail",
    Location: "MapPin",
    Website: "Globe",
  };

  const resolved = aliases[pascal] || pascal;
  
  // Check if it's a brand icon first
  if (BRAND_ICONS[resolved]) {
    const iconSlug = resolved.toLowerCase();
    const iconData = SimpleIcons[`si${resolved}` as keyof typeof SimpleIcons];
    
    if (iconData && typeof iconData === 'object' && 'path' in iconData) {
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          fill="currentColor"
          {...(props as SVGProps<SVGSVGElement>)}
        >
          <path d={(iconData as { path: string }).path} />
        </svg>
      );
    }
  }
  
  // Fall back to Lucide icons
  const Icon =
    (Icons as unknown as Record<string, ComponentType<LucideProps>>)[resolved] ||
    Icons.Share2;

  return <Icon {...props} />;
}
