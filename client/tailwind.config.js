/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'rgb(var(--af-canvas-rgb) / <alpha-value>)',
          muted: 'rgb(var(--af-canvas-muted-rgb) / <alpha-value>)',
        },
        card: 'rgb(var(--af-card-rgb) / <alpha-value>)',
        line: 'rgb(var(--af-line-rgb) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--af-ink-rgb) / <alpha-value>)',
          muted: 'rgb(var(--af-ink-muted-rgb) / <alpha-value>)',
          faint: 'rgb(var(--af-ink-faint-rgb) / <alpha-value>)',
        },
        primary: {
          DEFAULT: '#7DAACB',
          dark: '#6a9ab8',
          darker: '#5a8aaa',
        },
        secondary: {
          DEFAULT: '#E8DBB3',
        },
        accent: {
          DEFAULT: '#CE2626',
          hover: '#b82121',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        nav: '0 1px 0 rgba(0, 0, 0, 0.06)',
        'nav-dark': '0 1px 0 rgba(255, 255, 255, 0.06)',
        card: '0 4px 24px -4px rgba(17, 24, 39, 0.07), 0 2px 8px rgba(17, 24, 39, 0.04)',
        'card-dark': '0 4px 24px -4px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.35)',
        'card-lg': '0 12px 40px -12px rgba(17, 24, 39, 0.1), 0 4px 16px rgba(17, 24, 39, 0.06)',
        'card-lg-dark': '0 12px 40px -12px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4)',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [],
};
