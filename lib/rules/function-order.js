/**
 * @fileoverview Ensure that functions in a contract are ordered according to their visibility
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const functionOrder = ["constructor", "fallback", "external", "public", "internal", "private"];


function findFuncPosInOrder(contractNode, funcNode) {
    if (funcNode.name === contractNode.name) {
        return functionOrder.indexOf("constructor");
    }

    if (funcNode.name === null) {
        return functionOrder.indexOf("fallback");
    }

    // Default visibility of a function is public.
    if (funcNode.modifiers === null) {
        return functionOrder.indexOf("public");
    }

    // If we bypass all above cases, below logic is guranteed to return a valid position
    const modifNames = funcNode.modifiers.map(m => { return m.name; });

    for (let mName of modifNames) {
        const i = functionOrder.indexOf(mName);

        if (i > -1) {
            return i;
        }
    }

    // If we bypass above loop, it means modifiers exist for this func,
    // but none of them was a visibility modif. This is equivalent to public vis. modif.
    return functionOrder.indexOf("public");
}

function isFunctionVisibility(contractNode, funcNode, typeDescriptor) {
    const funcPosInOrder = findFuncPosInOrder(contractNode, funcNode);
    return typeDescriptor === functionOrder[funcPosInOrder];
}



module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that functions in a contract are ordered according to their visibility"
        },

        schema: []

    },

    create(context) {
        /**
         * Set cursor to point to first visibility in order of vis. array.
         * For each function Fi inside contract, if Fi's vis is same as that pointed by cursor, ignore func.
         * If not, check the pos in the order of Fi's vis. If ahead, simply move cursor forward to Fi's vis.'s
         * position in array. If behind, report func.
         */
        function inspectFunctionsOfContract(emitted) {
            if (emitted.exit) {
                return;
            }

            const {node} = emitted, {body} = node;
            let cursor = 0;

            // Filter out non-function nodes
            body.filter(child => { return child.type === "FunctionDeclaration"; }).forEach(funcNode => {
                if (isFunctionVisibility(node, funcNode, functionOrder[cursor])) {
                    return;
                }

                const funcPosInOrder = findFuncPosInOrder(node, funcNode);

                if (funcPosInOrder > cursor) {
                    cursor = funcPosInOrder;
                    return;
                }

                // handle special case when pos = 0 (pos-1 results in undefined)
                const message = funcPosInOrder === 0 ?
                    `${functionOrder[funcPosInOrder]} function(s) should appear first.`:
                    functionOrder[funcPosInOrder] +
                    ` function(s) should appear after ${functionOrder[funcPosInOrder-1]} function(s).`;

                context.report({ node: funcNode, message });
            });
        }

        return {
            ContractStatement: inspectFunctionsOfContract
        };
    }

};
