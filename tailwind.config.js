/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'amiri': ['Amiri', 'serif'],
        'playfair': ['Playfair Display', 'serif'],
        'noto-arabic': ['Noto Sans Arabic', 'sans-serif'],
        'luxury': ['Playfair Display', 'Amiri', 'serif'],
      },
      colors: {
        // Morocco-inspired palette - Primary Terracotta Orange
        'morocco-blue': {
          50: '#fef5ed',
          100: '#fdebdb',
          200: '#fbd7b7',
          300: '#f9c393',
          400: '#f7af6f',
          500: '#B5541B',  // Primary Terracotta Orange
          600: '#9B4722',  // Dark Terracotta
          700: '#7a3819',
          800: '#5a2911',
          900: '#3a1a0a',
        },
        'morocco-sand': {
          50: '#faf7f3',
          100: '#f5efe7',
          200: '#ebdfcf',
          300: '#e1cfb7',
          400: '#d7bf9f',
          500: '#d4a574',  // Primary sand
          600: '#b8905f',
          700: '#8b6f47',  // Dark sand
          800: '#6d5738',
          900: '#4f3f28',
        },
        'morocco-orange': {
          50: '#fef5ed',
          100: '#fdebdb',
          200: '#fbd7b7',
          300: '#f9c393',
          400: '#f7af6f',
          500: '#f4a261',  // Primary orange
          600: '#e67e2a',
          700: '#c5691d',
          800: '#9d5417',
          900: '#743f11',
        },
        'morocco-teal': {
          50: '#e6f4f5',
          100: '#cce9eb',
          200: '#99d3d7',
          300: '#66bdc3',
          400: '#33a7af',
          500: '#1a9199',  // Accent teal
          600: '#157378',
          700: '#10555a',
          800: '#0b373b',
          900: '#06191c',
        }
      },
      backgroundImage: {
        'moroccan-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f4a261' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'desert-gradient': 'linear-gradient(135deg, #f4a261 0%, #e67e2a 50%, #d4a574 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #B5541B 0%, #9B4722 50%, #7a3819 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #B5541B 0%, #9B4722 25%, #f4a261 75%, #e67e2a 100%)',
      },
      boxShadow: {
        'moroccan': '0 10px 40px rgba(212, 165, 116, 0.2)',
        'travel': '0 8px 32px rgba(181, 84, 27, 0.15)',
      },
      keyframes: {
        'slide-down': {
          '0%': { transform: 'translate(-50%, -100%)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' }
        }
      },
      animation: {
        'slide-down': 'slide-down 0.3s ease-out'
      }
    }
  },
  plugins: [],
}