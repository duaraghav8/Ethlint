/**
 * @fileoverview Ensure a) A PRAGMA directive exists and b) its on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure a) A PRAGMA directive exists and b) its on top of the file"
        },

        schema: [],

        fixable: "code"

    },

    create: function(context) {

        let missingNodeOnTopErrorReported = false;

        /**
		 * This executes only when we're leaving the Program node. At that time,
		 * we check whether the "missing pragma on top" error has already been reported or not.
		 * If not, we proceed to report it here. This happens when there are no pragma statements in
		 * the entire file. If there is one (but not on top of file), it gets reported by inspectPragmaStatement().
		 * NOTE: A Pragma dir must exist at absolute top, even before pragma experimental.
		 */
        function inspectProgram(emitted) {
            let node = emitted.node, body = node.body;

            if (!emitted.exit || missingNodeOnTopErrorReported) {
                return;
            }

            (body.length > 0) && (body [0].type !== "PragmaStatement") && context.report({
                node: node,
                message: "No Pragma directive found at the top of file."
            });
        }


        function inspectPragmaStatement(emitted) {
            let node = emitted.node,
                sourceCode = context.getSourceCode(), pragmaParent = sourceCode.getParent(node);

            // If pragma statement is on top, exit now. No further checks required.
            if (emitted.exit || node.start === pragmaParent.body [0].start) {
                return;
            }

            const pragmaCode = sourceCode.getText(node);

            context.report({
                node: node,
                message: `"${pragmaCode}" should be at the top of the file.`,
                fix: function(fixer) {
                    return [fixer.remove(node),
                        fixer.insertTextBefore(pragmaParent.body [0], pragmaCode + "\n")];
                }
            });

            missingNodeOnTopErrorReported = true;
        }


        // Experimental pragmas, if they exist, must be above everything EXCEPT pragma solidity & other experimental pragmas.
        function inspectExperimentalPragmaStatement(emitted) {
            if (emitted.exit) {
                return;
            }

            const {node} = emitted,
                nodesAllowedAbove = ["ExperimentalPragmaStatement", "PragmaStatement"],
                programNode = context.getSourceCode().getParent(node);

            for (let childNode of programNode.body) {
                // If we've reached this exp. pragma while traversing body, it means its position is fine.
                if (node.start === childNode.start) {
                    return;
                }

                // The moment we find 1 node not allowed above exp. pragma, report and exit.
                // TODO: write fix() for this issue:
                //   - Remove exp. pragma from current position
                //   - Place it right before childNode.start
                if (nodesAllowedAbove.indexOf(childNode.type) < 0) {
                    return context.report({
                        node,
                        message: "Experimental Pragma must precede everything except Solidity Pragma."
                    });
                }
            }
        }

        return {
            Program: inspectProgram,
            PragmaStatement: inspectPragmaStatement,
            ExperimentalPragmaStatement: inspectExperimentalPragmaStatement
        };

    }

};
