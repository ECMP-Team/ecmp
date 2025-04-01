"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <nav className="bg-dark-space py-2 px-6 sticky top-0 z-50 backdrop-blur-md border-b border-gray-800 border-opacity-40">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group">
          <motion.h1
            className="text-xl font-medium flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Campaign<span className="text-cyber-green">AI</span>
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-cyber-green animate-pulse"></span>
          </motion.h1>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/workflow"
            className="text-text-primary text-sm minimal-underline"
          >
            Workflow
          </Link>
          <Link
            href="/demo"
            className="text-text-primary text-sm minimal-underline"
          >
            Live Demo
          </Link>
          <Link
            href="/knowledge"
            className="text-text-primary text-sm minimal-underline"
          >
            Knowledge
          </Link>
        </div>

        {/* CTA Button */}
        <Link href="/get-started">
          <button className="btn-primary px-4 py-2 text-sm">Get Started</button>
        </Link>

        {/* Mobile Menu Button - Shows on small screens */}
        <div className="md:hidden">
          <button className="text-text-primary focus:outline-none">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
