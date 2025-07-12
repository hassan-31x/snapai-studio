import type { Metadata } from "next";
// import { Geist,  } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import Clarity from '@microsoft/clarity';

import { auth } from "@/auth";

import "./globals.css";
import Script from "next/script";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Snap AI | AI Ad Creatives in Minutes",
  description:
    "Generate scroll-stopping ad creatives for your brand in seconds. Join the waitlist for Snap AI, the modern AI-powered ad creative tool.",
  metadataBase: new URL("https://snapai.studio"),
  openGraph: {
    title: "Snap AI | AI Ad Creatives in Minutes",
    description:
      "Generate scroll-stopping ad creatives for your brand in seconds. Join the waitlist for Snap AI, the modern AI-powered ad creative tool.",
    url: "https://snapai.studio",
    siteName: "Snap AI",
    images: [
      {
        url: "https://snapai.studio/og-image.png",
        width: 1200,
        height: 630,
        alt: "Snap AI | AI Ad Creatives in Minutes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap AI | AI Ad Creatives in Minutes",
    description:
      "Generate scroll-stopping ad creatives for your brand in seconds. Join the waitlist for Snap AI, the modern AI-powered ad creative tool.",
    images: ["https://snapai.studio/og-image.png"],
    creator: "@hassan_dev31",
  },
  keywords: [
    "AI ad creative",
    "AI marketing",
    "ad generator",
    "snap ai",
    "waitlist",
    "SaaS",
    "brand ads",
    "ad automation",
  ],
  authors: [{ name: "Hassan", url: "https://x.com/hassan_dev31" }],
  creator: "Hassan",
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  const projectId = "sdn4w6tods"
  Clarity.init(projectId);

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
        <Script
          id="microsoft-clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "sdn4w6tods");
            `,
          }}
        />
      </html>
    </SessionProvider>
  );
}
