/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0f172a",
        panel: "#111827",
        soft: "#1f2933",
      },
    },
  },
  plugins: [],
};
