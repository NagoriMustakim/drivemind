import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // NextGear Motors — dark "performance showroom" palette
        ink: "#08080A", // page background (near-black)
        coal: "#0D0D11", // section background
        carbon: "#141419", // card / surface
        steel: "#1C1C23", // elevated surface / borders
        ash: "#8A8A95", // muted text
        fog: "#C7C7D1", // secondary text
        accent: {
          DEFAULT: "#E11D2A", // signature red
          bright: "#FF3B41",
          dark: "#A50F1A",
        },
        // Back-compat alias used by older markup — points at the red accent now.
        brand: {
          DEFAULT: "#E11D2A",
          dark: "#A50F1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        condensed: ["var(--font-condensed)", "Impact", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        mega: "0.4em",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(225,29,42,0.4), 0 18px 50px -12px rgba(225,29,42,0.55)",
        card: "0 24px 60px -20px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "radial-accent":
          "radial-gradient(circle at 50% 0%, rgba(225,29,42,0.18), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 1s ease both",
        marquee: "marquee 38s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        "slide-down": "slide-down 0.25s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
