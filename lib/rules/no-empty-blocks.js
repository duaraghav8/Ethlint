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

    create: function(context) {

        function report(node, loc) {
            context.report({
                node, message: "Code contains empty block", location: loc });
        }

        let similarNodeTypes = ["ContractStatement", "LibraryStatement", "InterfaceStatement"];

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
            const { node } = emitted, { body } = node;

            // Allow Function & Constructor declarations to have empty bodies.
            if (
                emitted.exit ||
                ["FunctionDeclaration", "ConstructorDeclaration"].includes(context.getSourceCode().getParent(node).type)
            ) {
                return;
            }

            if (body && body.constructor.name === "Array" && !body.length) {
                report(node);
            }
        }


        let response = {
            BlockStatement: inspectBlockStatement
        };

        similarNodeTypes.forEach(function(nodeName) {
            response [nodeName] = inspectCLI;
        });

        return response;

    }

};
