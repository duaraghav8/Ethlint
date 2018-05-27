/**
 * @fileoverview Ensure that magic numbers are extracted to constants
 * @author Ivan Mushketyk <ivan.mushketik@gmail.com>
 */

"use strict";

const allowedMagicNumbers = [0, 1];

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that magic numbers are extracted to constants"
        },

        schema: []
    },

    create(context) {

        function inspectLiteral(emitted) {
            if (emitted.exit) {
                return;
            }

            const { node } = emitted,
                parentNode = context.getSourceCode().getParent(node);

            if (isNumber(node.value) && !isAConstantInitialization(parentNode) && !isAllowed(node.value)) {
                context.report({
                    node,
                    message: `Value '${node.value}' should be extracted to a constant`
                });
            }
        }

        function isNumber(value) {
            return typeof(value) === "number";
        }

        function isAConstantInitialization(parentNode) {
            return (parentNode.type === "StateVariableDeclaration" && parentNode.is_constant === true);
        }

        function isAllowed(value) {
            return allowedMagicNumbers.includes(value);
        }

        return {
            Literal: inspectLiteral
        };
    }
};
