/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0B0F19",
          raised: "#111827",
          light: "#F9FAFB",
          lightRaised: "#FFFFFF",
        },
        border: {
          dark: "#1F2937",
          light: "#E5E7EB",
        },
        accent: {
          DEFAULT: "#6366F1",
          soft: "#8B5CF6",
          hover: "#4F46E5",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99, 102, 241, 0.15), 0 8px 24px -8px rgba(99, 102, 241, 0.35)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "toast-in": "toast-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
