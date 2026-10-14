/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pickle: {
          red: "#781E26",
          darkred: "#5B1720",
          yellow: "#F2B632",
          yellowLight: "#FDE68A",
          cream: "#FFF4E3",
          creamLight: "#FFF9F0",
          warmWhite: "#FFFCF7",
          darkText: "#2B211D",
          green: "#54734C",
          greenLight: "#E8F0E6",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(120, 30, 38, 0.08)",
        cardHover: "0 10px 25px -3px rgba(120, 30, 38, 0.16)",
      },
    },
  },
  plugins: [],
};
