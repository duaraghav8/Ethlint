/**
 * @fileoverview Ensure maximum line length.
 * @author Leo Arias <yo@elopio.net>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure maximum line length"
        },

        schema: [{
            type: "integer", minimum: 1
        }]
    },

    create(context) {
        let maxLineLength = context.options ? context.options [0] : 79;

        const sourceCode = context.getSourceCode();

        function inspectProgram(emitted) {
            if (emitted.exit) {
                return;
            }

            let lines = sourceCode.text.split(/\r?\n/),
                lastLine = -1;

            // XXX recursive function.
            // --elopio - 20180421
            function checkNodes(nodes) {
                if (!Array.isArray(nodes)) {
                    nodes = [nodes];
                }
                nodes.forEach(node => {
                    let lineNumber = sourceCode.getLine(node) - 1;
                    if (lineNumber > lastLine && lines[lineNumber].length > maxLineLength) {
                        context.report({
                            node: node,
                            message: "line is longer than 79 characters"
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
