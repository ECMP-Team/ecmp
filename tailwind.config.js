/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-space": "#0A0A0A",
        "dark-secondary": "#121212",
        "cyber-green": "#00FF88",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A0A0A0",
      },
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        jetbrains: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s infinite",
        "progress-wave": "progress-wave 2s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px #00FF88" },
          "50%": { boxShadow: "0 0 20px #00FF88" },
        },
        "progress-wave": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
