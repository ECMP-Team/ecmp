"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface VisitorInfo {
  country: string;
  name: string;
  device: string;
  browser: string;
  os: string;
  timeOnPage: string;
  flag: string;
  emails: number;
  openRate: number;
}

export const VisitorStats: React.FC = () => {
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo>({
    country: "Morocco",
    name: "Wanderer",
    device: "Unknown",
    browser: "Unknown",
    os: "Unknown",
    timeOnPage: "0s",
    flag: "🇲🇦",
    emails: Math.floor(Math.random() * 200) + 300,
    openRate: Math.floor(Math.random() * 20) + 30,
  });
  const [showDetails, setShowDetails] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    // Get country information
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        setVisitorInfo((prev) => ({
          ...prev,
          country: data.country_name || "Morocco",
          name: "Wanderer",
          flag: getCountryFlag(data.country_code) || "🇲🇦",
        }));
      })
      .catch((error) => {
        console.error("Error fetching country info:", error);
        // Set fallback values
        setVisitorInfo((prev) => ({
          ...prev,
          country: "Morocco",
          flag: "🇲🇦",
        }));
      });

    // Get browser and device information
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      let browserName = "Unknown";
      let browserEmoji = "🌐";

      if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
        browserEmoji = "🌐";
      } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
        browserEmoji = "🧭";
      } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserEmoji = "🦊";
      } else if (
        userAgent.indexOf("MSIE") > -1 ||
        userAgent.indexOf("Trident") > -1
      ) {
        browserName = "Internet Explorer";
        browserEmoji = "🔵";
      } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "Edge";
        browserEmoji = "🔷";
      }

      return { name: browserName, emoji: browserEmoji };
    };

    const detectOS = () => {
      const userAgent = navigator.userAgent;
      let os = "Unknown";
      let osEmoji = "⚙️";

      if (userAgent.indexOf("Win") > -1) {
        os = "Windows";
        osEmoji = "🪟";
      } else if (userAgent.indexOf("Mac") > -1) {
        os = "Mac OS";
        osEmoji = "🍎";
      } else if (userAgent.indexOf("Linux") > -1) {
        os = "Linux";
        osEmoji = "🐧";
      } else if (userAgent.indexOf("Android") > -1) {
        os = "Android";
        osEmoji = "🤖";
      } else if (
        userAgent.indexOf("iOS") > -1 ||
        userAgent.indexOf("iPhone") > -1 ||
        userAgent.indexOf("iPad") > -1
      ) {
        os = "iOS";
        osEmoji = "📱";
      }

      return { name: os, emoji: osEmoji };
    };

    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      let deviceType = "Unknown";
      let deviceEmoji = "💻";

      if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        deviceType = "Mobile";
        deviceEmoji = "📱";
      } else {
        deviceType = "Desktop";
        deviceEmoji = "💻";
      }

      return { name: deviceType, emoji: deviceEmoji };
    };

    const browser = detectBrowser();
    const os = detectOS();
    const device = detectDevice();

    setVisitorInfo((prev) => ({
      ...prev,
      browser: browser.name,
      browserEmoji: browser.emoji,
      os: os.name,
      osEmoji: os.emoji,
      device: device.name,
      deviceEmoji: device.emoji,
    }));

    // Update time on page
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    // Format time for display
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    };

    setVisitorInfo((prev) => ({
      ...prev,
      timeOnPage: formatTime(timeSpent),
    }));

    return () => clearInterval(timer);
  }, [timeSpent]);

  const getCountryFlag = (countryCode: string): string => {
    if (!countryCode) return "🏳️";

    // Convert country code to flag emoji using regional indicator symbols
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="max-w-4xl mx-auto mt-40 mb-20">
      <div className="flex items-center justify-center mb-6">
        <div className="h-px flex-1 bg-cyber-green/40"></div>
        <h3 className="text-lg font-medium mx-8 text-cyber-green">
          Welcome, Current Visitor
        </h3>
        <div className="h-px flex-1 bg-cyber-green/40"></div>
      </div>

      <motion.div
        className="bg-dark-secondary/20 apple-radius p-8 border-2 border-dashed border-gray-700 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background glow effect */}
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-blur opacity-10 z-0"></div>

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-full md:w-1/3">
            {/* Wojak meme image */}
            <div className="w-48 h-48 mx-auto relative">
              <div className="w-full h-full relative rounded-full overflow-hidden border-2 border-gray-700">
                <svg
                  viewBox="0 0 200 200"
                  className="absolute inset-0 z-0 opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#00ff85" stopOpacity="0.5" />
                      <stop
                        offset="100%"
                        stopColor="#121212"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grad)" />
                </svg>

                {/* Actual Wojak image */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-dark-secondary overflow-hidden">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/c/cc/Wojak_cropped.jpg"
                    alt="Wojak"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* Pulse animation behind the Wojak */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 rounded-full bg-cyber-green/5 animate-ping-slow"></div>
              </div>
            </div>

            {/* Stats below Wojak */}
            <div className="text-center mt-2">
              <p className="text-cyber-green font-medium uppercase tracking-wide text-sm">
                Visitor from {visitorInfo.country}
              </p>
            </div>

            {/* Email statistics */}
            <div className="mt-4 grid grid-cols-2 gap-3 max-w-xs mx-auto">
              <motion.div
                className="bg-dark-secondary/70 apple-radius-sm p-3 text-center hover:bg-dark-secondary/90 transition-colors duration-200 hover:border-cyber-green/30 border border-transparent"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <p className="text-xs text-text-secondary mb-1">Emails Sent</p>
                <p className="text-xl font-mono text-cyber-green">
                  {visitorInfo.emails}
                </p>
              </motion.div>
              <motion.div
                className="bg-dark-secondary/70 apple-radius-sm p-3 text-center hover:bg-dark-secondary/90 transition-colors duration-200 hover:border-cyber-green/30 border border-transparent"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <p className="text-xs text-text-secondary mb-1">Open Rate</p>
                <p className="text-xl font-mono text-cyber-green">
                  {visitorInfo.openRate}%
                </p>
              </motion.div>
            </div>
          </div>

          <div className="w-full md:w-2/3 text-left">
            <h2 className="text-2xl md:text-3xl text-gray-300 mb-4 group relative">
              Hey,{" "}
              <span
                className="text-white font-medium cursor-help relative inline-block border-b-2"
                style={{
                  borderImage: "linear-gradient(to right, #00ff85, #00a3ff) 1",
                }}
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
              >
                {visitorInfo.name}

                {/* Redesigned tooltip with icons on left, brand images on right */}
                {showDetails && (
                  <motion.div
                    className="absolute -right-5 top-full mt-3 z-20"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-dark-secondary border border-cyber-green/30 shadow-lg shadow-cyber-green/10 p-0 apple-radius w-[270px] overflow-hidden">
                      {/* Triangle pointer */}
                      <div className="absolute -top-2 right-6 w-3 h-3 bg-dark-secondary border-l border-t border-cyber-green/30 transform rotate-45"></div>

                      {/* Header */}
                      <div className="px-4 py-3 bg-dark-space border-b border-gray-700 flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-cyber-green"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-cyber-green text-xs uppercase tracking-wider font-medium">
                            VISITOR DETAILS
                          </span>
                        </div>
                        <div>
                          <span className="text-xs bg-dark-space/80 py-1 px-2 apple-radius-sm text-cyber-green border border-cyber-green/30">
                            ACTIVE
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="py-2">
                        {/* Device row */}
                        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800/50">
                          <span className="text-white text-sm">Device</span>
                          <div className="flex items-center">
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
                              alt="Desktop"
                              className="w-6 h-6 object-contain brightness-200 invert mr-2"
                            />
                            <span className="text-white font-mono text-sm">
                              Desktop
                            </span>
                          </div>
                        </div>

                        {/* Browser row */}
                        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800/50">
                          <span className="text-white text-sm">Browser</span>
                          <div className="flex items-center">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg"
                              alt="Chrome"
                              className="w-6 h-6 object-contain mr-2"
                            />
                            <span className="text-white font-mono text-sm">
                              Chrome
                            </span>
                          </div>
                        </div>

                        {/* OS row */}
                        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800/50">
                          <span className="text-white text-sm">OS</span>
                          <div className="flex items-center">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png"
                              alt="Mac OS"
                              className="w-5 h-5 object-contain brightness-200 invert mr-2"
                            />
                            <span className="text-white font-mono text-sm">
                              Mac OS
                            </span>
                          </div>
                        </div>

                        {/* Time on page row */}
                        <div className="px-4 py-3 flex items-center justify-between">
                          <span className="text-white text-sm">
                            Time on page
                          </span>
                          <div className="flex items-center">
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/2088/2088617.png"
                              alt="Clock"
                              className="w-6 h-6 object-contain brightness-200 invert mr-2"
                            />
                            <span className="text-white font-mono text-sm">
                              2m 26s
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </span>{" "}
              from <span className="text-white">{visitorInfo.country}</span>{" "}
              <span className="text-xl">{visitorInfo.flag}</span>
            </h2>

            <h3 className="text-xl md:text-2xl text-gray-300 mb-4">
              I'm Alex, creator of CampaignAI. I grew{" "}
              <span className="text-white font-medium">24 email lists</span> in
              12 months.
            </h3>

            <p className="text-text-secondary mb-4">
              The most common questions I get:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="text-gray-300 flex items-start gap-2">
                <span className="text-cyber-green mt-1">→</span>
                <span>How can I increase my email open rates?</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <span className="text-cyber-green mt-1">→</span>
                <span>What's the best way to personalize campaigns?</span>
              </li>
            </ul>

            <div className="bg-dark-secondary/40 p-4 apple-radius border border-gray-700 mb-4 group hover:border-cyber-green/30 transition-colors duration-300">
              <p className="text-xl text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                Answer:{" "}
                <span className="text-cyber-green">
                  AI-powered personalization
                </span>{" "}
                is the key.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <motion.span
                className="text-xs bg-dark-secondary py-1.5 px-3 apple-radius-sm border border-gray-700 text-text-secondary hover:border-cyber-green/30 transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Avg. ROI <span className="text-white font-medium">247%</span>
              </motion.span>
              <motion.span
                className="text-xs bg-dark-secondary py-1.5 px-3 apple-radius-sm border border-gray-700 text-text-secondary hover:border-cyber-green/30 transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Response rate{" "}
                <span className="text-white font-medium">+38%</span>
              </motion.span>
              <motion.span
                className="text-xs bg-dark-secondary py-1.5 px-3 apple-radius-sm border border-gray-700 text-text-secondary hover:border-cyber-green/30 transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Setup time{" "}
                <span className="text-white font-medium">5 mins</span>
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
