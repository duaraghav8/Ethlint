/**
 * @fileoverview Ensure that a line of code doesn't exceed the specified number of characters.
 * @author Leo Arias <yo@elopio.net>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that a line of code doesn't exceed the specified number of characters"
        },

        schema: [{
            type: "integer", minimum: 1
        }]
    },

    create(context) {
        const maxLineLength = context.options ? context.options [0] : 145;
        const sourceCode = context.getSourceCode();

        function inspectProgram(emitted) {
            if (emitted.exit) {
                return;
            }

            let lines = sourceCode.text.split(/\r?\n/),
                lastLine = -1;

            // Recursive function.
            // --elopio - 20180421
            function checkNodes(nodes) {
                if (!Array.isArray(nodes)) {
                    nodes = [nodes];
                }
                nodes.forEach(node => {
                    let lineNumber = sourceCode.getLine(node) - 1;

                    if (lineNumber > lastLine && lines[lineNumber].length > maxLineLength) {
                        context.report({
                            node,
                            message: `Line exceeds the limit of ${maxLineLength} characters`
                        });

                        lastLine = lineNumber;
                    }

                    checkNodes(node.body || []);
                });
            }

            checkNodes(emitted.node.body);
        }

        return {
            Program: inspectProgram
        };

    }
};
