"use client";

import React from "react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="pt-12 pb-24 bg-dark-space relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-green/10 via-dark-secondary to-dark-space animated-gradient"></div>
      </div>

      {/* Grid lines for cyber aesthetic */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
              <span className="text-white">AI-Powered</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyber-green to-teal-400">
                Email Campaign Management
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-text-secondary text-lg md:text-xl mb-8"
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
              className="px-6 py-3 bg-cyber-green text-dark-space font-medium rounded-lg shadow-neon hover-glow"
            >
              Start Now
            </a>
            <a
              href="#learn-more"
              className="px-6 py-3 border border-gray-700 text-white rounded-lg hover:border-cyber-green/50 transition-colors duration-300"
            >
              Learn More
            </a>
          </motion.div>

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
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-gray-400 text-lg mb-3">
              Join <span className="text-white font-medium">3,155</span> startup
              founders
            </h3>
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
                      zIndex: 10 - i,
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
