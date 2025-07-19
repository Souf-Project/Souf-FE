/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        yellow: {
          main: "#FFE58F",
          point: "#FFC400",
        },
        red: {
          essential: "#E43F2D",
        },
        grey: {
          border: "#C9C9C9",
        }
      },
      fontFamily: {
        Pretendard: ["Pretendard"],
      },

      screens: {
        xs: "320px", 
      },
      
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite'
      }
    },
  },
  plugins: [
    // function ({ addUtilities }) {
    //   addUtilities({
        
    //     ".no-scrollbar": {
    //       "-ms-overflow-style": "none",
    //       "scrollbar-width": "none",
    //     },
    //     ".no-scrollbar::-webkit-scrollbar": {
    //       display: "none",
    //     },
    //   });
    // },
  ],
  safelist: [
    'max-h-[1000px]',
  'max-h-0',
  'opacity-100',
  'opacity-0',
  'pointer-events-none',
    'rotate-45',
    '-rotate-45',
    'translate-y-1.5',
    '-translate-y-1.5',
    'scale-y-[1]',
    'scale-y-0', 
  ],
};