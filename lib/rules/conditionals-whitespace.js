/**
 * @fileoverview Ensure that there is exactly one space between conditional operators and parenthetic blocks
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that there is exactly one space between conditional operators and parenthetic blocks"
        },

        schema: []

    },

    create: function(context) {

        let sourceCode = context.getSourceCode();

        function inspectIfStatement(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            /**
			 * Ensure a single space between 'if' token and the opening parenthesis 'if (...)'
			 */
            let ifTokenLength = "if".length,
                nodeCode = sourceCode.getText(node).slice(ifTokenLength, ifTokenLength + 2);

            (nodeCode !== " (") && context.report({
                node: node,
                location: {
                    column: sourceCode.getColumn(node) + ifTokenLength
                },
                message: "There should be exactly a single space between the 'if' token and the parenthetic block representing the conditional."
            });
        }


        function inspectWhileStatement(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            /**
			 * Ensure a single space between 'while' token and the opening parenthesis 'while (...)'
			 */
            let whileTokenLength = "while".length,
                nodeCode = sourceCode.getText(node).slice(whileTokenLength, whileTokenLength + 2);

            (nodeCode !== " (") && context.report({
                node: node,
                location: {
                    column: sourceCode.getColumn(node) + whileTokenLength
                },
                message: "There should be exactly a single space between the 'while' token and the parenthetic block representing the conditional."
            });
        }


        function inspectForStatement(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            /**
			 * Ensure a single space between 'for' token and the opening parenthesis 'for (...)'
			 */
            let forTokenLength = "for".length,
                nodeCode = sourceCode.getText(node).slice(forTokenLength, forTokenLength + 2);

            (nodeCode !== " (") && context.report({
                node: node,
                location: {
                    column: sourceCode.getColumn(node) + forTokenLength
                },
                message: "There should be exactly a single space between the 'for' token and the parenthetic block representing the conditional."
            });
        }

        return {
            IfStatement: inspectIfStatement,
            WhileStatement: inspectWhileStatement,
            ForStatement: inspectForStatement
        };

    }
};
