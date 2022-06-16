module.exports = {
    "ignorePatterns": [
        "main.js",
        "script/**/*.js",
        "**/dist/**/*.js"
    ],
    "env": {
        "browser": true,
        "es2021": true
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
    }
}
