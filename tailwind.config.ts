/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    extend: {
      colors: {
        red: {
          100: '#fee2e2',
          600: '#dc2626',
        },
        yellow: {
          200: '#fef08a',
        },
        green: {
          200: '#bbf7d0',
        },
        blue: {
          200: '#bfdbfe',
        },
        purple: {
          200: '#e9d5ff',
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}