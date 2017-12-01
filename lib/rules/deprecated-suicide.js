/**
 * @fileoverview Suggest replacing deprecated suicide for selfdestruct
 * @author Federico Bond <federicobond@gmail.com>
 */

"use strict";


function isSuicide(node) {
    return node.type === "Identifier" && node.name === "suicide";
}

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Suggest replacing deprecated 'suicide' for 'selfdestruct'"
        },

        schema: [],

        fixable: "code"

    },

    create: function(context) {
        function inspectCallExpression(emittedObject) {
            if (!emittedObject.exit) {
                return;
            }

            let callee = emittedObject.node.callee;

            if (isSuicide(callee)) {

                context.report({
                    node: emittedObject.node,
                    fix: function(fixer) {
                        return [fixer.replaceTextRange([callee.start, callee.end], "selfdestruct")];
                    },
                    message: "'suicide' is deprecated. Use 'selfdestruct' instead."
                });

            }
        }

        return {
            CallExpression: inspectCallExpression
        };
    }

};