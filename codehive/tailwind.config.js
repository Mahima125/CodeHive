/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        animation: {
          'slide-in-left': 'slideInLeft 1s ease-out',
          'slide-in-right': 'slideInRight 1s ease-out',
        },
        keyframes: {
          slideInRight: {
            '0%': { transform: 'translateX(90%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideInLeft: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          },
        },
      
    },
  },
  plugins: [],
}

