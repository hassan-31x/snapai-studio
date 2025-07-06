'use client';

import { Github, Mail, Twitter, TwitterIcon, User, X, Sparkles, Zap, Target, Clock, ArrowRight, Play, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number>(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.count) setWaitlistCount(data.count + 20);
        setLoading(false);
      });
  }, []);

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
        setWaitlistCount(data.count + 20);
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
    <div className="min-h-screen font-[Inter,Geist,sans-serif] bg-white relative">
      <Toaster position="top-center" richColors theme="light" />

      
      {/* Minimal Floating Navigation */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Snap AI Logo" width={36} height={36} className="rounded-full" />
            <span className="text-lg font-semibold tracking-tight select-none">Snap AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link target="_blank" href='https://x.com/hassan_dev31' className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <TwitterIcon className="w-5 h-5 text-gray-700" />
            </Link>
            <Link target="_blank" href='https://github.com/hassan-31x' className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Github className="w-5 h-5 text-gray-700" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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

            {/* Minimal Waitlist Input */}
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
              <div className="glass rounded-2xl p-6 max-w-sm mx-auto mb-8 shadow-lg border border-gray-100/60">
                <div className="text-green-600 text-3xl mb-2">✓</div>
                <h3 className="text-base font-semibold mb-1">You're on the list!</h3>
                <p className="text-gray-500 text-sm">We'll notify you when Snap AI launches.</p>
              </div>
            )}
            <p className="text-xs text-gray-400 font-normal mb-8">No spam. Early access only.</p>

            {/* Basic Stats */}
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

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
              Everything you need to create stunning ads
            </h3>
            <p className="text-base text-gray-500 max-w-2xl mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              From product images to scroll-stopping creatives in seconds. Our AI handles the design, you focus on growing your business.
            </p>
          </motion.div>
          
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
                title: "AI-Powered Generation",
                description: "Upload your product image and let our AI create multiple variations of high-converting ad creatives instantly."
              },
              {
                icon: <Zap className="w-6 h-6 text-purple-600" />,
                title: "Lightning Fast",
                description: "Generate professional ad creatives in under 30 seconds. No more waiting days for designers or agencies."
              },
              {
                icon: <Target className="w-6 h-6 text-blue-600" />,
                title: "Platform Optimized",
                description: "Automatically sized and optimized for Instagram, Facebook, LinkedIn, Google Ads, and more platforms."
              }
            ].map((feature, index) => (
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1*index }}
                
                key={index} 
                className="group p-6 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-all duration-300 border border-gray-100/60" style={{boxShadow:'0 2px 12px 0 rgba(60,60,120,0.04)'}}>
                <div className="mb-4 p-3 bg-white rounded-xl w-fit group-hover:scale-110 transition-transform duration-300" style={{boxShadow:'0 2px 8px 0 rgba(60,60,120,0.06)'}}>
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="py-20 px-6 bg-gray-50/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
              How it works
            </h3>
            <p className="text-base text-gray-500 max-w-2xl mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              Three simple steps to transform your product into high-converting ad creatives
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                title: "Upload Product Image",
                description: "Simply upload a high-quality image of your product. Our AI will analyze and understand your product automatically."
              },
              {
                step: "02",
                title: "Describe Your Brand",
                description: "Tell us about your brand voice, target audience, and campaign goals. The more context, the better the results."
              },
              {
                step: "03",
                title: "Get Your Creatives",
                description: "Receive multiple variations of professional ad creatives optimized for different platforms and audiences."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-6" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                    {step.step}
                  </div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full">
                    <ArrowRight className="w-5 h-5 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Gallery Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
              See what our AI creates
            </h3>
            <p className="text-base text-gray-500 max-w-xl mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              Real ad creatives generated by Snap AI for brands across industries
            </p>
          </div>
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {[
              'https://res.cloudinary.com/dtr7khiig/image/upload/v1751677760/ai-creatives/generated/instagram_post-c633724c-9da1-4977-821b-c1e03711ddb3.png',
              'https://res.cloudinary.com/dtr7khiig/image/upload/v1751661989/ai-creatives/generated/facebook_post-facebook_post-63a9dbe8-f46d-46f7-9206-768a2452d7de.png',
              'https://res.cloudinary.com/dtr7khiig/image/upload/v1751661347/ai-creatives/generated/instagram_post-5086040d-f108-48e8-9de8-550dff711428.png',
              'https://res.cloudinary.com/dtr7khiig/image/upload/v1751678802/ai-creatives/generated/instagram_post-5afd9c82-f689-486b-bde5-552d53a1aca8.png',
              'https://res.cloudinary.com/dtr7khiig/image/upload/v1751661994/ai-creatives/generated/website_banner-website_banner-e6abbf4e-fd0a-4e64-9989-9c3f6066b322.png',
              'https://res.cloudinary.com/dtr7khiig/image/upload/v1751676832/ai-creatives/generated/website_banner-615e3d4a-4450-49df-b7b0-225dd07dec9b.png',
              'https://res.cloudinary.com/dtr7khiig/image/upload/v1751662022/ai-creatives/generated/linkedin_post-linkedin_post-86071728-ceb8-4347-bffb-6becc2202fa2.png',
              'https://res.cloudinary.com/dtr7khiig/image/upload/v1751661986/ai-creatives/generated/instagram_post-instagram_post-f91e3b69-846a-419d-aa0b-8e81d1ed99ec.png'
            ].map((imageUrl, index) => (
              <motion.div 
                initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.1 }}

                key={index} 
                className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square hover:scale-105 transition-transform duration-150 cursor-pointer ease-out"
                style={{boxShadow:'0 2px 12px 0 rgba(60,60,120,0.06)'}}
              >
                <img 
                  src={imageUrl} 
                  alt={`AI generated creative ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                    AI Generated
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              Join the waitlist to create your own AI-powered ads
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-20 px-6 bg-gray-50/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
              Loved by creators and brands
            </h3>
            <p className="text-base text-gray-500 max-w-2xl mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              See what early users are saying about Snap AI
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                quote: "Snap AI transformed our creative process. What used to take our team days now happens in minutes. The quality is incredible.",
                author: "Sarah Chen",
                role: "Marketing Director",
                company: "TechFlow"
              },
              {
                quote: "As a small business owner, I can't afford expensive designers. Snap AI gives me professional-quality ads at a fraction of the cost.",
                author: "Marcus Rodriguez",
                role: "Founder",
                company: "Local Eats"
              },
              {
                quote: "The AI understands our brand perfectly. Every creative feels like it was made by our in-house team, but 10x faster.",
                author: "Emily Watson",
                role: "Creative Lead",
                company: "Bloom Beauty"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-2xl border border-gray-100/60" style={{boxShadow:'0 2px 12px 0 rgba(60,60,120,0.04)'}}>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-gray-500" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
              Ready to transform your ad creatives?
            </h3>
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              Join thousands of creators and brands who are already using AI to create scroll-stopping ads in seconds.
            </p>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-200 text-sm placeholder:text-gray-400 font-medium shadow-sm transition-all"
                  required
                  style={{fontFamily:'Inter,Geist,sans-serif', boxShadow:'0 2px 8px 0 rgba(60,60,120,0.04)'}}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-md hover:bg-gray-700 cursor-pointer transition-all border border-gray-900/80 flex items-center gap-2"
                  style={{fontFamily:'Geist,Inter,sans-serif', boxShadow:'0 2px 8px 0 rgba(60,60,120,0.10)'}}
                >
                  Get Early Access
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="glass rounded-2xl p-8 max-w-md mx-auto mb-6 shadow-lg border border-gray-100/60">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>Welcome to the waitlist!</h4>
                <p className="text-gray-500 text-sm" style={{fontFamily:'Inter,Geist,sans-serif'}}>We'll notify you as soon as Snap AI is ready for you.</p>
              </div>
            )}
            
            <p className="text-xs text-gray-400" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              Free to join • No spam • Early access guaranteed
            </p>
          </motion.div>
        </div>
      </section>

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
