/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        leather: {
          950: '#0f172a',
          900: '#1d2435',
          800: '#2b3143',
          700: '#3b2f2f',
          600: '#5b4f4f',
          accent: '#c9a86a',
          cream: '#f9f7f3',
          neutral: '#e5e7eb',
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
