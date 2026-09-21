/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#09090b",
          surface: "#121215",
          card: "#18181b",
          muted: "#27272a",
          border: "#27272a",
          borderStrong: "#3f3f46",
        },
      },
    },
  },
  plugins: [],
};
