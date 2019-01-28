/**
 * @fileoverview Ensure appropriate number of blank lines exist between different segments of the code.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const eol = require("os").EOL;


function hasNConsecutiveBlankLines(string, n) {
    let pattern = `(\r?\n[ \t]*){${n},}\r?\n`;
    return new RegExp(pattern).test(string);
}


function getCorrectionString(string, n) {
    let matches = string.match(/(\r?\n[ \t]*)/g);
    if (!matches) {
        return eol.repeat(n + 1);
    }
    let number = Math.max(0, n + 1 - matches.length);
    return eol.repeat(number);
}


module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that there is exactly a 2-line gap between Contract and Function declarations"
        },

        fixable: "whitespace",

        schema: []

    },

    create(context) {

        const sourceCode = context.getSourceCode(),
            noCodeRegExp = /^\s*$/,
            isCommentRegExp = /\s*(\/\/*)|(\*\\*)|(\/\**)$/,
            strictCommentRegExp = /^\s*(\/\/*)|(\*\\*)|(\/\**)$/; // Tests whether the entire line is a comment
        const topLevelDeclarations = [ "ContractStatement", "LibraryStatement" ];

        function inspectProgram(emitted) {
            if (emitted.exit) {
                return;
            }

            function report(topLevelNode, spacing) {
                const message = `${topLevelNode.type.replace("Statement", "")} '${topLevelNode.name}' `
                    + "must be preceded by 2 blank lines.";

                context.report({
                    node: topLevelNode, message,
                    fix(fixer) {
                        // The fix strategy is as follows:
                        // - count lines going upwards (without going beyond the bounds of the spacing between this node and the previous one)
                        // - Skip over any accompanying comments of the top level node
                        // - Count the number of blank lines directly above the top-most accompanying comments iteratively
                        // - Insert the desired number of line break characters right before the comment

                        let line = sourceCode.getLine(topLevelNode) - 1, // The line number
                            maxLines = spacing.split(eol).length,
                            bottomLine = sourceCode.getLine(topLevelNode),
                            multipleLines = spacing.includes(eol), // Whether there are multiple lines
                            insertAt = topLevelNode.start, // The point to insert the new line characters at
                            numberOfBreaks = multipleLines ? 1 : 0; // The number of line breaks there are currently (default to 1 if there are multiple lines)

                        // If there are multiple lines, manually count the number of lines (after skipping the accompanying comments)
                        if (multipleLines) {
                            // Subtract by the column number to preserve any indentation when inserting the newlines during the fix
                            insertAt -= sourceCode.getColumn(topLevelNode);

                            // Skip over all the node's accompanying comments
                            while (strictCommentRegExp.test(sourceCode.getTextOnLine(line))) {
                                insertAt -= sourceCode.getTextOnLine(line).length + 1;

                                let text = sourceCode.getTextOnLine(line);

                                // Multi line block comment, jump over the entire thing
                                if (text.includes("*/") && !text.includes("/*")) {
                                    let rest = sourceCode.getText().slice(0, insertAt);
                                    let blockCommentStart = rest.lastIndexOf("/*");

                                    // Decrement the line number by the number of lines the block comment takes up
                                    line -= sourceCode.getText().slice(blockCommentStart, insertAt).split(eol).length;
                                    // Set the endpoint to the end of the line above the block comment
                                    insertAt = sourceCode.getText().slice(0, blockCommentStart).lastIndexOf(eol) + 1;
                                } else {
                                    // If it's just a regular comment, decrement the line number
                                    line--;
                                }
                            }

                            // Count how many blank lines there are currently
                            while (bottomLine - line < maxLines && line > 0 && noCodeRegExp.test(sourceCode.getTextOnLine(line--))) {
                                numberOfBreaks++;
                            }
                        }

                        // Repeat the end-of-line string to ensure there are 2 blank lines
                        const correction = Math.max(0, 3 - numberOfBreaks);
                        return [fixer.insertTextAt(insertAt, eol.repeat(correction))];
                    }
                });
            }

            const { node } = emitted, programBody = node.body;

            for (let i = 1; i < programBody.length; i++) {
                const currNode = programBody [i], prevNode = programBody [i-1];

                if (!topLevelDeclarations.includes(currNode.type)) {
                    continue;
                }

                const spacing = sourceCode.getStringBetweenNodes(prevNode, currNode);
                if (!hasNConsecutiveBlankLines(spacing, 2)) {
                    report(currNode, spacing);
                }
            }
        }


        function inspectChild(emitted) {
            let node = emitted.node, body = node.body || [];

            function report(node, spacing) {
                context.report({
                    node: node,
                    message: node.type + " must be succeeded by 1 blank line",
                    fix(fixer) {
                        // Add the correct number of line breaks at the after the node
                        return [fixer.insertTextAfter(node, getCorrectionString(spacing, 1))];
                    }
                });
            }

            if (emitted.exit) {
                return;
            }

            for (let i = 0; i < body.length-1; i++) {
                let endingLineNumber = sourceCode.getEndingLine(body [i]),
                    a, b, c;

                try {
                    a = sourceCode.getTextOnLine(endingLineNumber+1);
                    b = sourceCode.getTextOnLine(endingLineNumber+2);
                    c = sourceCode.getTextOnLine(endingLineNumber);
                } catch (e) { /* ignore */ }

                if (
                    ["FunctionDeclaration", "ConstructorDeclaration"].includes(body [i].type) &&
                    sourceCode.getLine(body [i]) !== endingLineNumber &&
                    !isCommentRegExp.test(c) &&
                    ((!noCodeRegExp.test(a)) || noCodeRegExp.test(b) || endingLineNumber === sourceCode.getLine(body [i+1]))
                ) {
                    const spacing = sourceCode.getStringBetweenNodes(body[i], body[i + 1]);
                    report(body [i], spacing);
                }
            }
        }


        let listeners = {
            Program: inspectProgram
        };

        topLevelDeclarations.forEach(function(node) {
            listeners [node] = inspectChild;
        });

        return listeners;

    }

};
