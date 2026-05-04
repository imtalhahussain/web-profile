import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#050505",
          2: "#0a0a0a",
          3: "#111111",
          4: "#1a1a1a",
          5: "#222222",
        },
        "cyber-lime": {
          DEFAULT: "#aaff00",
          dim: "#88cc00",
        },
        "electric-cyan": {
          DEFAULT: "#00f5ff",
          dim: "#00c4cc",
        },
        amber: "#ff9500",
        "red-alert": "#ff3b30",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Space Grotesk", "sans-serif"],
      },
      animation: {
        pulse: "pulse 2s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(170,255,0,0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(170,255,0,0.2)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;