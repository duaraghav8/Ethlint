/**
 * @fileoverview Use view over deprecated constant in function declarations
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


function create(context) {
    function reportIfConstant(emitted) {
        const { node } = emitted, enclosingFunction = context.getSourceCode().getParent(node);
 
        if (emitted.exit || node.name !== "constant" || enclosingFunction.type !== "FunctionDeclaration") {
            return;
        }

        // Only report this modifier if it is 'constant' and is being used in a function declaration.
        context.report({
            node,
            fix(fixer) {
                return fixer.replaceText(node, "view");
            },
            message: "Use 'view' instead of deprecated 'constant'."
        });
    }

    return {
        ModifierArgument: reportIfConstant
    };
}


module.exports = {

    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Use view over deprecated constant in function declarations"
        },
        schema: [],
        fixable: "code"
    },

    create

};