import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // DriveMind control plane — shares the website/widget "performance" palette.
        ink: "#08080A",
        coal: "#0D0D11",
        carbon: "#141419",
        steel: "#1C1C23",
        ash: "#8A8A95",
        fog: "#C7C7D1",
        accent: {
          DEFAULT: "#E11D2A",
          bright: "#FF3B41",
          dark: "#A50F1A",
        },
        brand: {
          DEFAULT: "#E11D2A",
          dark: "#A50F1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        condensed: ["var(--font-condensed)", "Impact", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        mega: "0.4em",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(225,29,42,0.4), 0 18px 50px -12px rgba(225,29,42,0.45)",
        card: "0 24px 60px -24px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "radial-accent": "radial-gradient(circle at 50% 0%, rgba(225,29,42,0.16), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "bar-stripes": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "28px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "bar-stripes": "bar-stripes 0.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
