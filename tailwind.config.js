/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF3366',
        secondary: '#33FF99',
        accent: '#6633FF',
        background: '#FFFFFF',
        text: '#111111',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'neo': '8px 8px 0px 0px rgba(0,0,0,0.8)',
        'neo-sm': '4px 4px 0px 0px rgba(0,0,0,0.8)',
        'neo-lg': '12px 12px 0px 0px rgba(0,0,0,0.8)',
        'neo-xl': '16px 16px 0px 0px rgba(0,0,0,0.8)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
};