import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getHeroAboutFromDb, getSocialLinksFromDb } from "@/lib/supabase-db";

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
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export async function generateMetadata(): Promise<Metadata> {
  const heroData = await getHeroAboutFromDb();
  const profileImage = heroData?.profileImageUrl?.trim() || "";
  const name = heroData?.name?.trim() || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prasidgautam.com.np";
  const bio = heroData?.bioText?.trim() || "";

  const titleString = name ? `${name} | Portfolio` : "Portfolio";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titleString,
      template: name ? `%s | ${name}` : "%s | Portfolio",
    },
    description: bio,
    authors: name ? [{ name, url: siteUrl }] : [],
    creator: name || undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: titleString,
      description: bio,
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
      description: bio,
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
  const [socialLinks, heroData] = await Promise.all([
    getSocialLinksFromDb(),
    getHeroAboutFromDb(),
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
          siteName={heroData?.name}
          bio={heroData?.bioText}
          location={heroData?.location}
        />
      </body>
    </html>
  );
}
