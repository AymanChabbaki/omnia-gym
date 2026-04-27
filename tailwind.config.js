/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4CAF50",
          dark: "#388E3C",
        },
        secondary: {
          DEFAULT: "#004a99", // Navy blue
          dark: "#003366",
        },
        on: {
          surface: "#1a1a1a",
          "surface-variant": "#666666",
        },
        badge: {
          sale: "#e74c3c",
          new: "#4CAF50",
          bestseller: "#FF9800",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headline: ['Outfit', 'sans-serif'],
      },
      maxWidth: {
        '1400': '1400px',
      }
    },
  },
  plugins: [],
}
