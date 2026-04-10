/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ed',
          200: '#b3c5dc',
          300: '#8ca8cb',
          400: '#6688ba',
          500: '#4d6fa3',
          600: '#3f5985',
          700: '#34496f',
          800: '#2c3c5c',
          900: '#1a365d', // Primary navy color
        },
        crimson: {
          50: '#fce8ec',
          100: '#f9d0da',
          200: '#f2a5b9',
          300: '#eb7998',
          400: '#e44f77',
          500: '#dc2755',
          600: '#c41e3a', // Secondary crimson color
          700: '#a5193a',
          800: '#851539',
          900: '#6b1336',
        },
        gold: {
          50: '#fffbe6',
          100: '#fff8cc',
          200: '#fff199',
          300: '#ffea66',
          400: '#ffe333',
          500: '#ffd700', // Accent gold color
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