/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./views/**/*.html",
    "./components/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'vip-gold': '#D4AF37',
        'vip-gold-dark': '#B8860B',
        'vip-black': '#0A0A0A',
        'vip-black-light': '#1A1A1A',
        'vip-gray': '#F5F5F5',
        'vip-gray-dark': '#E5E5E5'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif']
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1' }],
        'hero-mobile': ['2.5rem', { lineHeight: '1.2' }],
        'section': ['2.5rem', { lineHeight: '1.2' }],
        'section-mobile': ['2rem', { lineHeight: '1.3' }]
      },
      spacing: {
        'section': '80px',
        'section-mobile': '40px'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}