'use client';

import { motion } from 'motion/react';
import { Upload, Wand2, Download, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-6 h-6 text-indigo-600" />,
      title: "Upload Your Product",
      description: "Simply upload a photo of your product or service. Our AI works with any image quality.",
      placeholder: "📷"
    },
    {
      icon: <Wand2 className="w-6 h-6 text-purple-600" />,
      title: "AI Creates Magic",
      description: "Our advanced AI analyzes your product and generates multiple high-converting ad variations.",
      placeholder: "🎨"
    },
    {
      icon: <Download className="w-6 h-6 text-green-600" />,
      title: "Download & Use",
      description: "Get your creatives in all popular formats, ready for Facebook, Instagram, Google Ads, and more.",
      placeholder: "⚡"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
            How It Works
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
            From product photo to ad creative in 3 simple steps
          </h3>
          <p className="text-base text-gray-500 max-w-2xl mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
            No design experience needed. Just upload, customize, and download your professional ad creatives.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.1 }}
                className="text-center group"
              >
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full text-lg font-bold text-gray-900 mb-6 shadow-lg border border-gray-100/60 group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-6 p-4 bg-white rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300 shadow-md border border-gray-100/60">
                  {step.icon}
                </div>

                {/* Content */}
                <h4 className="text-lg font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                  {step.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                  {step.description}
                </p>

                {/* Visual Placeholder */}
                <div className="mt-6 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="text-4xl mb-2">{step.placeholder}</div>
                  <div className="text-xs text-gray-400">Step {index + 1} Preview</div>
                </div>
              </motion.div>

              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/3 -right-4 z-10">
                  <ArrowRight className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;