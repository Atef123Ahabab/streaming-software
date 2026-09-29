/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stream-black': '#0a0a0f',
        'stream-dark': '#12121a',
        'stream-panel': '#1a1a24',
        'stream-neon': '#ff00aa',
        'stream-cyan': '#00f0ff',
        'stream-purple': '#9d4edd',
        'stream-text': '#e6e6f0',
        'stream-muted': '#8a8a9a',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 0, 170, 0.4)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.4)',
      },
    },
  },
  plugins: [],
}