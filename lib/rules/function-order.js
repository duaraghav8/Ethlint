/**
 * @fileoverview Ensure that functions in a contract are ordered according to their visibility
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const functionOrder = ["constructor", "fallback", "external", "public", "internal", "private"],
    errorMessage = `Functions should be in order: ${functionOrder.join(", ")}`;


function isConstructor(funcNode, contractNode) {
    // Account for both ways of defining a contract constructor
    // 1. The old way (function with same name as contract)
    // 2. New way ("constructor() {...}")
    return (funcNode.name === contractNode.name || funcNode.type === "ConstructorDeclaration");
}

function isFallback(funcNode) {
    return funcNode.name === null;
}

function findFuncPosInOrder(contractNode, funcNode) {
    if (isConstructor(funcNode, contractNode)) {
        return functionOrder.indexOf("constructor");
    }

    if (isFallback(funcNode)) {
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

function isIgnored(funcNode, contractNode, ignoreCriteria) {
    if (ignoreCriteria.constructorFunc && isConstructor(funcNode, contractNode)) {
        return true;
    }
    if (ignoreCriteria.fallbackFunc && isFallback(funcNode)) {
        return true;
    }
    if (ignoreCriteria.functions && ignoreCriteria.functions.includes(funcNode.name)) {
        return true;
    }

    for (let vis of (ignoreCriteria.visibilities || [])) {
        if (isFunctionVisibility(contractNode, funcNode, vis)) {
            return true;
        }
    }

    return false;
}



module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that functions in a contract are ordered according to their visibility"
        },

        schema: [{
            type: "object",
            properties: {
                ignore: {
                    type: "object",
                    anyOf: [
                        { required: ["constructorFunc"] },
                        { required: ["fallbackFunc"] },
                        { required: ["functions"] },
                        { required: ["visibilities"] }
                    ],
                    properties: {
                        constructorFunc: { type: "boolean" },
                        fallbackFunc: { type: "boolean" },
                        functions: {
                            type: "array",
                            items: { type: "string" }
                        },
                        visibilities: {
                            type: "array",
                            items: { type: "string" }
                        }
                    },
                    additionalProperties: false
                }
            },
            required: ["ignore"],
            additionalProperties: false
        }]

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

            const { node } = emitted, { body } = node;
            let cursor = 0;

            // Filter out non-function nodes
            body.filter(child => {
                return ["FunctionDeclaration", "ConstructorDeclaration"].includes(child.type);
            }).forEach(funcNode => {
                // Return if the function is ignored or in the correct order.
                if (
                    (context.options && isIgnored(funcNode, node, context.options[0].ignore)) ||
                    isFunctionVisibility(node, funcNode, functionOrder[cursor])
                ) {
                    return;
                }

                const funcPosInOrder = findFuncPosInOrder(node, funcNode);

                if (funcPosInOrder > cursor) {
                    cursor = funcPosInOrder;
                    return;
                }

                context.report({ node: funcNode, message: errorMessage });
            });
        }

        return {
            ContractStatement: inspectFunctionsOfContract
        };
    }

};
