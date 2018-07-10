//@flow
/**
 * @fileoverview Ensure that constructors are not declared using the deprecated style
 * @author Daniel McLellan <daniel.mclellan@gmail.com>
 */

"use strict";

module.exports = {

    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that constructors are not declared using the deprecated style"
        },
        schema: [{
            type: "object"
        }],
        fixable: "code"
    },

    create(context) {
        function inspectContractFunctionDeclarations(emitted) {
            if (emitted.exit) {
                return;
            }

            const { node } = emitted, { body } = node;

            body.filter(child => {
                return ["FunctionDeclaration", "ConstructorDeclaration"].includes(child.type);
            }).forEach(funcNode => {
                if (funcNode.name !== node.name) {
                    return;
                }

                const issue = {
                    node: funcNode,
                    fix(fixer) {
                        let startingIndex = context.getSourceCode().getColumn(funcNode);
                        return fixer.replaceTextRange([startingIndex, startingIndex + funcNode.name.length], "constructor() public");
                    },
                    message: "Use constructor() to declare a contract constructor"
                };

                context.report(issue);
            });
        }
        return {
            ContractStatement: inspectContractFunctionDeclarations
        };
    }
};
