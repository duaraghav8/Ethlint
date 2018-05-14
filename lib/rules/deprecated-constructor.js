/**
 * @fileoverview Warn against the deprecated use of contract name for constructors
 * @author Utkarsh Patil <utkarsh2305@gmail.com>
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Use 'constructor' instead of contract name, which is deprecated"
        },
        schema: [],
        fixable: "code"
    },

    create: function(context) {
        function lintConstructorName(emitted) {
            if (emitted.exit) {
                return;
            }

            const {node} = emitted, {body} = node;

            body.filter(child => {
                return ["FunctionDeclaration", "ConstructorDeclaration"].includes(child.type);
            }).forEach(funcNode => {
                if (funcNode.name !== node.name) {
                    return;
                }

                context.report({
                    node: funcNode,
                    fix: function(fixer) {
                        let startingIndex = context.getSourceCode().getColumn(funcNode) + 9; // skip "function " having 9 characters
                        return fixer.replaceTextRange([startingIndex, startingIndex + funcNode.name.length], "constructor");
                    },
                    message: "Use 'constructor' instead of deprecated contract name."
                });
            });
        }

        return {
            ContractStatement: lintConstructorName
        };
    }
};
