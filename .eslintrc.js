module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    // Allows for the parsing of modern ECMAScript features.
    sourceType: 'module',
    // Allows for the use of imports.
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX.
    },
  },

  plugins: ['unused-imports'],
  extends: [
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
    'next/core-web-vitals',
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'warn',
    'react/jsx-key': 'warn',
    'react/react-in-jsx-scope': 'off',
    // Configuration for import. See: https://github.com/import-js/eslint-plugin-import/tree/main.
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
    'import/no-named-as-default': 'off',
    // Configuration for unused-imports. See: https://github.com/sweepline/eslint-plugin-unused-imports#usage.
    '@typescript-eslint/no-unused-vars': 'off',
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
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use.
    },
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
