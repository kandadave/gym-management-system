/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gymBlue: '#1e40af', // For headers, buttons
        gymGreen: '#059669', // For success states, accents
      },
    },
  },
  plugins: [],
}