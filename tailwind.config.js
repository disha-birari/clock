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
        studio: {
          950: '#0B0D12',
          900: '#11141D',
          850: '#181C28',
          800: '#1F2434',
          700: '#2D3449',
          600: '#414B66',
        },
        gold: {
          400: '#FCE076',
          500: '#E6C453',
          600: '#C7A033',
          700: '#A37E20',
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
        glow: '0 0 25px -5px rgba(230, 196, 83, 0.3)',
        'glow-lg': '0 0 50px -10px rgba(230, 196, 83, 0.4)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 120s linear infinite',
        'tick-bounce': 'tickBounce 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        tickBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
