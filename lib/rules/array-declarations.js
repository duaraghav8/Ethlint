/**
 * @fileoverview Ensure that array declarations don't have space between the type and brackets (i.e. uint[] x, not uint [] x; or uint[ ] x;)
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that array declarations don't have space between the type and brackets"
        },

        schema: [],

        fixable: "whitespace"

    },

    create: function(context) {

        let sourceCode = context.getSourceCode();

        function inspectType(emitted) {
            let node = emitted.node;

            if (emitted.exit || !node.array_parts.length) {
                return;
            }

            let code = sourceCode.getText(node), whitespaceDetector = /\s*(?=\[)/;

            // First the regex must detect whitespace between literal and opening bracket
            let scanned = whitespaceDetector.exec(code),
                whitespaceString = scanned [0], index = scanned.index;

            whitespaceString !== "" && context.report({
                node: node,
                location: { column: index + 1 },
                message: (
                    "There should be no whitespace between \""
					+ code.slice(0, index) + "\" and the opening square bracket."
                ),
                fix: function(fixer) {
                    return [fixer.removeRange(
                        [node.start + index, node.start + index + whitespaceString.length])];
                }
            });

            // Next, the regex must detect whitespace between opening & closing brackets
            // Since this regex doesn't exclude the brackets themselves, we have to move positions to acquire
            // the right info.
            if (node.array_parts.length === 1 && node.array_parts [0] === null) {
                let bracketString, indexWs;

                whitespaceDetector = /\[(\s*)\]/;
                scanned = whitespaceDetector.exec(code);
                bracketString = scanned [0], whitespaceString = scanned [1], index = scanned.index, indexWs = index + 1;

                (whitespaceString !== "") && context.report({

                    node: node,
                    location: { column: indexWs + 1 },

                    fix: function(fixer) {
                        return [fixer.replaceTextRange(
                            [node.start + index, node.start + index + bracketString.length], "[]")];
                    },

                    message: "There should be no whitespace between opening & closing square brackets. Use [] instead."

                });
            }
        }

        return {
            Type: inspectType
        };

    }

};
