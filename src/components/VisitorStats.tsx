"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Types
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
  deviceEmoji: string;
  browserEmoji: string;
  osEmoji: string;
}

// Utility functions
const getCountryFlag = (countryCode: string): string => {
  if (!countryCode) return "🏳️";

  // Convert country code to flag emoji using regional indicator symbols
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};

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

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

// Child components
const VisitorStat: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <motion.div
    className="bg-dark-space/70 apple-radius-sm p-3 text-center hover:bg-dark-space/90 transition-colors duration-200 hover:border-cyber-green/30 border border-transparent"
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
  >
    <p className="text-xs text-text-secondary mb-1">{label}</p>
    <p className="text-xl font-mono text-cyber-green">{value}</p>
  </motion.div>
);

const MetricBadge: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <motion.span
    className="text-xs bg-dark-space py-1.5 px-3 apple-radius-sm border border-gray-700 text-text-secondary hover:border-cyber-green/30 transition-colors duration-200"
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
  >
    {label} <span className="text-white font-medium">{value}</span>
  </motion.span>
);

const VisitorProfile: React.FC<{
  visitorInfo: VisitorInfo;
}> = ({ visitorInfo }) => (
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
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff85" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#121212" stopOpacity="0.1" />
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
      <VisitorStat label="Emails Sent" value={visitorInfo.emails} />
      <VisitorStat label="Open Rate" value={`${visitorInfo.openRate}%`} />
    </div>
  </div>
);

const DetailTooltip: React.FC<{
  visitorInfo: VisitorInfo;
  isVisible: boolean;
}> = ({ visitorInfo, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute -right-5 top-full mt-3 z-20"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-dark-space border border-cyber-green/30 shadow-lg shadow-cyber-green/10 p-0 apple-radius w-[270px] overflow-hidden">
        {/* Triangle pointer */}
        <div className="absolute -top-2 right-6 w-3 h-3 bg-dark-space border-l border-t border-cyber-green/30 transform rotate-45"></div>

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
          <TooltipRow
            label="Device"
            value={visitorInfo.device}
            emoji={visitorInfo.deviceEmoji}
          />
          <TooltipRow
            label="Browser"
            value={visitorInfo.browser}
            emoji={visitorInfo.browserEmoji}
          />
          <TooltipRow
            label="OS"
            value={visitorInfo.os}
            emoji={visitorInfo.osEmoji}
          />
          <TooltipRow
            label="Time on page"
            value={visitorInfo.timeOnPage}
            emoji="⏱️"
            isLast={true}
          />
        </div>
      </div>
    </motion.div>
  );
};

const TooltipRow: React.FC<{
  label: string;
  value: string;
  emoji: string;
  isLast?: boolean;
}> = ({ label, value, emoji, isLast = false }) => (
  <div
    className={`px-4 py-3 flex items-center justify-between ${
      !isLast ? "border-b border-gray-800/50" : ""
    }`}
  >
    <span className="text-white text-sm">{label}</span>
    <div className="flex items-center">
      <span className="text-cyber-green mr-2 text-xl">{emoji}</span>
      <span className="text-white font-mono text-sm">{value}</span>
    </div>
  </div>
);

const VisitorContent: React.FC<{
  visitorInfo: VisitorInfo;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
}> = ({ visitorInfo, showDetails, setShowDetails }) => (
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

        <DetailTooltip visitorInfo={visitorInfo} isVisible={showDetails} />
      </span>{" "}
      from <span className="text-white">{visitorInfo.country}</span>{" "}
      <span className="text-xl">{visitorInfo.flag}</span>
    </h2>

    <h3 className="text-xl md:text-2xl text-gray-300 mb-4">
      We are Yassine and Yasser, creators of CampaignAI. we grew{" "}
      <span className="text-white font-medium">24 email lists</span> in 12
      months.
    </h3>

    <p className="text-text-secondary mb-4">The most common questions I get:</p>

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

    <div className="bg-dark-space/40 p-4 apple-radius border border-gray-700 mb-4 group hover:border-cyber-green/30 transition-colors duration-300">
      <p className="text-xl text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
        Answer:{" "}
        <span className="text-cyber-green">AI-powered personalization</span> is
        the key.
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <MetricBadge label="Avg. ROI" value="247%" />
      <MetricBadge label="Response rate" value="+38%" />
      <MetricBadge label="Setup time" value="5 mins" />
    </div>
  </div>
);

// Client-side only main component
const VisitorStatsClient: React.FC = () => {
  // State with default values
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo>({
    country: "Morocco",
    name: "Wanderer",
    device: "Unknown",
    browser: "Unknown",
    os: "Unknown",
    timeOnPage: "0s",
    flag: "🇲🇦",
    emails: 376, // Fixed initial value to avoid hydration mismatch
    openRate: 32, // Fixed initial value to avoid hydration mismatch
    deviceEmoji: "💻",
    browserEmoji: "🌐",
    osEmoji: "⚙️",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Initial setup on mount
  useEffect(() => {
    // Set random values
    setVisitorInfo((prev) => ({
      ...prev,
      emails: Math.floor(Math.random() * 200) + 300,
      openRate: Math.floor(Math.random() * 20) + 30,
    }));

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
      });

    // Set browser and device info
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

    // Start timer for time on page
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update timeOnPage when timeSpent changes
  useEffect(() => {
    setVisitorInfo((prev) => ({
      ...prev,
      timeOnPage: formatTime(timeSpent),
    }));
  }, [timeSpent]);

  return (
    <div className="max-w-4xl mx-auto mt-40 mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="h-px flex-1 bg-cyber-green/40"></div>
        <h3 className="text-lg font-medium mx-8 text-cyber-green">
          Welcome, Current Visitor
        </h3>
        <div className="h-px flex-1 bg-cyber-green/40"></div>
      </div>

      <motion.div
        className="bg-dark-space apple-radius p-8 border-2 border-dashed border-gray-700 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <VisitorProfile visitorInfo={visitorInfo} />
          <VisitorContent
            visitorInfo={visitorInfo}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Loading placeholder for SSR
const VisitorStatsPlaceholder: React.FC = () => (
  <div className="max-w-4xl mx-auto mt-40 mb-8">
    <div className="flex items-center justify-center mb-6">
      <div className="h-px flex-1 bg-cyber-green/40"></div>
      <h3 className="text-lg font-medium mx-8 text-cyber-green">
        Welcome, Current Visitor
      </h3>
      <div className="h-px flex-1 bg-cyber-green/40"></div>
    </div>
    <div className="bg-dark-space apple-radius p-8 border-2 border-dashed border-gray-700 relative overflow-hidden h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-cyber-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading visitor information...</p>
      </div>
    </div>
  </div>
);

// Dynamic import with SSR disabled
export const VisitorStats = dynamic(() => Promise.resolve(VisitorStatsClient), {
  ssr: false,
  loading: () => <VisitorStatsPlaceholder />,
});
