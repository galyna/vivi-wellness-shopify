module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: '#C9F4E5',
        coral: '#FFB6A0',
        lemon: '#F8E598',
        charcoal: '#323232',
        softgray: '#F6F6F6',
        neon: '#7CFFCB',
        linen: '#e6e6b7',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        accent: ['Quicksand', 'Spline Sans', 'cursive'],
      },
    },
  },
  plugins: [],
}; 