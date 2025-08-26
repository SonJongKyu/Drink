// tailwind.config.js

const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./chatbot/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            focus: "#f1cdd1",
            primary: {
              50:  "#fcecef",
              100: "#f8d8df",
              200: "#ecb1bf",
              300: "#df8a9f",
              400: "#d3647f",
              500: "#c83d5f",
              600: "#a63052",
              700: "#7f243f",
              800: "#59182c",
              900: "#2e0c17",
              // 메인(Default) 색상
              DEFAULT: "#900020",
              // 주 텍스트/아이콘에 사용할 전경색
              foreground: "#ffffff",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              50:  "#f8e0e3", 
              100: "#f3c2c7", 
              200: "#e59aa1", 
              300: "#d8747e", 
              400: "#ca4259",
              500: "#b81e3a", 
              600: "#9c1930", 
              700: "#7b1426", 
              800: "#5c0f1d", 
              900: "#3a0911", 
              DEFAULT: "#88001e",
              foreground: "#ffffff",
            },
            background: "#202020",
          },
        },
      },
    }),
  ],
};
