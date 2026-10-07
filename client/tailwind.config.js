/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sbt: {
          dark: '#08090D',
          card: '#12141D',
          cardHover: '#181B27',
          border: '#232738',
          gold: '#F59E0B',
          goldLight: '#FCD34D',
          goldDark: '#D97706',
          pink: '#E11D48',
          pinkLight: '#F43F5E',
          accent: '#EC4899',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'cinema-glow': 'radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.15) 0%, rgba(8, 9, 13, 0) 70%)',
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'pink-gradient': 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(24, 27, 39, 0.8) 0%, rgba(18, 20, 29, 0.95) 100%)',
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-pink': '0 0 25px -5px rgba(225, 29, 72, 0.4)',
        'screen-glow': '0 -15px 40px rgba(245, 158, 11, 0.25)',
      },
    },
  },
  plugins: [],
}
