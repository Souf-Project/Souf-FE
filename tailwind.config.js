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
    function ({ addUtilities }) {
      addUtilities({
        ".title-1": {
          fontFamily: "Pretendard, sans-serif",
          fontSize: "40px",
          fontWeight: "700",
          lineHeight: "58px",
          letterSpacing: "-1.8px",
        },
        ".title-2": {
          fontFamily: "Pretendard, sans-serif",
          fontSize: "36px",
          fontWeight: "500",
          lineHeight: "42px",
          letterSpacing: "-1.62px",
        },
        ".body-light": {
          fontFamily: "Pretendard",
          fontSize: "20px",
          fontWeight: "300",
          lineHeight: "30px",
          letterSpacing: "-0.9px",
        },
        ".body-highlight-1": {
          fontFamily: "Pretendard, sans-serif",
          fontSize: "24px",
          fontWeight: "700",
          lineHeight: "36px",
          letterSpacing: "-1.08px",
        },
        ".body-highlight-2 ": {
          fontFamily: "Pretendard, sans-serif",
          fontSize: "13px",
          fontWeight: "700",
          lineHeight: "20px",
          letterSpacing: "-0.39px",
        },

        ".body-highlight-3": {
          fontFamily: "Pretendard, sans-serif",
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "24px",
          letterSpacing: "-0.56px",
        },
        ".body-light-3": {
          fontFamily: "Pretendard, sans-serif",
          fontSize: "16px",
          fontWeight: "300",
          lineHeight: "24px",
          letterSpacing: "-0.56px",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};