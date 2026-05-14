import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#081120",
        panel: "#0e1a31",
        panelAlt: "#142544",
        border: "#22385d",
        muted: "#97abcb",
        accent: "#ff7a70",
        secondary: "#54c6eb",
        warning: "#f3b44e",
        danger: "#f85f73",
        violet: "#a68cff"
      },
      boxShadow: {
        glow: "0 24px 60px rgba(0, 0, 0, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
