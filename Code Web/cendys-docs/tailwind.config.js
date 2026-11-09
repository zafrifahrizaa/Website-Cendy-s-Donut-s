/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Token names dipertahankan agar layout/komponen tidak berubah; hanya nilainya yang diganti.
      colors: {
        brand: { 500: '#8E2835', 600: '#6F1E29' },      // spiced jam / burnt berry
        maroon: '#5B131E',                               // vintage oxblood (hero statement)
        cream: { 50: '#F6F4EE', 100: '#EAE6DC' },        // raw chalk / oatmeal dough
        choco: { 600: '#6B655D', 900: '#161413' },       // muted ink / roasted bean
        wa: { 500: '#161413', 600: '#5B131E' },          // aksi WhatsApp: ink -> oxblood saat hover
        line: '#D8D2C4',                                 // hairline border
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
