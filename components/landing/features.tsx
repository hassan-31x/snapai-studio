'use client';

import { motion } from 'motion/react';
import { Sparkles, Zap, Target } from 'lucide-react';

const Features = () => {
  const features = [
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
  ];

  return (
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
       
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1*index }}
              key={index} 
              className="group p-6 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-all duration-300 border border-gray-100/60" 
              style={{boxShadow:'0 2px 12px 0 rgba(60,60,120,0.04)'}}
            >
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
  );
};

export default Features;