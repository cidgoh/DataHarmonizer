module.exports = {
    "ignorePatterns": [
        ".eslintrc.js",
        "web/webpack.config.js",
        "lib/rollup.config.js",
        "main.js",
        "script/**/*.js",
        "**/dist/**/*.js"
    ],
    "env": {
        "browser": true,
        "es2021": true,
        "jest/globals": true
    },
    "extends": [
        "eslint:recommended",
        "prettier"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    },
    "plugins": ["jest"]
}
