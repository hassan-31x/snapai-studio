import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import Navigation from "@/components/landing/navigation";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import BeforeAfter from "@/components/landing/before-after";
import Gallery from "@/components/landing/gallery";
import Tagline from "@/components/landing/tagline";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";
import { brand } from "@/lib/brand";
import { publicPageMetadata, siteTitle, websiteSchema } from "@/lib/seo";
export const metadata = {
  ...publicPageMetadata(siteTitle, brand.description, "/"),
  title: { absolute: siteTitle },
};
export default function Landing() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navigation />
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <BeforeAfter />
        <Tagline />
        <Gallery />
        <FAQ />
        <CTA />
      </main>
      <footer className="section-wrap flex flex-wrap items-center justify-between gap-6 border-t py-8">
        <div>
          <BrandLogo />
          <p className="mt-3 text-xs text-muted-foreground">
            A little space for better product imagery.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/auth/login">Sign in</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SnapAI Studio
        </p>
      </footer>
    </>
  );
}
