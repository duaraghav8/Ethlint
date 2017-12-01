/**
 * @fileoverview Ensure that variable, function, parameter and declerative expression names follow mixedCase notation
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that all variable, function and parameter names follow the mixedCase naming convention"
        },

        schema: []

    },

    create: function(context) {

        let mixedCaseRegEx = /^_?[a-z][a-zA-Z0-9]*_?$/;
        let similarNodes = [
            "FunctionDeclaration",
            "ModifierDeclaration"
        ];

        function report(node, name) {
            context.report({
                node: node,
                message: "'" + name + "' doesn't follow the mixedCase notation"
            });
        }

        function inspectFuncOrModif(emitted) {
            let node = emitted.node;

            /**
             * If node's parent is contract / library and node is either a modifier (which means Inheritance),
             * do not apply mixedcase
             */
            if (emitted.exit ||
                ((node.parent.type === "ContractStatement" || node.parent.type === "LibraryStatement") &&
                (node.type === "FunctionDeclaration" && node.parent.name === node.name))
            ) {
                return;
            }

            if (!mixedCaseRegEx.test(node.name)) {
                report(node, node.name);
            }
        }

        function inspectVariableDeclarator(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            if (!mixedCaseRegEx.test(node.id.name)) {
                context.report({
                    node: node,
                    message: "Identifier name '" + node.id.name + "' doesn't follow the mixedCase notation"
                });
            }
        }

        function inspectDeclarativeExpression(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            if (!node.is_constant && !mixedCaseRegEx.test(node.name)) {
                report(node, node.name);
            }
        }

        function inspectInformalParameter(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            /**
			 * node.is could either be an object containing "name" or null.
			 * It is null when there is no name (eg- `function foo() returns(bool) {}`)
			 * Here, bool's node will have "literal" object but "id" as null.
			 */
            if (node.id && !mixedCaseRegEx.test(node.id)) {
                report(node, node.id);
            }
        }


        let response = {
            InformalParameter: inspectInformalParameter,
            DeclarativeExpression: inspectDeclarativeExpression,
            VariableDeclarator: inspectVariableDeclarator
        };

        similarNodes.forEach(function(nodeName) {
            response [nodeName] = inspectFuncOrModif;
        });

        return response;
		
    }

};
