/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Custom game colors
        'game-red': '#e74c3c',
        'game-blue': '#3498db', 
        'game-green': '#27ae60',
        'game-yellow': '#f1c40f',
        'game-gray': '#95a5a6',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'score-update': 'scoreUpdate 0.6s ease',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        scoreUpdate: {
          '0%': { 
            transform: 'scale(1)',
            backgroundColor: '#f8f9fa'
          },
          '50%': { 
            transform: 'scale(1.05)',
            backgroundColor: '#e8f5e8'
          },
          '100%': { 
            transform: 'scale(1)',
            backgroundColor: '#f8f9fa'
          }
        },
        slideUp: {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      screens: {
        'xs': '475px',
      }
    },
  },
  plugins: [],
}