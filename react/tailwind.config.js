/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#2EA7FF",
      },
      fontFamily: {
        display: ['"Jost"', "system-ui", "sans-serif"],
        sans: ['"Jost"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
