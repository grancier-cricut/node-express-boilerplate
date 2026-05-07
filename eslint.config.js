const js = require('@eslint/js');
const globals = require('globals');
const jest = require('eslint-plugin-jest');
const security = require('eslint-plugin-security');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  {
    ignores: ['bin/**', 'coverage/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    plugins: {
      jest,
      security
    },
    rules: {
      ...jest.configs.recommended.rules,
      ...security.configs.recommended.rules,
      'comma-dangle': ['error', 'never'],
      'no-console': ['error', { allow: ['error'] }],
      'func-names': 'off',
      'no-underscore-dangle': 'off',
      'consistent-return': 'off',
      'jest/expect-expect': 'off',
      'security/detect-object-injection': 'off'
    }
  },
  prettierRecommended
];
