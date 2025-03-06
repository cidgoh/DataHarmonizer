module.exports = {
  ignorePatterns: [
    '.eslintrc.js',
    'web/webpack.config.js',
    'web/webpack.schemas.js',
    'lib/rollup.config.js',
    '**/dist/**/*.js',
    '.venv',
    'babel.config.js',
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
  rules: {
    // Allow unused vars that start with underscore
    // https://stackoverflow.com/a/64067915
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ]
  },
  plugins: ['jest'],
};
