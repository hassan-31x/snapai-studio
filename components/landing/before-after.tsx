'use client';

import { motion } from 'motion/react';
import { Clock, DollarSign, Users, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Compare } from '../ui/compare';

const BeforeAfter = () => {
  // Example images - replace with your actual before/after images
  const comparison1 = {
    before: "https://res.cloudinary.com/dtr7khiig/image/upload/v1751681855/ai-creatives/products/product-2cd69473-d4ba-40c0-a759-c0c07d669766.jpg",
    after: "https://res.cloudinary.com/dtr7khiig/image/upload/v1751681873/ai-creatives/generated/linkedin_post-7d7d96d6-6a0d-4116-b550-ba9cfa9fec9d.png"
  };

  const comparison2 = {
    before: "https://res.cloudinary.com/dtr7khiig/image/upload/v1751771025/ai-creatives/products/product-e8897412-ead7-4038-8d11-96b75aa76f37.jpg",
    after: "https://res.cloudinary.com/dtr7khiig/image/upload/v1751771042/ai-creatives/generated/instagram_post-65de0716-def8-47d2-b9c0-c85fead3d4e0.png"
  };

  const traditionalPains = [
    { icon: <Clock className="w-5 h-5 text-red-500" />, text: "Wait 3-7 days for designer availability", impact: "Slow" },
    { icon: <DollarSign className="w-5 h-5 text-red-500" />, text: "$500-2000 per creative set", impact: "Expensive" },
    { icon: <Users className="w-5 h-5 text-red-500" />, text: "Multiple rounds of revisions", impact: "Complex" },
    { icon: <Zap className="w-5 h-5 text-red-500" />, text: "Limited variations and formats", impact: "Limited" }
  ];

  const aiAdvantages = [
    { icon: <Clock className="w-5 h-5 text-green-500" />, text: "Generate creatives in under 30 seconds", impact: "Instant" },
    { icon: <DollarSign className="w-5 h-5 text-green-500" />, text: "Starting at $29/month for unlimited creatives", impact: "Affordable" },
    { icon: <Users className="w-5 h-5 text-green-500" />, text: "No back-and-forth, instant results", impact: "Simple" },
    { icon: <Zap className="w-5 h-5 text-green-500" />, text: "Multiple formats and variations instantly", impact: "Unlimited" }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            Transformation
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
            The old way vs. the Snap AI way
          </h3>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
            See how Snap AI transforms the traditional creative process with real examples
          </p>
        </motion.div>

        {/* Visual Comparisons */}
        <div className="mb-20">
          {/* <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <h4 className="text-2xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
              Real transformations
            </h4>
            <p className="text-gray-500" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              Hover over the images to see the before and after
            </p>
          </motion.div> */}

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* First Comparison */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", x: -20 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="relative">
                <Compare
                  firstImage={comparison1.before}
                  secondImage={comparison1.after}
                  className="w-full h-auto aspect-square rounded-2xl border border-gray-200 shadow-lg"
                  slideMode="hover"
                  showHandlebar={true}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-xs font-medium text-gray-700">E-commerce Product</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Basic product photo</span>
                <span>Professional ad creative</span>
              </div>
            </motion.div>

            {/* Second Comparison */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", x: 20 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              className="space-y-4"
            >
              <div className="relative">
                <Compare
                  firstImage={comparison2.before}
                  secondImage={comparison2.after}
                  className="w-full h-auto aspect-square rounded-2xl border border-gray-200 shadow-lg"
                  slideMode="hover"
                  showHandlebar={true}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-xs font-medium text-gray-700">Fashion Brand</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Stock product image</span>
                <span>Branded social media ad</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Process Comparison */}
        {/* <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", x: -20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Traditional Process
              </div>
              <h4 className="text-2xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                Slow, expensive, complex
              </h4>
              <p className="text-gray-500 mb-6" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                The old way of creating ad creatives
              </p>
            </div>

            <div className="space-y-4">
              {traditionalPains.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-red-50/50 rounded-xl border border-red-100/60 group hover:bg-red-50 transition-colors"
                >
                  {item.icon}
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 block" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                      {item.text}
                    </span>
                  </div>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full font-medium">
                    {item.impact}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 text-center border border-gray-200">
              <div className="text-gray-400 text-sm mb-3">Traditional Timeline</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-500">Day 1-2: Brief & Research</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-500">Day 3-5: Design & Iterations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-500">Day 6-7: Final Delivery</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-4 font-medium">Total: 7+ days</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", x: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Snap AI Process
              </div>
              <h4 className="text-2xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                Fast, affordable, simple
              </h4>
              <p className="text-gray-500 mb-6" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                The AI-powered future of creative generation
              </p>
            </div>

            <div className="space-y-4">
              {aiAdvantages.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-green-50/50 rounded-xl border border-green-100/60 group hover:bg-green-50 transition-colors"
                >
                  {item.icon}
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 block" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                      {item.text}
                    </span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                    {item.impact}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center border border-indigo-100">
              <div className="text-indigo-600 text-sm mb-3">AI Timeline</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-indigo-600">Upload & Generate: 30 seconds</span>
                </div>
              </div>
              <div className="text-xs text-indigo-600 mt-4 font-medium">Total: 30 seconds</div>
            </div>
          </motion.div>
        </div> */}

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">14,000x</div>
              <div className="text-xs text-gray-500">Faster</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-xs text-gray-500">Cheaper</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">∞</div>
              <div className="text-xs text-gray-500">Variations</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfter;