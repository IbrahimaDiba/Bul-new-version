/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#1a1a1a',
          900: '#050505', // Deep black for premium background/text
        },
        crimson: {
          50: '#fffae6',
          100: '#fff0b3',
          200: '#ffe680',
          300: '#ffdc4d',
          400: '#ffd21a',
          500: '#d4af37', // Metallic gold base
          600: '#b08d28', // Darker metallic gold for strong contrast
          700: '#806921',
          800: '#554616',
          900: '#2b230b',
        },
        gold: {
          50: '#fffbe6',
          100: '#fff8cc',
          200: '#fff199',
          300: '#ffea66',
          400: '#ffe333',
          500: '#ffd700', // Standard gold
          600: '#ccac00',
          700: '#998100',
          800: '#665600',
          900: '#332b00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};