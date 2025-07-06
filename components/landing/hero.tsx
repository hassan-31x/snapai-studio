'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from "next/image";

interface HeroProps {
  waitlistCount: number;
  setWaitlistCount: (count: number) => void;
}

const Hero = ({ waitlistCount, setWaitlistCount }: HeroProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.loading('Checking...');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      toast.dismiss();
      if (data.success) {
        setIsSubmitted(true);
        setWaitlistCount(data.count);
        toast.success('Added to waitlist!');
      } else if (res.status === 409) {
        toast.error('Email already on waitlist.');
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch {
      toast.dismiss();
      toast.error('Server error.');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen w-full bg-white relative">
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute inset-0 z-0 px-6 pt-36"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
            radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.13), transparent),
            radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.13), transparent)
          `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
        }}
      >
        <div className="text-center max-w-xl mx-auto">
          {/* Animated Waitlist Dock */}
          <div className="inline-flex items-center glass rounded-full px-4 py-2 mb-8 floating-animation shadow-2xl border border-gray-100/60" style={{boxShadow:'0 8px 32px 0 rgba(60,60,120,0.10), 0 1.5px 6px 0 rgba(120,120,180,0.08)'}}>
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-xs text-gray-500 font-medium tracking-tight">{waitlistCount.toLocaleString()} designers joined the waitlist</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold mb-1 leading-tight tracking-tight text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>AI for modern brands</h2>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight tracking-tight text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>Create ad creatives, instantly.</h1>
          <p className="text-base md:text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed font-normal" style={{fontFamily:'Inter,Geist,sans-serif'}}>
            Generate beautiful, high-converting ad creatives for your brand in seconds. Minimal effort, maximum impact.<br/>
            <span className="text-gray-400">No design skills needed. Just describe your brand and get scroll-stopping ads for every platform, powered by AI.</span>
          </p>

          {/* Waitlist Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-5 py-3 rounded-lg bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-200 text-sm placeholder:text-gray-400 font-medium shadow-sm transition-all"
                required
                style={{fontFamily:'Inter,Geist,sans-serif', boxShadow:'0 2px 8px 0 rgba(60,60,120,0.04)'}}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-md hover:bg-gray-700 cursor-pointer transition-all border border-gray-900/80"
                style={{fontFamily:'Geist,Inter,sans-serif', boxShadow:'0 2px 8px 0 rgba(60,60,120,0.10)'}}
              >
                Join the waitlist
              </button>
            </form>
          ) : (
            <div className="glass rounded-2xl p-6 max-w-sm mx-auto mb-8 shadow-lg border border-gray-100/60 bg-white">
              <div className="text-green-600 text-3xl mb-2">✓</div>
              <h3 className="text-base font-semibold mb-1">You&apos;re on the list!</h3>
              <p className="text-gray-500 text-sm">We&apos;ll notify you when Snap AI launches.</p>
            </div>
          )}
          <p className="text-xs text-gray-400 font-normal mb-8">No spam. Early access only.</p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-6 text-center">
            <div>
              <div className="text-lg md:text-xl font-bold text-gray-900">{waitlistCount.toLocaleString()}+</div>
              <div className="text-xs text-gray-500">Waitlist signups</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-gray-900">98%</div>
              <div className="text-xs text-gray-500">Positive feedback</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-gray-900">30s</div>
              <div className="text-xs text-gray-500">Avg. creative time</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;