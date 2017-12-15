/**
 * @fileoverview Ensure function calls and declaration have (or don't have) whitespace in appropriate locations
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure function calls and declaration have (or don't have) whitespace in appropriate locations"
        },

        schema: []

    },

    create: function(context) {

        let sourceCode = context.getSourceCode();

        //If parameters are specified, ensure appropriate spacing surrounding commas
        function inspectFunctionDeclaration(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            let params = node.params;

            if (params && params.length > 1) {
                params.slice(0, -1).forEach(function(arg) {
                    sourceCode.getNextChar(arg) !== "," && context.report({
                        node: arg,
                        location: {
                            column: sourceCode.getEndingColumn(arg) + 1
                        },
                        message: node.name + " " + arg.id + "(): All arguments (except the last one) must be immediately followed by a comma."
                    });
                });
            }
        }

        // The InformalParameter nodes (params) in modifier declaration should follow the same spacing rules as function declarations
        function inspectModifierDeclaration(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            //If parameters are specified, ensure appropriate spacing surrounding commas
            let params = node.params;

            if (params && params.length > 1) {
                params.slice(0, -1).forEach(function(arg) {
                    sourceCode.getNextChar(arg) !== "," && context.report({
                        node: arg,
                        location: {
                            column: sourceCode.getEndingColumn(arg) + 1
                        },
                        message: node.name + " " + arg.id + "(): All arguments (except the last one) must be immediately followed by a comma."
                    });
                });
            }
        }

        //same could potentially be applied to FunctionDeclaration
        function inspectCallExpression(emitted) {
            let node = emitted.node,
                callArgs = node.arguments;

            if (emitted.exit) {
                return;
            }

            let nodeCode = sourceCode.getText(node);

            //for a 0-argument call, ensure that name is followed by '()'
            if (!callArgs.length) {
                for (let i = nodeCode.length; i > 0; i--) {
                    if (nodeCode [i] === ")" && nodeCode [i-1] === "(") {
                        return;
                    }
                    if (/[\s\(\)]/.test(nodeCode [i])) {
                        break;
                    }
                }

                return context.report({
                    node: node,
                    message: "\"" + nodeCode + "\": " +
					"A call without arguments should have brackets without any whitespace between them, like 'functionName ()'."
                });
            }

            let lastCallArg = callArgs.slice(-1) [0];

            //if call spans over multiple lines (due to too many arguments), below rules don't apply
            if (sourceCode.getLine(node) !== sourceCode.getEndingLine(lastCallArg)) {
                return;
            }

            let charBeforeFirstArg = sourceCode.getPrevChar(callArgs [0]),
                charAfterLastCallArg = sourceCode.getNextChar(lastCallArg);

            (callArgs [0].type !== "NameValueAssignment" && charBeforeFirstArg !== "(") && context.report({
                node: callArgs [0],
                location: {
                    column: sourceCode.getColumn(callArgs [0]) - 1
                },
                message: "'" + node.callee.name + "': The first argument must not be preceded by any whitespace or comments (only '(')."
            });

            (lastCallArg.type !== "NameValueAssignment" && charAfterLastCallArg !== ")") && context.report({
                node: callArgs [0],
                location: {
                    column: sourceCode.getEndingColumn(lastCallArg) + 1
                },
                message: "'" + node.callee.name + "': The last argument must not be succeeded by any whitespace or comments (only ')')."
            });
        }

        return {
            CallExpression: inspectCallExpression,
            ModifierDeclaration: inspectModifierDeclaration,
            FunctionDeclaration: inspectFunctionDeclaration
        };

    }

};
