import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { brand } from "@/lib/brand";
import { siteTitle, socialImage } from "@/lib/seo";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s · SnapAI Studio",
  },
  description: brand.description,
  metadataBase: new URL(brand.url),
  applicationName: brand.name,
  category: "design",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    title: siteTitle,
    description: brand.description,
    siteName: brand.name,
    type: "website",
    locale: "en_US",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: brand.description,
    images: [socialImage],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${GeistSans.variable} antialiased`}>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-primary p-3 text-primary-foreground focus:translate-y-0"
        >
          Skip to content
        </a>
        <SessionProvider refetchOnWindowFocus={false}>
          {children}
          <Toaster richColors position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
