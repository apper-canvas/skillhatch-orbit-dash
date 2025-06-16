/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D5016',
        secondary: '#7CB342',
        accent: '#FF6B35',
        surface: '#FAFAF8',
        background: '#F5F5F0',
        success: '#4CAF50',
        warning: '#FFA726',
        error: '#EF5350',
        info: '#29B6F6',
        forest: {
          50: '#f0f7ed',
          100: '#dcedd1',
          200: '#bcdba8',
          300: '#95c275',
          400: '#7CB342',
          500: '#578a2e',
          600: '#446d23',
          700: '#36551e',
          800: '#2D5016',
          900: '#233f11'
        },
        warm: {
          50: '#fefaf9',
          100: '#fdf4f0',
          200: FAFAF8',
          300: '#F5F5F0',
          400: '#e8e3de',
          500: '#d4ccc4',
          600: '#b8a999',
          700: '#9a8471',
          800: '#7a6856',
          900: '#5d4f3f'
        }
      },
      fontFamily: {
        display: ['Fredoka One', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        body: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px'
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'elevation': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'float': '0 8px 32px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}