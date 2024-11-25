module.exports = {
  ignorePatterns: [
    '.eslintrc.js',
    'web/webpack.config.js',
    'web/webpack.schemas.js',
    'lib/rollup.config.js',
    '**/dist/**/*.js',
    '.venv',
  ],
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {},
  plugins: ['jest'],
};
