/**
 * @fileoverview Ensure that all constants (and only constants) contain only upper case letters and underscore
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that all constants (and only constants) contain only upper case letters and underscore"
        },

        schema: []

    },

    create: function(context) {

        let upperCaseRegEx = /^[A-Z][A-Z_0-9]*[A-Z0-9]$/;

        function reportNode(node) {
            context.report({
                node: node,
                message: "Constant name '" + node.name + "' doesn't follow the UPPER_CASE notation"
            });
        }

        function inspectStateVariableDeclaration(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            node.is_constant &&
			!upperCaseRegEx.test(node.name) &&
			reportNode(node);
        }

        return {
            StateVariableDeclaration: inspectStateVariableDeclaration
        };

    }

};
