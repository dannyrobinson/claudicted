import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: {
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
          500: 'var(--ink-500)',
          400: 'var(--ink-400)',
          300: 'var(--ink-300)',
          200: 'var(--ink-200)',
          100: 'var(--ink-100)'
        },
        brand: {
          700: 'var(--brand-700)',
          600: 'var(--brand-600)',
          500: 'var(--brand-500)',
          200: 'var(--brand-200)',
          100: 'var(--brand-100)'
        },
        success: {
          500: 'var(--success-500)'
        },
        warning: {
          500: 'var(--warning-500)'
        },
        danger: {
          500: 'var(--danger-500)'
        },
        surface: {
          DEFAULT: 'var(--surface)',
          subtle: 'var(--surface-subtle)'
        }
      },
      boxShadow: {
        lift: '0 12px 32px -18px rgba(17, 17, 17, 0.45)',
        soft: '0 8px 24px -16px rgba(31, 41, 55, 0.5)'
      },
      borderRadius: {
        card: '20px'
      },
      fontSize: {
        display: ['48px', { lineHeight: '60px', letterSpacing: '-0.02em' }],
        h1: ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
        h2: ['28px', { lineHeight: '36px' }],
        h3: ['24px', { lineHeight: '32px' }],
        h4: ['20px', { lineHeight: '28px' }],
        h5: ['18px', { lineHeight: '24px' }],
        body1: ['16px', { lineHeight: '24px' }],
        body2: ['14px', { lineHeight: '20px' }],
        body3: ['12px', { lineHeight: '16px' }]
      }
    }
  },
  plugins: []
};

export default config;
