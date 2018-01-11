/**
 * @fileoverview core ruleset solium:all which describes the default severity of all rules but doesn't pass any arguments.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    rules: {
        "imports-on-top": "error",
        "variable-declarations": "error",
        "array-declarations": "error",
        "operator-whitespace": "error",
        "lbrace": "error",
        "mixedcase": "warning",
        "camelcase": "warning",
        "uppercase": "warning",
        "no-empty-blocks": "warning",
        "no-unused-vars": "error",
        "blank-lines": "warning",
        "indentation": "warning",
        "arg-overflow": "warning",
        "whitespace": "warning",
        "function-whitespace": "error",
        "semicolon-whitespace": "error",
        "comma-whitespace": "error",
        "conditionals-whitespace": "error",
        "deprecated-suicide": "warning",
        "pragma-on-top": "warning",
        "quotes": "error",
        "function-order": "warning",

        // Turn OFF all deprecated rules
        "double-quotes": "off",
        "no-with": "off"
    }

};
