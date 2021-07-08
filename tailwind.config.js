// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#2A7EB7",
        secundary: "#226592",
        accent: "#E54942",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
