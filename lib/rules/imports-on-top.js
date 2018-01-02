/**
 * @fileoverview Ensure that all imports are on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

// Get platform specific newline character for applying fixes
const eol = require("os").EOL;


module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that all import statements are on top of the file"
        },

        fixable: "code",

        schema: []

    },

    create: function(context) {

        /**
         * If ImportStatement node is a direct child of Program node 'parent',
         * then it is an element of parent.body array.
         * The node should precede any other type of node in the array except for the pragma & pragma experimental directives
         * and other import statements.
         * The way the fix() algorithm currently works - it only fixes position of 1 import statement in a file in 1 iteration.
         * This may be improved in future.
         */
        function inspectImportStatement(emitted) {
            if (emitted.exit) {
                return;
            }

            const {node} = emitted,
                programNode = context.getSourceCode().getParent(node),
                indexOfNode = programNode.body.indexOf(node),
                nodesAllowedAbove = ["ExperimentalPragmaStatement", "PragmaStatement", "ImportStatement"];

            let lastValidNode = programNode.body[0]; // the first node could very well be an unacceptable one, taking care of it below

            // For every node preceding the import node check if it's one of the allowed types.
            for (let childNode of programNode.body.slice(0, indexOfNode)) {

                // The moment we find 1 node not allowed above import, report and exit.
                //   - Remove import from current position
                //   - Place it right before childNode.start
                //   - The fix will place it right after the last valid import node
                if (!nodesAllowedAbove.includes(childNode.type)) {
                    return context.report({
                        node,
                        fix(fixer) {
                            // Add the import statement after the last valid node and remove the import statement
                            const sourceCode = context.getSourceCode();
                            const importStatement = sourceCode.getText(node);
                            let suffix;

                            // If the last valid node is import, we place the current import right below it.
                            // If its a pragma directive (whether solidity or experimental), add current import after 3 EOLs
                            if (lastValidNode.type === "ImportStatement") {
                                suffix = eol;
                            } else if (nodesAllowedAbove.includes(lastValidNode.type)) {
                                // Because we've already explicitly checks for import st. above, this one basically
                                // checks for the remaining, ie, pragma directives
                                suffix = eol.repeat(3);
                            } else {
                                // If lastValidNode is not an allowed one, it means we have to insert the import ABOVE the lvn
                                return [fixer.insertTextBefore(lastValidNode, importStatement + eol), fixer.remove(node)];
                            }

                            return [fixer.insertTextAfter(lastValidNode, suffix + importStatement), fixer.remove(node)];
                        },
                        message: "Import Statement must precede everything except pragma directives."
                    });
                } else {
                    // All nodes allowed above an import statement are considered valid nodes
                    lastValidNode = childNode;
                }
            }
        }

        return {
            ImportStatement: inspectImportStatement
        };

    }

};
