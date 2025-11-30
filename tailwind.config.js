/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af",
        muted: "#6b7280",
        background: "#f8fafc",
      },
      fontFamily: {
        poppins: ["Poppins"], // Regular
        poppinsBold: ["Poppins-Bold"],
        poppinsSemiBold: ["Poppins-SemiBold"],
      },
    },
  },
  plugins: [],
}

