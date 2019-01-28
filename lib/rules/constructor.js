/**
 * @fileoverview Warn against the deprecated use of contract name for constructors
 * @author Utkarsh Patil <utkarsh2305@gmail.com>, Daniel McLellan <daniel.mclellan@gmail.com>
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Use 'constructor' instead of function with contract name for constructor declaration"
        },
        schema: [],
        fixable: "code"
    },

    create(context) {
        function lintConstructorName(emitted) {
            if (emitted.exit) {
                return;
            }

            const { node } = emitted, { body } = node;

            body.filter(child => {
                return child.type === "FunctionDeclaration";
            }).forEach(funcNode => {
                if (funcNode.name !== node.name) {
                    return;
                }

                const errorObject = {
                    node: funcNode,
                    fix(fixer) {
                        let fixed = context.getSourceCode().getText(funcNode).replace("function", "");
                        fixed = "constructor" + fixed.substring(fixed.indexOf(funcNode.name) + funcNode.name.length);
                        return fixer.replaceText(funcNode, fixed);
                    },
                    message: "Constructor declaration style is deprecated"
                };

                context.report(errorObject);
            });
        }

        return {
            ContractStatement: lintConstructorName
        };
    }
};
