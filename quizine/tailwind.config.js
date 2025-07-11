/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-darker': 'var(--color-primary-darker)',
        'primary-light': 'var(--color-primary-light)',
        'primary-lighter': 'var(--color-primary-lighter)',
        'primary-tint': 'var(--color-primary-tint)',
        // Warn colors
        warn: 'var(--color-warn)',
        'warn-light': 'var(--color-warn-light)',
        'warn-dark': 'var(--color-warn-dark)',
        // Backgrounds
        'bg-main': 'var(--bg-main)',
        'bg-gray-200': 'var(--bg-gray-200)',
        'bg-surface': 'var(--bg-surface)',
        'bg-card': 'var(--bg-card)',
        'bg-muted': 'var(--bg-muted)',
        // Text
        'text-main': 'var(--text-main)',
        'text-secondary': 'var(--text-secondary)',
        'text-disabled': 'var(--text-disabled)',
        'text-inverse': 'var(--text-inverse)',
        //Borders
        'border-main': 'var(--border-main)',
        'border-secondary': 'var(--border-secondary)',
        'border-light': 'var(--border-light)',
        'border-muted': 'var(--border-muted)',
        'border-primary': 'var(--border-primary)',
        'border-warn': 'var(--border-warn)',
      },
      borderColor: {
        primary: 'var(--color-primary-border)',
      },
      ringColor: {
        primary: 'var(--color-primary-focus-ring)',
      },
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
      }
    },
    screens: {
      xs: '440px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    }
  },
  plugins: [],
  safelist: [
    'text-text-main',
    'dark:text-text-main',
    'text-text-secondary',
    'dark:text-text-secondary',
  ],
}