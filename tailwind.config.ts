import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // 60% Dominant (Canvas / Main Backgrounds)
        background: '#ffffff',
        
        // 30% Secondary (Text, Borders, Cards, Sidebars)
        neutral: {
          light: '#f4f4f5', // For card backgrounds / subtle sections
          DEFAULT: '#71717a', // For secondary text / borders
          dark: '#18181b', // For main headings / body text
        },
        
        // 10% Accent (Buttons, Links, Badges, Call-to-actions)
        emerald: {
          light: '#ecfdf5', // For soft alert backgrounds
          DEFAULT: '#047857', // Rich Emerald
          dark: '#064e3b', // For hover states
        },
      },
      // colors: {
      //   brand: {
      //     50: "#f0fdf6",
      //     100: "#dcfce9",
      //     // Route these to our new dynamic CSS variables
      //     500: "var(--brand-500)",
      //     600: "var(--brand-600)",
      //     700: "var(--brand-700)",
      //     900: "#064e3b",
      //   },
      // },
    },
  },
  plugins: [],
};

export default config;
