module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6470F7',
          DEFAULT: '#2F3FF4',
          dark: '#0B1CD5',
        },
        secondary: {
          light: '#2FEEAB',
          DEFAULT: '#11D08D',
          dark: '#0C9766',
        },
        light: '#F9F9FA',
        dark: '#1F201F',
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
    },
    fontFamily: {
      sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
