/**
 * @fileoverview Ensure that error message is provided for revert and require statements
 * @author Donatas Stundys <donatas.stundys@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that error message is provided for revert and require statements"
        },

        schema: [{
            type: "object",
            properties: {
                revert: { type: "boolean" },
                require: { type: "boolean" },
                errorMessageMaxLength: { type: "integer", minimum: 1 }
            },
            additionalProperties: false
        }]

    },

    create(context) {

        function inspectCallExpression(emitted) {
            const { node } = emitted;

            if (emitted.exit) {
                return;
            }

            const { name } = node.callee, callArgs = node.arguments;
            const options = { revert: true, require: true, errorMessageMaxLength: 76 };
            let callArgsErrorMessageIndex = -1;

            if (context.options) {
                const { revert: rev, require: req, errorMessageMaxLength: max } = context.options[0];

                if (rev !== undefined) {
                    options.revert = rev;
                }
                if (req !== undefined) {
                    options.require = req;
                }
                if (max !== undefined) {
                    options.errorMessageMaxLength = max;
                }
            }

            if (options.revert && name === "revert") {
                if (callArgs.length < 1) {
                    return context.report({ node, message: "Provide an error message for revert()" });
                }
                callArgsErrorMessageIndex = 0; // Access the first call arg to get error message
            }

            if (options.require && name === "require") {
                if (callArgs.length < 2) {
                    return context.report({ node, message: "Provide an error message for require()" });
                }
                callArgsErrorMessageIndex = 1; // Access the second call arg to get error message
            }

            // If the function does contain the error message, validate it for max length
            if (callArgsErrorMessageIndex > -1) {
                const { value: errMessage } = callArgs[callArgsErrorMessageIndex];

                if (typeof errMessage === "string" && errMessage.length > options.errorMessageMaxLength) {
                    return context.report({
                        node,
                        message: `Error message exceeds max length of ${options.errorMessageMaxLength} characters`
                    });
                }
            }
        }

        return {
            CallExpression: inspectCallExpression
        };

    }

};
