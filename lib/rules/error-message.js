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

        schema: []

    },

    create: function(context) {

        function inspectCallExpression(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            let name = node.callee.name,
                callArgs = node.arguments;

            if (name === "revert" && callArgs.length < 1) {
                context.report({
                    node: node,
                    message: "Provide an error message for 'revert'."
                });
            }

            if (name === "require" && callArgs.length < 2) {
                context.report({
                    node: node,
                    message: "Provide an error message for 'require'."
                });
            }
        }

        return {
            CallExpression: inspectCallExpression
        };

    }

};
