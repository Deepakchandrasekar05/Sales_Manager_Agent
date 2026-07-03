import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
      colors: {
        background: '#000000',
        foreground: '#FFFFFF',
        card: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          foreground: '#FFFFFF',
        },
        border: 'rgba(255,255,255,0.2)',
        input: 'rgba(255,255,255,0.1)',
        muted: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          foreground: 'rgba(255,255,255,0.65)',
        },
        accent: {
          DEFAULT: 'rgba(255,255,255,0.1)',
          foreground: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        ring: 'rgba(255,255,255,0.3)',
        status: {
          present: '#22C55E',
          absent: '#EF4444',
          waiting: '#F59E0B',
          pending: '#F59E0B',
          active: '#22C55E',
          warning: '#F59E0B',
          failed: '#EF4444',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-down': 'slideDown 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(255,255,255,0.1)' },
          to: { boxShadow: '0 0 40px rgba(255,255,255,0.25)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
