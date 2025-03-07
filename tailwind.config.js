/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        gold: {
          50: '#fefdf7',
          100: '#fdfbeb',
          200: '#faf4c8',
          300: '#f7eda5',
          400: '#f1e05f',
          500: '#ebd319',
          600: '#d4be17',
          700: '#b19e13',
          800: '#8e7f0f',
          900: '#74670c',
          950: '#443c05',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        serif: ['Crimson Pro', 'serif'],
      },
      boxShadow: {
        'neo': '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
        'neo-dark': '20px 20px 60px #1a1a1a, -20px -20px 60px #262626',
      },
    },
  },
  plugins: [],
};