import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0A0A0F",
          surface: "#12121A",
          card: "#1A1A28",
          border: "#2A2A3E",
          accent: "#E94560",
          "accent-hover": "#FF2D55",
          gold: "#FFD700",
          cyan: "#00D4FF",
          muted: "#6B7280",
          text: "#F8F8FF",
          "text-muted": "#9CA3AF",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-red": "pulseRed 1s ease-in-out infinite",
        "glow-cyan": "glowCyan 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "shake": "shake 0.5s ease-in-out",
      },
      keyframes: {
        pulseRed: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(233, 69, 96, 0.4)" },
          "50%": { boxShadow: "0 0 0 20px rgba(233, 69, 96, 0)" },
        },
        glowCyan: {
          "0%, 100%": { textShadow: "0 0 10px #00D4FF, 0 0 20px #00D4FF" },
          "50%": { textShadow: "0 0 20px #00D4FF, 0 0 40px #00D4FF, 0 0 60px #00D4FF" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 50%, 90%": { transform: "translateX(-5px)" },
          "30%, 70%": { transform: "translateX(5px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
