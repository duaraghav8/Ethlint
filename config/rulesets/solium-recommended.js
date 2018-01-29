/**
 * @fileoverview core ruleset solium:recommended. An entry exists in this set for each core rule of Solium
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    rules: {
        "imports-on-top": "error",
        "variable-declarations": "error",
        "array-declarations": "error",
        "no-unused-vars": "error",
        "quotes": "error",

        "no-empty-blocks": "warning",
        "indentation": "warning",
        "whitespace": "warning",
        "deprecated-suicide": "warning",
        "pragma-on-top": "warning",
        "function-whitespace": "warning",
        "semicolon-whitespace": "warning",
        "comma-whitespace": "warning",
        "operator-whitespace": "warning",

        "lbrace": "off",
        "mixedcase": "off",
        "camelcase": "off",
        "uppercase": "off",
        "blank-lines": "off",
        "arg-overflow": "off",
        "function-order": "off",
        "conditionals-whitespace": "off",

        // Disable deprecated rules
        "double-quotes": "off",
        "no-with": "off"
    }

};
