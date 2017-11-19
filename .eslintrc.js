module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-inner-declarations": "warn",
        "no-console": "off",
        "no-undef": "off",
        "no-useless-escape": "off",
        "no-sparse-arrays": "off"   // we give undefined as test cases using pattern [, a, b]
    }
};