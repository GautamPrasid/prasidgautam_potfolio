import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getHeroAboutFromDb, getSocialLinksFromDb, getSiteSettingsFromDb } from "@/lib/supabase-db";

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
  const profileImage = heroData?.profileImageUrl?.trim() || "";
  const name = siteSettings?.siteName?.trim() || heroData?.name?.trim() || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const description = siteSettings?.siteDescription?.trim() || "";
  const logoUrl = siteSettings?.logoUrl?.trim() || "/icon.svg";
  const titleString = name ? `${name} | Portfolio` : "Portfolio";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titleString,
      template: name ? `%s | ${name}` : "%s",
    },
    description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        ...(siteSettings?.logoUrl ? [{ url: logoUrl }] : []),
      ],
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    authors: name ? [{ name, url: siteUrl }] : [],
    creator: name || undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: titleString,
      description,
      siteName: name ? `${name} Portfolio` : "Portfolio",
      images: profileImage
        ? [
            {
              url: profileImage,
              width: 1200,
              height: 630,
              alt: name ? `${name} profile photo` : "Profile photo",
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: titleString,
      description,
      images: profileImage ? [profileImage] : [],
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
  const [socialLinks, heroData, siteSettings] = await Promise.all([
    getSocialLinksFromDb(),
    getHeroAboutFromDb(),
    getSiteSettingsFromDb(),
  ]);

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
        <Navbar siteName={heroData?.name} />
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
        />
      </body>
    </html>
  );
}
