/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary-gold': '#D4B037',
        'primary-gold-light': '#E5C563',
        'primary-gold-dark': '#A08929',
        'primary-dark': '#32373c',
        'primary-blue': '#1B365D',
        'accent-amber': '#fcb900',
        'accent-orange': '#ff6900',
        'accent-cream': '#FFF8E7',
        'accent-warm-gray': '#F5F3F0',
        'hover-gold': '#b89930',
        'success-green': '#10B981',
        'error-red': '#cf2e2e'
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4B037 0%, #fcb900 100%)',
        'gradient-dark': 'linear-gradient(135deg, #32373c 0%, #1B365D 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFF8E7 0%, #F5F3F0 100%)'
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'Arial', 'sans-serif'],
        'open-sans': ['Open Sans', 'Arial', 'sans-serif']
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [],
}