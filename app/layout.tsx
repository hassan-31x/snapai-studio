import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { brand } from "@/lib/brand";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Stillframe · Your independent creative studio",
    template: "%s · Stillframe",
  },
  description: brand.description,
  metadataBase: new URL(brand.url),
  openGraph: {
    title: "Stillframe · Your product. A whole new perspective.",
    description: brand.description,
    siteName: brand.name,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.name,
    description: brand.description,
    images: ["/opengraph-image"],
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
