'use client';

import { motion } from 'motion/react';
import { Upload, Wand2, Download, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-6 h-6 text-white" />,
      title: "Upload Your Product",
      description: "Simply upload a photo of your product or service. Our AI works with any image quality.",
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      demo: "/demo/upload-step.jpg" // You can replace with actual demo image
    },
    {
      icon: <Wand2 className="w-6 h-6 text-white" />,
      title: "AI Creates Magic",
      description: "Our advanced AI analyzes your product and generates multiple high-converting ad variations.",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-600",
      demo: "/demo/ai-step.jpg" // You can replace with actual demo image
    },
    {
      icon: <Download className="w-6 h-6 text-white" />,
      title: "Download & Use",
      description: "Get your creatives in all popular formats, ready for Facebook, Instagram, Google Ads, and more.",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      demo: "/demo/download-step.jpg" // You can replace with actual demo image
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <CheckCircle className="w-4 h-4" />
            How It Works
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
            From product photo to ad creative in 3 simple steps
          </h3>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
            No design experience needed. Just upload, customize, and download your professional ad creatives.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.2 }}
                className="relative group"
              >
                {/* Step Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100/60 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-2xl text-lg font-bold text-gray-900">
                        {index + 1}
                      </div>
                      <div className={`p-3 rounded-2xl ${step.bgColor} shadow-lg`}>
                        {step.icon}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block">
                        <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-gray-400 transition-colors" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                      {step.title}
                    </h4>
                    <p className="text-gray-500 leading-relaxed" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                      {step.description}
                    </p>
                  </div>

                  {/* Demo Visual */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 aspect-video group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Placeholder for demo content */}
                      <div className={`w-16 h-16 rounded-2xl ${step.bgColor} opacity-20 animate-pulse`}></div>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-xs font-medium text-gray-700">Step {index + 1} Demo</span>
                    </div>
                  </div>
                </div>

                {/* Floating connection point */}
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-12 bg-white rounded-full shadow-lg border-4 border-gray-50 -translate-y-1/2 z-20">
                  <div className={`w-full h-full rounded-full ${step.bgColor} opacity-20`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-600 text-sm font-medium px-6 py-3 rounded-full border border-gray-200">
            <span>⚡</span>
            Average time: 30 seconds from upload to download
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;