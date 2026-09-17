import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1c1b19",
        ivory: "#f7f2ea",
        bronze: "#b8916a",
        "bronze-light": "#d4aa88",
        sage: "#7a8f7a",
        stone: "#e8e2d9",
        ink: "#2e2c29",
        mist: "#9e9890",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
