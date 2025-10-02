/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F3EAE4',
          100: '#E7D5C9',
          200: '#D9BCA7',
          300: '#C99F82',
          400: '#B9845F',
          500: '#99643F',
          600: '#6B3F1D', // requested dark brown
          700: '#4E2E13',
          800: '#3B230E',
          900: '#2B190A',
        },
        cream: {
          50: '#fefdf8',
          100: '#fefbf0',
          200: '#fcf5e0',
          300: '#f9ecc0',
          400: '#f5e096',
          500: '#f0d46b',
          600: '#e8c547',
          700: '#d9b02f',
          800: '#b8931f',
          900: '#95751c',
        }
      }
    },
  },
  plugins: [],
}
