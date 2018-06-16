/**
 * @fileoverview In the case of 4+ elements in the same line require they are instead put on a single line each
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "In the case of 4 or more items in the same line, require they are instead put on a single line each"
        },

        schema: [{
            type: "integer", minimum: 1
        }]

    },

    create: function(context) {

        let MAX_IN_SINGLE_LINE = context.options ? context.options [0] : 3;

        let sourceCode = context.getSourceCode();

        function inspectArrayExpression(emitted) {
            let node = emitted.node, elements = node.elements;
            let endingLineNum = sourceCode.getEndingLine(node);

            if (emitted.exit) {
                return;
            }

            if (sourceCode.getLine(node) === endingLineNum) {
                if (elements.length > MAX_IN_SINGLE_LINE) {
                    context.report({
                        node: node,
                        message: "In case of more than " + MAX_IN_SINGLE_LINE +
							" elements, array expression needs to be spread over multiple lines with 1 element per line."
                    });
                }

                return;
            }
        }

        function inspectStructDeclaration(emitted) {
            let node = emitted.node,
                body = node.body || [],
                endingLineNum = sourceCode.getEndingLine(node);

            if (emitted.exit) {
                return;
            }

            //raise an error and stop linting if more than 3 attributes exist & declaration is on single line
            if (sourceCode.getLine(node) === endingLineNum) {
                if (body.length > MAX_IN_SINGLE_LINE) {
                    context.report({
                        node: node,
                        message: "\"" + node.name + "\": In case of more than " + MAX_IN_SINGLE_LINE + " properties, struct declaration needs to be spread over multiple lines with 1 property per line."
                    });
                }
                return;
            }
        }

        //function params (if on multiple lines)
        function inspectFunctionDeclaration(emitted) {
            let node = emitted.node, params = node.params || [];

            let startLine = sourceCode.getLine(node),
                lastArgLine = params.length ? sourceCode.getEndingLine(params.slice(-1) [0]) : startLine;

            if (emitted.exit) {
                return;
            }

            if (startLine === lastArgLine) {
                if (params.length > MAX_IN_SINGLE_LINE) {
                    context.report({
                        node: node,
                        message: "In case of more than " + MAX_IN_SINGLE_LINE + " parameters, drop each into its own line."
                    });
                }
                return;
            }
        }

        function inspectCallExpression(emitted) {

            let node = emitted.node;
            let endingLineNum = sourceCode.getEndingLine(node);

            if (emitted.exit) {
                return;
            }

            if (sourceCode.getLine(node) === endingLineNum) {
                if (node.arguments.length > MAX_IN_SINGLE_LINE) {
                    context.report({
                        node: node,
                        message: "Function \"" + node.callee.name + "\": in case of more than " + MAX_IN_SINGLE_LINE + " arguments, drop each into its own line."
                    });
                }
                return;
            }
        }

        return {
            CallExpression: inspectCallExpression,
            FunctionDeclaration: inspectFunctionDeclaration,
            ConstructorDeclaration: inspectFunctionDeclaration,
            StructDeclaration: inspectStructDeclaration,
            ArrayExpression: inspectArrayExpression
        };

    }
};
