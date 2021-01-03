module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        // Required so Tailwind CSS works in CSS modules
        // For more info, see https://dev.to/ryandunn/how-to-use-tailwind-with-create-react-app-and-postcss-with-no-hassle-2i09
        require('postcss-nested'),
      ],
    },
  },
};
