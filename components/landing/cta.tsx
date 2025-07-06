'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface CTAProps {
  waitlistCount: number;
  setWaitlistCount: (count: number) => void;
}

const CTA = ({ waitlistCount, setWaitlistCount }: CTAProps) => {
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
              <p className="text-gray-500 text-sm" style={{fontFamily:'Inter,Geist,sans-serif'}}>We&apos;ll notify you as soon as Snap AI is ready for you.</p>
            </div>
          )}
          
          <p className="text-xs text-gray-400" style={{fontFamily:'Inter,Geist,sans-serif'}}>
            Free to join • No spam • Early access guaranteed
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;