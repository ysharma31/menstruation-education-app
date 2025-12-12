/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '480px',
      'md': '769px',
      'lg': '1025px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Primary warm colors - approachable and friendly
        primary: {
          50: '#FFF5F5',
          100: '#FFE8E8',
          200: '#FFCCCC',
          300: '#FFB3B3',
          400: '#FF8A8A',
          500: '#FF6B6B',
          600: '#E85555',
          700: '#CC4444',
          800: '#A33636',
          900: '#7A2929',
        },
        // Secondary coral/peach tones
        secondary: {
          50: '#FFF8F5',
          100: '#FFEEE8',
          200: '#FFD4C4',
          300: '#FFBAA0',
          400: '#FF9F7D',
          500: '#FF8459',
          600: '#E86E43',
          700: '#CC5833',
          800: '#A34426',
          900: '#7A331D',
        },
        // Accent lavender - calming
        accent: {
          50: '#F8F5FF',
          100: '#EDE8FF',
          200: '#D9CCFF',
          300: '#C4B3FF',
          400: '#A38AFF',
          500: '#8B6BFF',
          600: '#7555E8',
          700: '#5F44CC',
          800: '#4936A3',
          900: '#36297A',
        },
        // Warm neutrals
        warm: {
          50: '#FFFBF7',
          100: '#FFF7F0',
          200: '#FFEEDD',
          300: '#FFE4CC',
          400: '#FFD4B3',
          500: '#FFC499',
          600: '#E8A87A',
          700: '#CC8C5C',
          800: '#A3704A',
          900: '#7A5438',
        },
        // Background colors
        background: {
          light: '#FFFBF7',
          DEFAULT: '#FFF8F3',
          dark: '#FFF5EE',
        },
        // Text colors
        text: {
          primary: '#4A3728',
          secondary: '#6B5344',
          muted: '#8B7766',
          light: '#A89888',
        },
        // Section-specific colors
        boys: {
          light: '#E8F4FF',
          DEFAULT: '#64B5F6',
          dark: '#1976D2',
        },
        girls: {
          light: '#FCE4EC',
          DEFAULT: '#F48FB1',
          dark: '#C2185B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'warm': '0 4px 20px -2px rgba(255, 107, 107, 0.15)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
