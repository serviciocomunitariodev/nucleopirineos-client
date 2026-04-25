import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          500: "#2b6cb0",
          700: "#1e4e8c",
        },
        primary: "#556B2F",
        secondary: "#974F43",
        background: "#FDFDF9",
        primaryActive: "#BBDF7C",
        primaryHover: "#78A034",
        superficies: "#F1F1E6",
      },
      borderRadius: {
        xl: "0.9rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
