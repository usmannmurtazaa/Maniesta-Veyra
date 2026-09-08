import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mv: {
          primary: '#1A1A2E',
          'primary-hover': '#16213E',
          'primary-light': '#2A2A45',
          accent: '#C0392B',
          'accent-hover': '#A93226',
          'accent-light': '#E74C3C',
          bg: '#FAFAFA',
          'bg-alt': '#F5F5F0',
          dark: '#111118',
          text: '#1A1A2E',
          'text-secondary': '#4A4A5A',
          muted: '#8A8A9A',
          inverse: '#FAFAFA',
          'inverse-muted': '#B0B0BE',
          border: '#E8E8E0',
          'border-dark': '#2A2A45',
          focus: '#16213E',
          success: '#2ECC71',
          warning: '#F39C12',
          error: '#E74C3C',
          info: '#3498DB',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      spacing: {
        '2xs': '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
        '5xl': '128px',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 8px rgba(0, 0, 0, 0.08)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
        xl: '0 16px 48px rgba(0, 0, 0, 0.16)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;