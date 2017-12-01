/**
 * @fileoverview Flag all the variables that were declared but never used
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Flag all the variables that were declared but never used"
        },

        schema: []

    },

    create: function(context) {

        let allVariableDeclarations = {};

        //collect all variable declarations from VariableDeclarators and DeclarativeExpressions
        function inspectVariableDeclarator(emitted) {
            let node = emitted.node;

            if (!emitted.exit) {
                allVariableDeclarations [node.id.name] = node;
            }
        }

        function inspectDeclarativeExpression(emitted) {
            let node = emitted.node;

            //do not examine if the declaration is part of a Struct definition
            if (!emitted.exit && node.parent.type !== "StructDeclaration") {
                allVariableDeclarations [node.name] = node;
            }
        }

        //While exiting Progam Node, all the vars that haven't been used still exist inside VariableDeclarations. Report them
        function inspectProgram(emitted) {

            if (emitted.exit) {
                Object.keys(allVariableDeclarations).forEach(function(name) {
                    context.report({
                        node: allVariableDeclarations [name],
                        message: "Variable '" + name + "' is declared but never used."
                    });
                });
            }

        }

        //As soon as the first use of a variable is encountered, delete that variable's node from allVariableDeclarations
        function inspectIdentifier(emitted) {
            if (!emitted.exit) {
                let node = emitted.node,
                    sourceCode = context.getSourceCode();

                if (
                    allVariableDeclarations [node.name] &&
					sourceCode.getParent(node).type !== "VariableDeclarator"
                ) {
                    delete allVariableDeclarations [node.name];
                }
            }
        }


        return {
            Identifier: inspectIdentifier,
            Program: inspectProgram,
            DeclarativeExpression: inspectDeclarativeExpression,
            VariableDeclarator: inspectVariableDeclarator
        };

    }

};
