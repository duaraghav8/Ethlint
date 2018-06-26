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
        "function-whitespace": "error",
        "semicolon-whitespace": "error",
        "comma-whitespace": "error",
        "conditionals-whitespace": "error",
        "value-in-payable": "error",
        "no-unused-vars": "error",
        "quotes": "error",
        "linebreak-style": "error",

        "mixedcase": "warning",
        "camelcase": "warning",
        "uppercase": "warning",
        "no-empty-blocks": "warning",
        "blank-lines": "warning",
        "indentation": "warning",
        "arg-overflow": "warning",
        "whitespace": "warning",
        "deprecated-suicide": "warning",
        "pragma-on-top": "warning",
        "function-order": "warning",
        "emit": "warning",
        "no-constant": "warning",
        "no-experimental": "warning",
        "max-len": "warning",
        "error-reason": "warning",
        "visibility-first": "warning",

        // Turn OFF all deprecated rules
        "double-quotes": "off",
        "no-with": "off"
    }

};
