import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  getHeroAboutFromDb,
  getSocialLinksFromDb,
  getSiteSettingsFromDb,
  getSkillsFromDb,
  getEducationFromDb,
  getExperienceFromDb,
  getProjectsFromDb,
  getCertificationsFromDb,
  getBlogsFromDb,
} from "@/lib/supabase-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [heroData, siteSettings] = await Promise.all([getHeroAboutFromDb(), getSiteSettingsFromDb()]);
  const rawName = siteSettings?.siteName?.trim() || heroData?.name?.trim() || "";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prasidgautam.com.np").replace(/\/$/, "");
  const description =
    siteSettings?.siteDescription?.trim() ||
    "Explore the portfolio of Prasid Gautam, a BCA student and software developer from Pokhara, Nepal, showcasing projects, skills, and experience in web development.";

  // Prevent duplicate "| Portfolio" if the name already contains Portfolio
  const baseName = rawName.replace(/\s*\|\s*portfolio\s*$/i, "").trim() || rawName;
  const titleString = !rawName
    ? "Portfolio"
    : /portfolio/i.test(rawName)
      ? rawName
      : `${rawName} | Portfolio`;

  const logoUrl = siteSettings?.logoUrl?.trim();
  const ogImageUrl = siteSettings?.ogImageUrl?.trim();

  // Social Preview: used for openGraph and twitter images in metadata. Omit tags if empty.
  const openGraphImages = ogImageUrl
    ? [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: titleString,
        },
      ]
    : undefined;

  const twitterImages = ogImageUrl ? [ogImageUrl] : undefined;

  // Use logo_url as the favicon if no separate favicon exists
  const iconsConfig = logoUrl
    ? {
        icon: [{ url: logoUrl }],
        shortcut: logoUrl,
        apple: logoUrl,
      }
    : {
        icon: [{ url: "/favicon.ico", sizes: "any" }],
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
      };

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titleString,
      template: baseName ? `%s | ${baseName}` : "%s",
    },
    description,
    alternates: { canonical: "/" },
    icons: iconsConfig,
    authors: baseName ? [{ name: baseName, url: siteUrl }] : [],
    creator: baseName || undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: titleString,
      description,
      siteName: titleString,
      ...(openGraphImages ? { images: openGraphImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titleString,
      description,
      ...(twitterImages ? { images: twitterImages } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [
    socialLinks,
    heroData,
    siteSettings,
    skills,
    education,
    experience,
    projects,
    certifications,
    blogs,
  ] = await Promise.all([
    getSocialLinksFromDb(),
    getHeroAboutFromDb(),
    getSiteSettingsFromDb(),
    getSkillsFromDb(),
    getEducationFromDb(),
    getExperienceFromDb(),
    getProjectsFromDb(),
    getCertificationsFromDb(),
    getBlogsFromDb(),
  ]);

  const visibility = siteSettings?.sectionVisibility ?? {};

  const hasAbout = Boolean(heroData?.aboutText?.trim() || heroData?.bioText?.trim());
  const showAbout = visibility.about !== false && hasAbout;

  const hasSkills = (skills?.length ?? 0) > 0;
  const showSkills = visibility.skills !== false && hasSkills;

  const hasProjects = (projects?.length ?? 0) > 0;
  const showProjects = visibility.projects !== false && hasProjects;

  const hasResume = Boolean(
    (education?.length ?? 0) > 0 ||
    (experience?.length ?? 0) > 0 ||
    (certifications?.length ?? 0) > 0 ||
    heroData?.resumeUrl
  );
  const showResume = visibility.resume !== false && hasResume;

  const hasBlog = (blogs?.length ?? 0) > 0;
  const showBlog = visibility.blog !== false && hasBlog;

  const hasContact = Boolean(
    heroData?.contactEmail ||
    heroData?.contactPhone ||
    (socialLinks?.length ?? 0) > 0
  );
  const showContact = visibility.contact !== false && hasContact;

  const navItems = [
    { label: "Home", href: "#home", id: "home" },
    ...(showAbout ? [{ label: "About", href: "#about", id: "about" }] : []),
    ...(showSkills ? [{ label: "Skills", href: "#skills", id: "skills" }] : []),
    ...(showProjects ? [{ label: "Projects", href: "#projects", id: "projects" }] : []),
    ...(showResume ? [{ label: "Resume", href: "#resume", id: "resume" }] : []),
    ...(showBlog ? [{ label: "Blog", href: "#blog", id: "blog" }] : []),
    ...(showContact ? [{ label: "Contact", href: "#contact", id: "contact" }] : []),
  ];

  const quickLinks = navItems.map((item) => ({ label: item.label, href: item.href }));

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary`}
      >
        <ScrollProgress />
        <Navbar siteName={heroData?.name} items={navItems} />
        <main className="flex-1">{children}</main>
        <Footer
          initialSocialLinks={socialLinks}
          siteName={siteSettings?.siteName || heroData?.name}
          bio={heroData?.bioText}
          location={heroData?.location}
          availabilityText={heroData?.availabilityText}
          footerText={siteSettings?.footerText}
          connectHeading={heroData?.connectHeading || siteSettings?.sectionContent?.contact?.connectHeading}
          ctaHeading={siteSettings?.sectionContent?.contact?.ctaHeading}
          ctaSubtext={siteSettings?.sectionContent?.contact?.ctaSubtext}
          contactEmail={heroData?.contactEmail}
          contactPhone={heroData?.contactPhone}
          logoUrl={siteSettings?.logoUrl}
          quickLinks={quickLinks}
        />
      </body>
    </html>
  );
}
