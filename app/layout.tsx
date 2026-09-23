import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://prasidgautam.dev"),
  title: {
    default: "Prasid Gautam | Full-Stack Web Developer & BCA Student",
    template: "%s | Prasid Gautam",
  },
  description:
    "Personal portfolio of Prasid Gautam — Full-Stack Web Developer and BCA student at La Grande International College. Specializing in Next.js 14, React, TypeScript, Supabase, and Node.js.",
  keywords: [
    "Prasid Gautam",
    "Full-Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "BCA Student",
    "La Grande International College",
    "Pokhara Nepal Developer",
    "Web Application Developer",
  ],
  authors: [{ name: "Prasid Gautam", url: "https://prasidgautam.dev" }],
  creator: "Prasid Gautam",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prasidgautam.dev",
    title: "Prasid Gautam | Full-Stack Web Developer",
    description:
      "Full-Stack Web Developer specializing in Next.js 14, React, TypeScript, and Supabase.",
    siteName: "Prasid Gautam Portfolio",
    images: [
      {
        url: "/images/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Prasid Gautam - Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prasid Gautam | Full-Stack Web Developer",
    description:
      "Full-Stack Web Developer specializing in Next.js 14, React, TypeScript, and Supabase.",
    creator: "@prasidgautam",
    images: ["/images/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
