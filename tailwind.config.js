/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <- add this
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Optional: match your original colors exactly
        indigo: {
          100: "#e0e7ff",
          700: "#4338ca",
          900: "#312e81",
          300: "#c7d2fe",
        },
        emerald: {
          100: "#d1fae5",
          700: "#065f46",
          900: "#064e3b",
          300: "#a7f3d0",
        },
        purple: {
          100: "#e9d5ff",
          700: "#6b21a8",
          900: "#4c1d95",
          300: "#e9d5ff",
        },
        amber: {
          100: "#fef3c7",
          700: "#92400e",
          900: "#78350f",
          300: "#fde68a",
        },
      },
    },
  },
};
