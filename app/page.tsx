import { Github, Twitter, TwitterIcon } from "lucide-react";
import Link from "next/link";
import { Toaster } from 'sonner';
import Image from "next/image";

// Import components
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';
import BeforeAfter from '@/components/landing/before-after';
import Gallery from '@/components/landing/gallery';
import Testimonials from '@/components/landing/testimonials';
import CTA from '@/components/landing/cta';
import Navigation from '@/components/landing/navigation';
import { db } from "@/lib/db";

export default async function Landing() {
  const waitlistCount = 20 + ((await db.waitlist.count()) || 0)
  return (
    <div className="min-h-screen font-[Inter,Geist,sans-serif] bg-white relative">
      <Toaster position="top-center" richColors theme="light" />

      <Navigation />
      <Hero waitlistCount={waitlistCount} />
      <Features />
      <HowItWorks />
      <BeforeAfter />
      <Gallery />
      <Testimonials />
      <CTA waitlistCount={waitlistCount} />

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50/30 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Image src="/logo.png" alt="Snap AI Logo" width={32} height={32} className="rounded-full mr-3" />
              <span className="text-lg font-semibold tracking-tight text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>Snap AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link target="_blank" href='https://x.com/hassan_dev31' className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <TwitterIcon className="w-5 h-5 text-gray-600" />
              </Link>
              <Link target="_blank" href='https://github.com/hassan-31x' className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Github className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              © {new Date().getFullYear()} Snap AI. All rights reserved. Built with ❤️ for creators and brands.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}