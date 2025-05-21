/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-darker': 'var(--color-primary-darker)',
        'primary-light': 'var(--color-primary-light)',
        'primary-lighter': 'var(--color-primary-lighter)',
        'primary-tint': 'var(--color-primary-tint)',
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
  },
  plugins: [],
}

