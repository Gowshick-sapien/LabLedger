/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gh: {
          bg: "#0d1117",
          "bg-secondary": "#161b22",
          border: "#30363d",
          "border-active": "#8b949e",
          text: "#c9d1d9",
          "text-muted": "#8b949e",
          link: "#58a6ff",
          blue: "#2f81f7",
          "blue-hover": "#1f6feb",
          green: "#238636",
          "green-hover": "#2ea043",
          danger: "#f85149",
          "danger-hover": "#da3633",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Noto Sans",
          "Helvetica",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
    },
  },
  plugins: [],
};
