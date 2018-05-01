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
                require: { type: "boolean" }
            },
            required: ["revert", "require"],
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
            const options = context.options && context.options[0] || { revert: true, require: true };

            if (options.revert && name === "revert" && callArgs.length < 1) {
                return context.report({
                    node,
                    message: "Provide an error message for revert()."
                });
            }

            if (options.require && name === "require" && callArgs.length < 2) {
                context.report({
                    node,
                    message: "Provide an error message for require()."
                });
            }
        }

        return {
            CallExpression: inspectCallExpression
        };

    }

};
