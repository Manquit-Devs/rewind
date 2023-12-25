/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'major': ['Major Mono Display', 'monospace'],
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 90s linear infinite',
        'reverse-infinite-scroll': 'reverse-infinite-scroll 80s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'reverse-infinite-scroll': {
          from: { transform: 'translateX(-80%)' },
          to: { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}

