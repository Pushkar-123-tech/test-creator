// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        'primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        'secondary': {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        'accent': {
          500: '#06b6d4',
          600: '#0891b2',
        },
        'success': {
          500: '#10b981',
          600: '#059669',
        },
        'warning': {
          500: '#f59e0b',
          600: '#d97706',
        },
        'error': {
          500: '#ef4444',
          600: '#dc2626',
        },
        'surface': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      animation: {
        'slide-in': 'slide-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float': 'float 12s ease-in-out infinite',
        'spin': 'spin 0.7s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'grid-move': 'grid-move 20s linear infinite',
      },
      keyframes: {
        'slide-in': {
          from: { transform: 'translateY(80px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) scale(1) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) scale(1.02) rotate(1deg)' },
          '50%': { transform: 'translateY(-40px) scale(1.05) rotate(0deg)' },
          '75%': { transform: 'translateY(-20px) scale(1.02) rotate(-1deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)' },
          '50%': { boxShadow: '0 0 50px rgba(99, 102, 241, 0.8), 0 0 100px rgba(139, 92, 246, 0.4), 0 0 150px rgba(6, 182, 212, 0.2)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'grid-move': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '50px 50px' },
        },
      },
      spacing: {
        '8.5': '34px',
        '9.5': '38px',
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 50px rgba(99, 102, 241, 0.6)',
      },
    },
  },
  plugins: [],
};