import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50:  "#F0EEFF",
          100: "#E2DBFF",
          200: "#C5B8FF",
          300: "#A895FF",
          400: "#8B72FF",
          500: "#5B4BFF",
          600: "#4A3AEE",
          700: "#382ABA",
          800: "#271D87",
          900: "#150F54",
        },
      },
    },
  },
  plugins: [],
};
export default config;
