import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          blue: "#00d4ff",
          "blue-dim": "#0ea5e9",
          pink: "#f472b6",
          "pink-bright": "#e879f9",
          "pink-hot": "#ec4899",
          dark: "#03030a",
          card: "#0a0a14",
          border: "#1a1a2e",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-gradient": "linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #f472b6 100%)",
        "blue-gradient": "linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)",
        "pink-gradient": "linear-gradient(135deg, #f472b6 0%, #e879f9 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-glow-blue": "pulseGlowBlue 2.5s ease-in-out infinite",
        "pulse-glow-pink": "pulseGlowPink 2.5s ease-in-out infinite",
        "scan": "scan 8s linear infinite",
        "flicker": "flicker 4s ease-in-out infinite",
        "border-flow": "borderFlow 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlowBlue: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(0, 212, 255, 0.2), inset 0 0 15px rgba(0, 212, 255, 0.05)" },
          "50%": { boxShadow: "0 0 35px rgba(0, 212, 255, 0.4), inset 0 0 20px rgba(0, 212, 255, 0.1)" },
        },
        pulseGlowPink: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(244, 114, 182, 0.2)" },
          "50%": { boxShadow: "0 0 35px rgba(244, 114, 182, 0.5)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 95%, 100%": { opacity: "1" },
          "96%": { opacity: "0.8" },
          "97%": { opacity: "1" },
          "98%": { opacity: "0.6" },
          "99%": { opacity: "1" },
        },
        borderFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      fontFamily: {
        mono: ["'Courier New'", "Courier", "monospace"],
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.1)",
        "neon-pink": "0 0 20px rgba(244, 114, 182, 0.4), 0 0 60px rgba(244, 114, 182, 0.1)",
        "neon-blue-sm": "0 0 10px rgba(0, 212, 255, 0.3)",
        "neon-pink-sm": "0 0 10px rgba(244, 114, 182, 0.3)",
        "inner-blue": "inset 0 0 20px rgba(0, 212, 255, 0.05)",
        "inner-pink": "inset 0 0 20px rgba(244, 114, 182, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
