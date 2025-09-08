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
        blue: {
          main: "#5185E6",
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
    function ({ addUtilities }) {
      addUtilities({
        ".glass": {
          "background-blend-mode": "overlay",
          "background-image": "linear-gradient(to bottom right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05))",
          "box-shadow": "0px 1.1966018676757812px 29.91504669189453px 0px rgba(69, 42, 124, 0.10), inset 10px 10px 29px 0px rgba(255, 255, 255, 0.25)",
          "outline": "3px solid rgba(255, 255, 255, 0.5)",
          "outline-offset": "-3px",
          "backdrop-filter": "blur(47.86px)",
          "overflow": "hidden"
        },
        ".headerGlass": {
        "background-blend-mode": "overlay",
        "background-color": "rgb(255, 255, 255, 0.5)",
        "box-shadow": "0px 1.1966018676757812px 29.91504669189453px 0px rgba(69, 42, 124, 0.10), inset 10px 10px 29px 0px rgba(255, 255, 255, 0.25)",
        // "outline": "2px solid rgba(255, 255, 255)",
        "outline-offset": "-3px",
        "backdrop-filter": "blur(47.86px)",
        // overflow 속성 없음
      }
      });
    },
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