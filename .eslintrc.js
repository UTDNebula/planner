module.exports = {
  parser: '@typescript-eslint/parser',
  // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020,
    // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',
    // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    // project: ['./tsconfig.json'],
  },

  plugins: ['simple-import-sort', 'unused-imports'],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'warn',
    'react/jsx-key': 'warn',
    'simple-import-sort/imports': process.env.NODE_ENV === 'test' ? 'error' : 'off',
    'simple-import-sort/exports': process.env.NODE_ENV === 'test' ? 'error' : 'off',
    'react/react-in-jsx-scope': 'off',
    'unused-imports/no-unused-imports': process.env.NODE_ENV === 'test' ? 'error' : 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
