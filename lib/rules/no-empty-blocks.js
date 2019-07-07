/**
 * @fileoverview Ensure that no empty blocks exist
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that no empty blocks exist"
        },

        schema: []

    },

    create(context) {

        function report(node, loc) {
            context.report({
                node, message: "Code contains empty block", location: loc });
        }

        function isFunc(node) {
            return node.type === "FunctionDeclaration";
        }

        function isConstructor(node) {
            return node.type === "ConstructorDeclaration";
        }

        function isFuncOrConstructor(node) {
            return isFunc(node) || isConstructor(node);
        }

        function isFallbackFunc(node) {
            return isFunc(node) && node.name === null;
        }

        function isPayable(funcNode) {
            for (let m of (funcNode.modifiers || [])) {
                if (m.name === "payable") { return true; }
            }
            return false;
        }

        function isPayableFuncOrCons(node) {
            return isFuncOrConstructor(node) && isPayable(node);
        }

        function inspectCLI(emitted) {
            let node = emitted.node,
                sourceCode = context.getSourceCode(), text = sourceCode.getText(node);

            if (emitted.exit) {
                return;
            }

            if (!node.body.length) {
                report(node, { column: text.indexOf("{") });
            }
        }

        function inspectBlockStatement(emitted) {
            const { node } = emitted, { body } = node,
                parent = context.getSourceCode().getParent(node);

            if (emitted.exit || isFallbackFunc(parent) || isPayableFuncOrCons(parent)) {
                return;
            }

            if (Array.isArray(body) && body.length === 0) {
                if (isConstructor(parent)) {
                    // If an empty block is a constructor func's body, then it shouldn't
                    // be reported if the constructor is calling a base constructor.
                    // The cons. must have a modifier with a name that is also present
                    // in its enclosing contract's inheritance declaration. Eg-
                    //
                    // contract Foo is Bar {
                    //   constructor() Bar("hello") {}
                    // }
                    //
                    // See issue #264
                    //
                    // Since we can't fetch enclosing contract from the BlockStatement
                    // node or its parent (due to current limitations), we use a
                    // workaround to not report such a constructor.
                    constructorsToCheckForBaseCall.push(parent.start);
                    return;
                }

                report(node);
            }
        }

        function inspectConstructorDeclaration(emitted) {
            const { node } = emitted;

            if (!emitted.exit) {
                // Because parent of a node is not accessible during exit phase,
                // cache the parents of all constructors during entry so they
                // can be used during exit.
                enclosingContractsOfConstructors[node.start] = context.getSourceCode().getParent(node);
                return;
            }

            // No need to check the constructor currently being exited if it
            // isn't even flagged for empty block.
            if (!constructorsToCheckForBaseCall.includes(node.start)) {
                return;
            }

            // Run constructor inspection while exiting nodes.
            // By this time, the constructorsToCheckForBaseCall list has been
            // populated.
            const enclosingContract = enclosingContractsOfConstructors[node.start];

            // If node.modifiers is null, it means no modifiers exist for this
            // constructor and it should therefore be reported.
            for (let i = 0; i < (node.modifiers || []).length; i++) {
                const functionModif = node.modifiers[i].name;

                for (let j = 0; j < enclosingContract.is.length; j++) {
                    // The constructor is calling a base cons, no need
                    // to report it.
                    if (enclosingContract.is[j].name === functionModif) {
                        return;
                    }
                }
            }

            report(node.body);
        }


        let constructorsToCheckForBaseCall = [], enclosingContractsOfConstructors = {};
        const similarNodeTypes = ["ContractStatement", "LibraryStatement", "InterfaceStatement"];

        const response = {
            BlockStatement: inspectBlockStatement,
            ConstructorDeclaration: inspectConstructorDeclaration
        };

        similarNodeTypes.forEach(function(nodeName) {
            response[nodeName] = inspectCLI;
        });

        return response;

    }

};
