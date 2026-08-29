/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            50: "#f0f4f8",
            100: "#d9e2ec",
            200: "#bcccdc",
            300: "#9fb3c8",
            400: "#627d98",
            500: "#334e68",
            600: "#243b53",
            700: "#1b2d45",
            800: "#102034",
            900: "#0b1524",
            950: "#060d17",
          },
          gold: {
            50: "#faf8f0",
            100: "#f3eed8",
            200: "#e6dab0",
            300: "#d8c385",
            400: "#caa758",
            500: "#b89037",
            600: "#9f772a",
            700: "#7c5922",
            800: "#5c411c",
            900: "#412e16",
            950: "#281b0a",
          },
          warm: {
            50: "#fafaf8",
            100: "#f5f5f0",
            200: "#ebebe3",
            300: "#ddddd2",
            400: "#c7c7b8",
            500: "#a9a997",
          },
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 8px -2px rgba(11, 21, 36, 0.05), 0 1px 4px -1px rgba(11, 21, 36, 0.03)",
        card: "0 4px 20px -2px rgba(11, 21, 36, 0.08), 0 2px 6px -1px rgba(11, 21, 36, 0.04)",
        elevated: "0 12px 32px -4px rgba(11, 21, 36, 0.12), 0 4px 12px -2px rgba(11, 21, 36, 0.06)",
        gold: "0 4px 20px -2px rgba(184, 144, 55, 0.25)",
      },
    },
  },
  plugins: [],
};
