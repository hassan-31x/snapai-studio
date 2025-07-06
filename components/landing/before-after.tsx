'use client';

import { motion } from 'motion/react';
import { Clock, DollarSign, Users, Zap } from 'lucide-react';

const BeforeAfter = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-purple-50 text-purple-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
            Transformation
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
            The old way vs. the Snap AI way
          </h3>
          <p className="text-base text-gray-500 max-w-2xl mx-auto" style={{fontFamily:'Inter,Geist,sans-serif'}}>
            See how Snap AI transforms the traditional creative process
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", x: -20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                Before: Traditional Creative Process
              </h4>
              <p className="text-gray-500 mb-6" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                Slow, expensive, and complex workflow
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: <Clock className="w-5 h-5 text-red-500" />, text: "Wait 3-7 days for designer availability" },
                { icon: <DollarSign className="w-5 h-5 text-red-500" />, text: "$500-2000 per creative set" },
                { icon: <Users className="w-5 h-5 text-red-500" />, text: "Multiple rounds of revisions" },
                { icon: <Zap className="w-5 h-5 text-red-500" />, text: "Limited variations and formats" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-red-50/50 rounded-xl border border-red-100/60">
                  {item.icon}
                  <span className="text-sm text-gray-700" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Placeholder for traditional workflow visual */}
            <div className="bg-gray-100 rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-400 text-sm mb-2">Traditional Workflow</div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-300 rounded-full"></div>
                <div className="h-2 bg-gray-300 rounded-full w-3/4 mx-auto"></div>
                <div className="h-2 bg-gray-300 rounded-full w-1/2 mx-auto"></div>
              </div>
              <div className="text-xs text-gray-500 mt-4">Complex, time-consuming process</div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", x: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-semibold mb-3 text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                After: Snap AI Workflow
              </h4>
              <p className="text-gray-500 mb-6" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                Fast, affordable, and incredibly simple
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: <Clock className="w-5 h-5 text-green-500" />, text: "Generate creatives in under 30 seconds" },
                { icon: <DollarSign className="w-5 h-5 text-green-500" />, text: "Starting at $29/month for unlimited creatives" },
                { icon: <Users className="w-5 h-5 text-green-500" />, text: "No back-and-forth, instant results" },
                { icon: <Zap className="w-5 h-5 text-green-500" />, text: "Multiple formats and variations instantly" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-green-50/50 rounded-xl border border-green-100/60">
                  {item.icon}
                  <span className="text-sm text-gray-700" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Placeholder for AI workflow visual */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 text-center border border-indigo-100">
              <div className="text-indigo-600 text-sm mb-2">AI-Powered Workflow</div>
              <div className="space-y-2">
                <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                <div className="h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full"></div>
              </div>
              <div className="text-xs text-indigo-600 mt-4">Streamlined, instant results</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;