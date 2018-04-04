/**
 * @fileoverview Ensure that magic numbers are extracted to constants
 * @author Ivan Mushketyk <ivan.mushketik@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that magic numbers are extracted to constants",
            replacedBy: ["quotes"]
        },

        schema: [],
        deprecated: true

    },

    create: function(context) {

        function inspectLiteral(emitted) {
            if (emitted.exit) {
                return;
            }

            let parentNode = context.getSourceCode().getParent(emitted.node);
            if (_isNumber(emitted.node.value) &&
                !_constantInitialization(parentNode) &&
                !_allowedMagicNumber(emitted.node.value)) {

                context.report({
                    node: emitted.node,
                    message: `Value '${emitted.node.value}' should be extracted to a constant`
                });
            }
        }

        function _isNumber(value) {
            return typeof(value) === "number";
        }

        function _constantInitialization(parentNode) {
            return parentNode.type === "StateVariableDeclaration" &&
                    parentNode.is_constant === true;
        }

        function _allowedMagicNumber(value) {
            return value === 0 || value === 1;
        }

        return {
            Literal: inspectLiteral
        };
    }
};
