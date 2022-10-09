// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        general: {
          primary: '#4659A7',
          secondary: '#BCC9FD',
          accentOne: '#FBBB78',
          accentTwo: '#A7EDE9',
        },
        primary: {
          light: '#BCC9FD',
          DEFAULT: '#7486CE',
          dark: '#4659A7',
        },
        secondary1: {
          light: '#FFE2C5',
          DEFAULT: '#FFCF9D',
          dark: '#FBBB78',
        },
        secondary2: {
          light: '#A7EDE9',
          DEFAULT: '#69CCC6',
          dark: '#4BA6A0',
        },
      },
      fontSize: {
        headline1: [
          '96px',
          {
            letterSpacing: '-1.5px',
          },
        ],
        headline2: [
          '60px',
          {
            letterSpacing: '-0.5px',
          },
        ],
        headline3: [
          '48px',
          {
            letterSpacing: '0px',
          },
        ],
        headline4: [
          '34px',
          {
            letterSpacing: '0.25px',
          },
        ],

        headline5: [
          '24px',
          {
            letterSpacing: '0px',
          },
        ],

        headline6: [
          '20px',
          {
            letterSpacing: '0.15px',
          },
        ],
        subtitle1: [
          '16px',
          {
            letterSpacing: '0.15px',
          },
        ],
        subtitle2: [
          '14px',
          {
            letterSpacing: '0.1px',
          },
        ],
        body1: [
          '16px',
          {
            letterSpacing: '0.5px',
          },
        ],
        body2: [
          '14px',
          {
            letterSpacing: '0.25px',
          },
        ],
        button: [
          '14px',
          {
            letterSpacing: '1.25px',
          },
        ],
        caption: [
          '12px',
          {
            letterSpacing: '0.4px',
          },
        ],
        overline: [
          '10px',
          {
            letterSpacing: '1.5px',
          },
        ],
      },
      keyframes: {
        fadeIn: {
          '0%': { transform: 'translateX(1rem)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '100' },
        },
        fadeDown: {
          '0%': { transform: 'translateY(-1rem)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '100' },
        },
      },
      animation: {
        intro: 'fadeIn 0.75s ease-in-out',
        fadeDown: 'fadeDown 0.75s ease-in-out',
      },
      gridTemplateColumns: {
        onboardingHonors: '40px minmax(0, 1fr)',
      },
    },
    fontFamily: {
      roboto: ['Roboto', 'ui-sans-serif', 'system-ui'],
      jost: ['Jost', 'Roboto', 'ui-sans-serif', 'system-ui'],

      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
};
