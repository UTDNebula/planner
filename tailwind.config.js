module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#6470F7",
          DEFAULT: "#2F3FF4",
          dark: "#0B1CD5",
        },
        secondary: {
          light: "#2FEEAB",
          DEFAULT: "#11D08D",
          dark: "#0C9766",
        },
        navigation: {
          DEFAULT: "#878FD6",
          dark: "#5159A3",
          line: "#C8D1F3",
        },
        light: "#F9F9FA",
        dark: "#1F201F",
      },
      fontSize: {
        headline1: [
          "96px",
          {
            letterSpacing: "-1.5px",
          },
        ],
        headline2: [
          "60px",
          {
            letterSpacing: "-0.5px",
          },
        ],
        headline3: [
          "48px",
          {
            letterSpacing: "0px",
          },
        ],
        headline4: [
          "34px",
          {
            letterSpacing: "0.25px",
          },
        ],

        headline5: [
          "24px",
          {
            letterSpacing: "0px",
          },
        ],

        headline6: [
          "20px",
          {
            letterSpacing: "0.15px",
          },
        ],
        subtitle1: [
          "16px",
          {
            letterSpacing: "0.15px",
          },
        ],
        subtitle2: [
          "14px",
          {
            letterSpacing: "0.1px",
          },
        ],
        body1: [
          "16px",
          {
            letterSpacing: "0.5px",
          },
        ],
        body2: [
          "14px",
          {
            letterSpacing: "0.25px",
          },
        ],
        button: [
          "14px",
          {
            letterSpacing: "1.25px",
          },
        ],
        caption: [
          "12px",
          {
            letterSpacing: "0.4px",
          },
        ],
        overline: [
          "10px",
          {
            letterSpacing: "1.5px",
          },
        ],
      },
      keyframes: {
        fadeIn: {
          "0%": { transform: "translateX(1rem)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "100" },
        },
        fadeDown: {
          "0%": { transform: "translateY(-1rem)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "100" },
        },
      },
      animation: {
        intro: "fadeIn 0.75s ease-in-out",
        fadeDown: "fadeDown 0.75s ease-in-out",
      },
      gridTemplateColumns: {
        onboardingHonors: "40px minmax(0, 1fr)",
      },
    },
    fontFamily: {
      sans: ["Roboto", "ui-sans-serif", "system-ui"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
