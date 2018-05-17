/**
 * @fileoverview Ensure no ignore return values of function
 * @author Yuichi Nukiyama
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure no ignore return values of function"
        },

        schema: []

    },

    create: function(context) {

        const sourceCode = context.getSourceCode();
        const calleeIgnoreReturnParams = [];
        const namesOfFunctionWithReturnParams = [];

        function inspectFunctionDeclaration(emitted) {
            const node = emitted.node;

            if (emitted.exit) {
                return;
            }

            if (node.returnParams !== null) {
                namesOfFunctionWithReturnParams.push(node.name);
            }
        }

        function inspectCallExpression(emitted) {
            const node = emitted.node;

            if (emitted.exit) {
                return;
            }

            // check callee without assignment
            if (sourceCode.getParent(node).type !== "AssignmentExpression") {
                calleeIgnoreReturnParams.push(node);
            }
        }

        function inspectProgram(emitted) {
            if (emitted.exit) {
                const errorNodes = calleeIgnoreReturnParams.filter(node => {
                    for (const name of namesOfFunctionWithReturnParams) {
                        if (name === node.callee.name) {
                            return true;
                        }
                    }                   

                });

                errorNodes.forEach(node => {
                    context.report({
                        node: node,
                        message: node.callee.name + "don't use return values." 
                    });
                });
            }  
        }

        return {
            CallExpression: inspectCallExpression,
            FunctionDeclaration:inspectFunctionDeclaration,
            Program: inspectProgram
        };
    }
};
