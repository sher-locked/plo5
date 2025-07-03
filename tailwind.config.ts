import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "Monaco", "Courier New", "monospace"],
        grotesk: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
    },
  },
  darkMode: "media", // rely on prefers-color-scheme, can switch to 'class' later
};

export default config; 