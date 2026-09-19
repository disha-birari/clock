/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        obsidian: {
          DEFAULT: '#08090D',
          950: '#0B0D12',
          900: '#0F121C',
          850: '#161B29',
          800: '#1F263B',
        },
        gold: {
          300: '#FFF1A4',
          400: '#FCE076',
          500: '#E6C453',
          600: '#C7A033',
          700: '#A37E20',
        },
        neon: {
          rose: '#F43F5E',
          sky: '#38BDF8',
          amber: '#F59E0B',
          emerald: '#10B981',
          purple: '#A855F7',
        },
        wood: {
          walnut: '#3D251E',
          rosewood: '#2C1613',
          oak: '#8B5A2B',
          mahogany: '#4A150E',
        },
        brass: '#C5A059',
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(230, 196, 83, 0.35)',
        'glow-lg': '0 0 45px -8px rgba(230, 196, 83, 0.5)',
        'glow-neon': '0 0 30px -5px rgba(244, 63, 94, 0.4)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 120s linear infinite',
        'gradient-x': 'gradientX 6s ease infinite',
      },
      keyframes: {
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
      },
    },
  },
  plugins: [],
};
