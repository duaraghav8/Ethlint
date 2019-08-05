/**
 * @fileoverview Ensure that operators are surrounded by a single space on either side
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that operators are surrounded by a single space on either side"
        },

        schema: [],

        fixable: "whitespace"

    },

    create: function(context) {

        let sourceCode = context.getSourceCode();

        function inspectAssignmentExpression(emitted) {
            /**
			 * node.operator is refined here by adding backslash before all the 'special' characters.
			 * 'special' chars are thos chars that are part of solidity assignment operators and, if used without backslash in JS RegExp,
			 * behave as wildcard characters. So to make sure they're treated as simple strings, we add '\' before them.
			 * As of today, these chars include: * / + | ^
			 */
            const node = emitted.node;
            const op = node.operator.replace(/([\+\*\/\|\^])/g, "\\$1");
            const opLength = node.operator.length;

            if (emitted.exit) {
                return;
            }

            // If expression is 'abc *= def;', then charsAfterLeftNode will contain ' *= d'.
            const charsAfterLeftNode = sourceCode.getNextChars(node.left, 3 + opLength);
            const validationRegexp = new RegExp("^ " + op + " [^\\s]$");

            (!validationRegexp.test(charsAfterLeftNode)) && context.report({
                node: node.left,
                message: "Assignment operator must have exactly single space on both sides of it.",
                fix(fixer) {
                    const fixed = sourceCode.getText(node).replace(/\s+/g, " ");
                    return [fixer.replaceText(node, fixed)];
                }
            });
        }

        //statement like `var x = 10` doesn't come under AssignmentExpression, so needs to be checked separately
        function inspectVariableDeclaration(emitted) {
            let node = emitted.node, code = sourceCode.getText(node);

            if (emitted.exit) {
                return;
            }

            //if a particular character is '=', check its left and right for single space
            const oneSpaceOnLeft = /^[^\/\s] $/;
            const whitespaceOnLeft = /(\s+)$/;
            const oneSpaceOnRight = /^ [^\/\s]$/;
            const whitespaceOnRight = /^(\s+)/;

            for (let i = 2; i < code.length; i++) {
                if (code [i] === "=") {
                    if (!oneSpaceOnLeft.test(code.slice(i - 2, i))) {
                        context.report({
                            node: node,
                            message: "There should be only a single space between assignment operator '=' and its left side.",
                            fix(fixer) {
                                const match = code.slice(0, i).match(whitespaceOnLeft);
                                if (!match) {
                                    return fixer.insertTextAt(node.start + i, " ");
                                }

                                const whitespace = match[1];
                                const start = node.start + i - whitespace.length;
                                const end = node.start + i;

                                return fixer.replaceTextRange([start, end], " ");
                            }
                        });
                    }

                    if (!oneSpaceOnRight.test(code.slice(i + 1, i + 3))) {
                        context.report({
                            node: node,
                            message: "There should be only a single space between assignment operator '=' and its right side.",
                            fix(fixer) {
                                const match = code.slice(i + 1, code.length - 1).match(whitespaceOnRight);
                                if (!match) {
                                    return fixer.insertTextAt(node.start + i + 1, " ");
                                }

                                const whitespace = match[1];
                                const start = node.start + i + 1;
                                const end = start + whitespace.length;

                                return fixer.replaceTextRange([start, end], " ");
                            }
                        });
                    }
                }
            }
        }

        function inspectBinaryExpression(emitted) {
            let leftNode,
                node = emitted.node;

            if (emitted.exit) {
                return;
            }

            /**
			 * If the left & right side of expression span over multiple lines,
			 * make sure that the operator resides on the same line as the left expression (ie, first line)
			 */
            // 1. take line no. of both left & right expr. Line no (right) = line (left) + 1
            // Take string btw them, should be NO \n before operator. that's it

            let rightNodeStartingLine = sourceCode.getLine(node.right),
                leftNodeEndingLine = sourceCode.getEndingLine(node.left),
                opRegExp = node.operator.replace(/([\+\*\/\|\^])/g, "\\$1");

            if (rightNodeStartingLine > leftNodeEndingLine) {
                let validationRegexOpOnSameLineAsLeftNodeEnd = new RegExp("^[^\\n]*" + opRegExp),
                    strBetweenLeftAndRightNode = sourceCode.getStringBetweenNodes(node.left, node.right);

                if (!validationRegexOpOnSameLineAsLeftNodeEnd.test(strBetweenLeftAndRightNode)) {
                    context.report({
                        node: node,
                        location: {
                            column: sourceCode.getEndingColumn(node.left)
                        },
                        message: "Operator \"" + node.operator + "\" should be on the line where left side of the Binary expression ends.",
                        fix(fixer) {
                            // Reduce whitespace to the left of operator to 1 space
                            // Insert a linebreak if there are no linebreaks to the right

                            const operator = sourceCode.getStringBetweenNodes(node.left, node.right);
                            const match = operator.match(/^(\s*)/);
                            if (!match) {
                                return null;
                            }
                            const whitespace = match[1];

                            const start = node.left.end;
                            const end = node.left.end + whitespace.length;

                            const fixes = [fixer.replaceTextRange([start, end], " ")];

                            const rightWhitespace = operator.slice(
                                whitespace.length + node.operator.length,
                                operator.length
                            );
                            if (!rightWhitespace.includes("\n")) {
                                const operatorEnd = end + node.operator.length;
                                fixes.push(fixer.insertTextAt(operatorEnd, "\n"));
                            }

                            return fixes;
                        }
                    });
                }

                if (rightNodeStartingLine !== leftNodeEndingLine + 1) {
                    context.report({
                        node: node,
                        location: {
                            column: sourceCode.getColumn(node.right),
                            line: sourceCode.getLine(node.right)
                        },
                        message: "In Binary Expressions that span over multiple lines, expression on the right side of the operator (" + node.operator + ") must be exactly 1 line below the line on which the left expression ends.",
                        fix(fixer) {
                            const operator = sourceCode.getStringBetweenNodes(node.left, node.right);
                            const match = operator.match(/(\s*)$/);
                            if (!match) {
                                return null;
                            }
                            const whitespace = match[1];

                            const start = node.right.start - whitespace.length;
                            const end = node.right.start;

                            return fixer.replaceTextRange([start, end], "\n");
                        }
                    });
                }

                return;
            }

            // Handle case where left node is a binary expression and right node may be a literal
            if (sourceCode.isASTNode(node.left) && node.left.type === "BinaryExpression"){
                leftNode = node.left.right;
            } else {
                leftNode = node.left;
            }

            const [leftOfOperator, rightOfOperator] = sourceCode
                .getStringBetweenNodes(leftNode, node.right)
                .split(node.operator);
            const firstCharOnLeft = leftOfOperator.slice(-1);
            const firstCharOnRight = rightOfOperator[0];

            const onlyCharsRegExp = /^[^\s\/]$/;


            if (hasWhitespace(firstCharOnLeft) || hasWhitespace(firstCharOnRight)) {
                let trimWhitespace = false;

                // Check if either of sides has no whitespace
                // and force spacing based on the left side of operator
                if (Boolean(firstCharOnLeft) !== Boolean(firstCharOnRight)) {
                    context.report({
                        node: node,
                        location: {
                            column: sourceCode.getEndingColumn(node.left) + 1
                        },
                        message: "Single space should be either on both sides of '" + node.operator + "' or not at all.",
                        fix(fixer) {
                            const left = leftOfOperator.slice(-1);
                            const endOfOperator = node.left.end + node.operator.length;

                            if (!left) {
                                trimWhitespace = true;
                                return fixer.removeRange([endOfOperator, endOfOperator+1]);
                            }

                            return fixer.insertTextAt(endOfOperator + 1, " ");
                        }
                    });
                }

                if (!trimWhitespace) {
                    const secondLastCharOnLeft = leftOfOperator.slice(-2, -1);
                    const secondCharOnRight = rightOfOperator[1];

                    const whitespaceOnLeft = secondLastCharOnLeft && !onlyCharsRegExp.test(secondLastCharOnLeft);
                    if (leftOfOperator === "\t" || whitespaceOnLeft) {
                        context.report({
                            node: node,
                            location: {
                                column: sourceCode.getEndingColumn(node.left)
                            },
                            message: "There should be a maximum of single space and no comments between left side and '" + node.operator + "'."
                        });
                    }

                    const whitespaceOnRight = secondCharOnRight && !onlyCharsRegExp.test(secondCharOnRight);
                    if (rightOfOperator === "\t" || whitespaceOnRight) {
                        context.report({
                            node: node,
                            location: {
                                column: sourceCode.getColumn(node.right)
                            },
                            message: "There should be a maximum of single space and no comments between right side and '" + node.operator + "'."
                        });
                    }
                }
            }

            // Handle comments w/o whitespace
            if (firstCharOnLeft === "/") {
                context.report({
                    node: node,
                    location: {
                        column: sourceCode.getEndingColumn(node.left)
                    },
                    message: "There should be no comments between left side and '" + node.operator + "'."
                });
            }

            if (firstCharOnRight === "/") {
                context.report({
                    node: node,
                    location: {
                        column: sourceCode.getColumn(node.right)
                    },
                    message: "There should be no comments between right side and '" + node.operator + "'."
                });
            }
        }

        return {
            BinaryExpression: inspectBinaryExpression,
            VariableDeclaration: inspectVariableDeclaration,
            AssignmentExpression: inspectAssignmentExpression
        };

    }

};

const whitespaceRegexp = /\s/;

function hasWhitespace(str) {
    return whitespaceRegexp.test(str);
}
