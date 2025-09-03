/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6D28D9",
        "primary-dark": "#5B21B6",
      },
    },
  },
  plugins: [],
};
