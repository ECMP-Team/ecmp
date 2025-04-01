"use client";

import React from "react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="pt-12 pb-24 bg-dark-space relative overflow-hidden">
      <div className="container relative z-[5]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl  font-medium mb-8">
              <span className="text-white">AI-Powered</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyber-green to-teal-400">
                Email Campaigns
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-text-secondary text-lg md:text-xl mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Streamline your email outreach with our AI assistant. Upload your
            lead data, generate personalized emails, and boost your campaign
            performance.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href="#upload"
              className="px-4 py-2 bg-cyber-green text-dark-space font-medium rounded-lg shadow-neon hover-glow text-sm"
            >
              Start Now
            </a>
            <a
              href="#learn-more"
              className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:border-cyber-green/50 transition-colors duration-300 text-sm"
            >
              Learn More
            </a>
          </motion.div>

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div
              className="w-full rounded-2xl overflow-hidden relative"
              style={{
                boxShadow: `
                  0 0 20px rgba(16, 185, 129, 0.3),
                  0 0 40px rgba(16, 185, 129, 0.2),
                  0 0 60px rgba(16, 185, 129, 0.1),
                  inset 0 0 30px rgba(16, 185, 129, 0.2)
                `,
              }}
            >
              <video
                className="w-full aspect-video object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="https://xguihxuzqibwxjnimxev.supabase.co/storage/v1/object/public/videos/marketing/website/supabase-table-editor.webm"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          {/* -------------------------------------------- */}

          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-cyber-green text-3xl font-medium mb-1">
                  100%
                </h3>
                <p className="text-text-secondary text-sm">Automated</p>
              </div>
              <div>
                <h3 className="text-cyber-green text-3xl font-medium mb-1">
                  3x
                </h3>
                <p className="text-text-secondary text-sm">Faster Outreach</p>
              </div>
              <div>
                <h3 className="text-cyber-green text-3xl font-medium mb-1">
                  +40%
                </h3>
                <p className="text-text-secondary text-sm">Response Rate</p>
              </div>
              <div>
                <h3 className="text-cyber-green text-3xl font-medium mb-1">
                  24/7
                </h3>
                <p className="text-text-secondary text-sm">AI Assistance</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-10 text-center opacity-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-gray-400 text-lg mb-3">
              Join <span className="text-white font-medium">3,155</span> startup
              founders
            </div>
            <div className="flex justify-center">
              <div className="flex -space-x-3">
                {[
                  { initials: "JD", color: "#4F46E5" },
                  { initials: "TR", color: "#0EA5E9" },
                  { initials: "MK", color: "#10B981" },
                  { initials: "AH", color: "#6366F1" },
                  { initials: "SL", color: "#EC4899" },
                  { initials: "BP", color: "#F59E0B" },
                  { initials: "RN", color: "#EF4444" },
                ].map((avatar, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border border-dark-space flex items-center justify-center text-xs font-medium"
                    style={{
                      zIndex: 5 - i,
                      background: avatar.color,
                      color: "white",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
