/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          light: "#d4af37",
          DEFAULT: "#c5a572",
          dark: "#8b7355",
        },
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        header: "0 2px 8px 0 rgba(0, 0, 0, 0.06)",
        megamenu: "0 8px 24px 0 rgba(0, 0, 0, 0.12)",
        drawer: "0 0 24px 0 rgba(0, 0, 0, 0.15)",
      },
      transitionDuration: {
        "400": "400ms",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};

export default config;
