/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryMariner: {
          50: "#EFFAFF",
          100: "#DAF3FF",
          200: "#BEEAFF",
          300: "#91DFFF",
          400: "#5ECAFC",
          500: "#38AEF9",
          600: "#2292EE",
          700: "#1975D2",
          800: "#1C62B1",
          900: "#1C538C",
          950: "#163355",
        },
        primaryMagicMint: {
          50: "#EDFCF6",
          100: "#D4F7E8",
          200: "#9CE9CC",
          300: "#78DBD",
          400: "#41C6A1",
          500: "#1EAB88",
          600: "#118A6F",
          700: "#0D6F5B",
          800: "#005849",
          900: "#0C483D",
          950: "#052923",
        },
        primaryViking: {
          50: "#EFFAFC",
          100: "#D6F2F7",
          200: "#B2E4EF",
          300: "#6ECADF",
          400: "#42B2CE",
          500: "#2695B4",
          600: "#227998",
          700: "#22637C",
          800: "#245166",
          900: "#224557",
          950: "#112C3B",
        },
        primaryLinkWater: {
          50: "#F0F4F9",
          100: "#D7E2EF",
          200: "#B3C8E1",
          300: "#95B2D4",
          400: "#769CC8",
          500: "#5786BC",
          600: "#4270A6",
          700: "#365B88",
          800: "#2A4769",
          900: "#1E324A",
          950: "#111E2C",
        },
        secondaryComplementary: "#0097A7",
        greys: {
          50: "#F6F7F8",
          100: "#EAEDEF",
          200: "#D4D9DD",
          300: "#C2C9CE",
          400: "#A4AEB6",
          500: "#8D99A4",
          600: "#7C8794",
          700: "#6F7886",
          750: "#8896A3",
          800: "#5E646F",
          900: "#4D535B",
          950: "#323539",
        },
        neutrals: {
          black: "#1B1B1B",
          white: "#FFFFFF",
        },
        statesOrange: {
          orange: "#E2A139",
          orange16: "#E2A13929",
        },
        statesYellow: {
          yellow: "#C98C2B",
          yellow16: "#E2A1394D",
        },
        statesRed: {
          red: "#E23939",
          red16: "#E2393929",
        },
      },
    },
    fontFamily: {
      figtree: ["Figtree", "sans-serif"],
      georgia: ["Georgia", "serif"],
    },
    screens: {
      iphoneXXs: "320px", // => @media (min-width: 320px) { ... }
      iphone12: "360px", // => @media (min-width: 360px) { ... }
      iphoneXs: "375px", // => @media (min-width: 375px) { ... }
      iphone: "414px", // => @media (min-width: 414px) { ... }
      xxs: "450px", // => @media (min-width: 450px) { ... }
      xs: "500px", // => @media (min-width: 500px) { ... }
      sm: "640px", // => @media (min-width: 640px) { ... }
      md: "768px", // => @media (min-width: 768px) { ... }
      ipad4: "820px", // => @media (min-width: 820px) { ... }
      lg: "1024px", // => @media (min-width: 1024px) { ... }
      xl: "1280px", // => @media (min-width: 1280px) { ... }
      "1.25xl": "1360px", // => @media (min-width: 1360px) { ... }
      "1.5xl": "1440px", // => @media (min-width: 1440px) { ... }
      "2xl": "1680px", // => @media (min-width: 1680px) { ... }
      "2.5xl": "1800px", // => @media (min-width: 1800px) { ... }
      "3xl": "1920px", // => @media (min-width: 1920px) { ... }
    },
  },
  plugins: [],
};
