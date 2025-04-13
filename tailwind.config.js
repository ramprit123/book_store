/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'Poppins-Regular': ["Poppins-Regular", "system-ui", "-apple-system", "sans-serif"],
        'Poppins-Medium': ['Poppins-Medium', "system-ui", "-apple-system", "sans-serif"],
        'Poppins-SemiBold': ['Poppins-SemiBold', "system-ui", "-apple-system", "sans-serif"],
        'Poppins-Bold': ["Poppins-Bold", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        primary: "#4CAF50",
        textPrimary: "#2e5a2e",
        textSecondary: "#688f68",
        textDark: "#1b361b",
        placeholderText: "#767676",
        background: "#e8f5e9",
        cardBackground: "#f1f8f2",
        inputBackground: "#f4faf5",
        border: "#c8e6c9",
        white: "#ffffff",
        black: "#000000"
      }
    },
  },
  plugins: [],
};
