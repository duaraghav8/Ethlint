/**
 * @fileoverview Disallow trailing spaces and tabs at the end of lines
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


function isBlankLine(text) {
    return /^[ \t]*$/.test(text);
}

function isLineInsideAComment(line, lineNumber, commentNodes, sourceCode) {
    for (let i = 0; i < commentNodes.length; i++) {
        const c = commentNodes[i];

        switch (c.type) {
        case "Line":
            if (lineNumber === sourceCode.getLine(c)) {
                return true;
            }
            break;

        case "Block":
            if (lineNumber >= sourceCode.getLine(c) && lineNumber < sourceCode.getEndingLine(c)) {
                return true;
            }
            break;
        }
    }

    return false;
}


function create(context) {
    // For each line L of source code
    // If L is blank and skipBlankLines is set, skip
    // If L is a comment and ignoreComments is set, skip
    // Else report line only if it contains trailing whitespace
    function reportLinesWithTrailingWhitespace(emitted) {
        if (emitted.exit) {
            return;
        }

        // Call getSourceCode() inside the handler function.
        // This is because comments array is not populated before
        // a rule's create() is called.
        // So if SourceCode object is obtained directly inside create(),
        // comments array will always be empty.
        const sourceCode = context.getSourceCode();

        const { node } = emitted,
            codeLines = sourceCode.getLines(),
            comments = sourceCode.getComments();

        const options = (context.options && context.options[0]) || {},
            skipBlankLines = options.skipBlankLines || false,
            ignoreComments = options.ignoreComments || false;

        codeLines.forEach((line, i) => {
            if (
                (skipBlankLines && isBlankLine(line)) ||
                (ignoreComments && isLineInsideAComment(line, i+1, comments, sourceCode))
            ) {
                return;
            }

            const clean = line.trimRight();

            // TODO: Add fix capability
            // This requires us to know the start index of the code
            // on the flagged line. This index will be used to supply
            // a range that will be replaced with the fixed code.
            const issue = {
                node,
                location: {
                    line: i+1,
                    column: line.length - clean.length
                },
                message: "Line contains trailing whitespace"
            };

            if (line !== clean) {
                context.report(issue);
            }
        });
    }

    return {
        Program: reportLinesWithTrailingWhitespace
    };
}


module.exports = {

    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Disallow trailing spaces and tabs at the end of lines"
        },

        schema: [{
            type: "object",
            properties: {
                skipBlankLines: { type: "boolean" },
                ignoreComments: { type: "boolean" }
            },
            additionalProperties: false
        }]
    },

    create
};