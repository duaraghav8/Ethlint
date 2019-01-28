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

        function isPayableFuncOrCons(node) {
            function isPayable(n) {
                for (let m of (n.modifiers || [])) {
                    if (m.name === "payable") { return true; }
                }
                return false;
            }

            return isFuncOrConstructor(node) && isPayable(node);
        }

        const similarNodeTypes = ["ContractStatement", "LibraryStatement", "InterfaceStatement"];

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
                report(node);
            }
        }


        let response = {
            BlockStatement: inspectBlockStatement
        };

        similarNodeTypes.forEach(function(nodeName) {
            response[nodeName] = inspectCLI;
        });

        return response;

    }

};
