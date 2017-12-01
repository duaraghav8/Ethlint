/**
 * @fileoverview Ensure that names 'l', 'O' & 'I' are not used for variables
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that names \"l\", \"O\" & \"I\" are not used for variables"
        },

        schema: [{
            type: "array",
            items: { type: "string", minLength: 1 },
            minItems: 1
        }]

    },

    create: function(context) {

        let disallowedNames = context.options ? context.options [0] : ["l", "O", "I"];

        function inspectVariableDeclarator(emitted) {
            let node = emitted.node, variableName = node.id.name;

            if (emitted.exit) {
                return;
            }

            disallowedNames.forEach(function(disallowedName) {
                if (variableName === disallowedName) {
                    context.report({
                        node: node,
                        message: "Using \"" + variableName + "\" for a variable name should be avoided."
                    });
                }
            });
        }

        function inspectDeclarativeExpression(emitted) {
            let node = emitted.node, variableName = node.name;

            if (emitted.exit) {
                return;
            }

            disallowedNames.forEach(function(disallowedName) {
                if (variableName === disallowedName) {
                    context.report({
                        node: node,
                        message: "Using '" + variableName + "' for a variable name should be avoided."
                    });
                }
            });
        }

        // Aliased because both the inspect functions access the same property "name" of the node passed to them.
        // So no need for 2 separate functions for now (will create separate when different attrs are accessed in future)
        let inspectStateVariableDeclaration = inspectDeclarativeExpression;

        return {
            VariableDeclarator: inspectVariableDeclarator,
            DeclarativeExpression: inspectDeclarativeExpression,
            StateVariableDeclaration: inspectStateVariableDeclaration
        };

    }

};
