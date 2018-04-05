/**
 * @fileoverview Ensure "msg.value" is only used in functions with the "payable" modifier
 * @author Ivan Mushketyk <ivan.mushketik@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure 'msg.value' is only used in functions with the 'payable' modifier"
        },

        schema: []
    },

    create(context) {

        let currentFunctionDeclaration = null;

        function inspectFunctionDeclaration(emitted) {
            if (emitted.exit) {
                currentFunctionDeclaration = null;
                return;
            }

            currentFunctionDeclaration = emitted.node;

        }

        function inspectMemberExpression(emitted) {
            if (emitted.exit) {
                return;
            }

            const { node } = emitted;

            if (_isMsgValueAccess(node) && _isInFunction() && !_isInPayableFunction()) {
                context.report({
                    node: emitted.node,
                    message: "Function must be declared payable if using 'msg.value'"
                });
            }
        }

        function _isMsgValueAccess(node) {
            return node.object.name === "msg" && node.property.name === "value";
        }

        function _isInFunction() {
            return currentFunctionDeclaration !== null;
        }

        function _isInPayableFunction() {
            let modifiers = currentFunctionDeclaration.modifiers;
            for (let i in modifiers) {
                if (modifiers[i].name === "payable") {
                    return true;
                }
            }

            return false;
        }

        return {
            FunctionDeclaration: inspectFunctionDeclaration,
            MemberExpression: inspectMemberExpression
        };

    }

};