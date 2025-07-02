/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./partials/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        ablue: "#0a3fa9",
      },
      fontFamily: {
        sans: ["Noto Sans"],
      },
    },
  },
  plugins: [],
}
