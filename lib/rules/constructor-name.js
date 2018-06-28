//@flow
/**
 * @fileoverview Ensure that contract constructor function does not have identical name as the contract
 * @author Daniel McLellan <daniel.mclellan@gmail.com>
 */

"use strict";

module.exports = {

    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "Ensure constructor declaration is in accordance with new style Solidity rules"
        },
        schema: [{
            type: "object"
        }],
        fixable: "code"
    },

    create(context) {
        function inspectFunctionDeclaration(emitted) {
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
                    message: (
                        "The name of your constructor function should vary from the contract name as per the new Solidity rules."
                    ),
                    fix: function(fixer) {
                        let startingIndex = context.getSourceCode().getColumn(funcNode);
                        return fixer.replaceTextRange([startingIndex, startingIndex + funcNode.name.length], "constructor() public");
                    }
                });
            });
        }
        return {
            ContractStatement: inspectFunctionDeclaration
        };
    }
};
