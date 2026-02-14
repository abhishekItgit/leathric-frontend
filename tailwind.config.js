/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        leather: {
          950: '#090909',
          900: '#111111',
          800: '#191919',
          700: '#27221d',
          600: '#3a3027',
          accent: '#c49a6c',
        },
      },
      boxShadow: {
        premium: '0 20px 40px rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 500ms ease-out forwards',
      },
    },
  },
  plugins: [],
};
