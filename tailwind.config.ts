import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Retouch brand green (matches retouch.salon default green)
        brand: {
          50: "#f1f7f2",
          100: "#dcebde",
          200: "#bbd7c0",
          300: "#8fbb97",
          400: "#5e9a6a",
          500: "#3d7d4b",
          600: "#2e6539",
          700: "#26502f",
          800: "#204027",
          900: "#1b3522",
          950: "#0d1d12",
        },
        cream: "#f7f5ef",
        blush: "#FDF9F6",
        ink: "#000000",
        gold: "#b98a3e",
      },
      fontFamily: {
        serif: ["var(--font-noto-serif-jp)", "Noto Serif JP", "serif"],
      },
      maxWidth: {
        container: "1280px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.9s ease-out both",
        kenburns: "kenburns 18s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
