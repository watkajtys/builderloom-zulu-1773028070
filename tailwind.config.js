/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        'dark-surface': '#111111',
        'electric-blue': '#00F2FF',
        'neon-purple': '#BC13FE',
        'zinc-grey': '#71717a',
        'border-muted': 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        sans: ['Geist Sans', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
