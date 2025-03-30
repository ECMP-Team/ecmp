"use client";

import React from "react";
import { motion } from "framer-motion";

export const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "CampaignAI helped us increase our email open rates by 37% and conversions by 24%. The AI-generated content is surprisingly personalized and effective.",
      author: "Sarah Johnson",
      position: "Marketing Director",
      company: "TechStart",
      avatar: "https://i.pravatar.cc/150?img=32",
      size: "wide",
    },
    {
      quote:
        "We've tried several email campaign tools, but none compare to the personalization capabilities of CampaignAI. It's been a game-changer for our outreach.",
      author: "Michael Chen",
      position: "Growth Lead",
      company: "Innovate Labs",
      avatar: "https://i.pravatar.cc/150?img=65",
      size: "tall",
    },
    {
      quote:
        "The lead management system is intuitive and powerful. Being able to segment our audience and send tailored messages has improved our customer relationships significantly.",
      author: "Alexa Rodriguez",
      position: "Customer Success Manager",
      company: "DataFlow",
      avatar: "https://i.pravatar.cc/150?img=47",
      size: "regular",
    },
    {
      quote:
        "Setup was incredibly simple. Within a day we had our first AI-powered campaign running with remarkably personalized content.",
      author: "David Kim",
      position: "Technical Lead",
      company: "Quantum Systems",
      avatar: "https://i.pravatar.cc/150?img=68",
      size: "regular",
    },
    {
      quote:
        "The analytics dashboard gives us insights we never had before. Now we can measure performance in real-time and optimize our campaigns instantly.",
      author: "Emma Thompson",
      position: "Data Analyst",
      company: "MetricMinds",
      avatar: "https://i.pravatar.cc/150?img=45",
      size: "regular",
    },
    {
      quote:
        "As a marketing agency handling multiple clients, CampaignAI has transformed our workflow. The platform lets us create personalized campaigns at scale, and the analytics provide clear ROI metrics we can present to our clients. This tool paid for itself within the first month.",
      author: "Jason Martinez",
      position: "Agency Director",
      company: "HyperGrowth Marketing",
      avatar: "https://i.pravatar.cc/150?img=12",
      size: "wide",
    },
  ];

  return (
    <section className="py-24 bg-dark-space relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-medium mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            className="text-text-secondary max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Real experiences from businesses using our platform
          </motion.p>
        </div>

        <div className="bento-grid max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`bento-card-square ${
                testimonial.size === "wide"
                  ? "bento-cell-wide"
                  : testimonial.size === "tall"
                  ? "bento-cell-tall"
                  : ""
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div className="h-full flex flex-col">
                <div className="testimonial-quote mb-auto">
                  "{testimonial.quote}"
                </div>

                <div className="testimonial-author">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="testimonial-avatar"
                  />
                  <div>
                    <p className="font-medium text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
