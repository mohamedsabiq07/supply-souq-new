/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f3',
          100: '#ffe4e8',
          200: '#fecdd5',
          300: '#fda4b2',
          400: '#fb7187',
          500: '#cf2e46',
          600: '#b91c33',
          700: '#9f1230',
          800: '#881329',
          900: '#4c0612',
          950: '#260208',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#090d16',
        },
        obsidian: {
          950: '#04070d',
          900: '#070c15',
          850: '#0b1322',
          800: '#0f1a2e',
        },
        cyber: {
          300: '#fda4b2',
          400: '#fb7187',
          500: '#cf2e46',
          600: '#b91c33',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        gent: {
          obsidian: '#050505',
          mint: '#cf2e46',
          ice: '#ffb3bf',
          surface: '#2a050dcc',
          border: 'rgba(207, 46, 70, 0.15)',
          dark: '#140306d9',
          deep: '#7a0716cc',
        },
        souq: {
          ink: '#050505',
          charcoal: '#101010',
          graphite: '#191919',
          paper: '#f7f5f2',
          mist: '#ece9e4',
          red: '#cf2e46',
          redSoft: '#fb7187',
          redDeep: '#7a0716',
          line: 'rgba(5,5,5,0.1)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'glow-cyan': '0 0 20px -2px rgba(207, 46, 70, 0.35)',
        'glow-amber': '0 0 20px -2px rgba(245, 158, 11, 0.35)',
        'glow-brand': '0 0 25px -3px rgba(207, 46, 70, 0.4)',
        'glow-mint': '0 0 25px -2px rgba(207, 46, 70, 0.4)',
        'glow-mint-lg': '0 0 45px -5px rgba(207, 46, 70, 0.3)',
        'glow-red': '0 0 25px -2px rgba(207, 46, 70, 0.4)',
        'glow-red-lg': '0 0 45px -5px rgba(207, 46, 70, 0.3)',
      },
      animation: {
        'marquee': 'marquee 70s linear infinite',
        'marquee-reverse': 'marquee-reverse 70s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      }
    },
  },
  plugins: [],
}
