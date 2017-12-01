/**
 * @fileoverview Ensure that no empty blocks {} exist
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that no empty blocks {} exist"
        },

        schema: []

    },

    create: function(context) {

        function report(node, loc) {
            context.report({
                node: node,
                message: "Use of empty block statement {}",
                location: loc
            });
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
            let node = emitted.node;

            /**
			 * Allow Function declarations to have empty bodies.
			 * Fallback functions - supported in Solidity v4 and above.
			 */
            if (emitted.exit || context.getSourceCode().getParent(node).type === "FunctionDeclaration") {
                return;
            }

            if (node.body && node.body.constructor.name === "Array" && !node.body.length) {
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
