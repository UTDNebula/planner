// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1700px',
    },
    borderWidth: {
      DEFAULT: '1px',
      1.25: '1.25px',
      2: '2px',
    },
    extend: {
      colors: {
        generic: {
          white: '#FFFFFF',
          black: '#000000',
        },
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          DEFAULT: 'var(--color-primary-500)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
      },
      keyframes: {
        fadeInTwo: {
          '0%': { opacity: '0' },
          '100%': { opacity: '100' },
        },
        fadeIn: {
          '0%': { transform: 'translateX(1rem)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '100' },
        },
        fadeDown: {
          '0%': { transform: 'translateY(-1rem)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '100' },
        },
        slideUpAndFade: {
          '0%': {
            opacity: 0,
            transform: 'translateY(2px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        slideLeftAndFade: {
          '0%': {
            opacity: 0,
            transform: 'translateX(2px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        checkboxCheckmark: {
          '0%': {
            transform: 'translateY(20px)',
          },
          '75%': {
            transform: 'translateY(-2px)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        hide: 'fadeInTwo 1s ease-in-out',
        fade: 'fadeInTwo 150ms ease-in-out',
        intro: 'fadeIn 0.75s ease-in-out',
        fadeDown: 'fadeDown 0.75s ease-in-out',
      },
      gridTemplateColumns: {
        onboardingHonors: '40px minmax(0, 1fr)',
      },
    },
    fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
    },
  },
};
