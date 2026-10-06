/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#D97706', 600: '#B45309' },
        cream: { 50: '#FFFBF5', 100: '#FEF3E2' },
        choco: { 600: '#6B4A35', 900: '#3B2314' },
        wa: { 500: '#25D366', 600: '#1EBE5A' }
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
