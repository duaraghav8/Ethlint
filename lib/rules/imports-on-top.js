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
         */
        function inspectImportStatement(emitted) {
            if (emitted.exit) {
                return;
            }

            const {node} = emitted,
                programNode = context.getSourceCode().getParent(node),
                indexOfNode = programNode.body.indexOf(node),
                nodesAllowedAbove = ["ExperimentalPragmaStatement", "PragmaStatement", "ImportStatement"];

            let lastValidNode = programNode.body[0];

            // For every node preceding the import node.
            for (let childNode of programNode.body.slice(0, indexOfNode)) {

                // The moment we find 1 node not allowed above import, report and exit.
                //   - Remove import from current position
                //   - Place it right before childNode.start
                //   - The fix will place it right after the last valid import node
                if (nodesAllowedAbove.indexOf(childNode.type) < 0) {
                    return context.report({
                        node,
                        fix(fixer) {
                            // Add the import statement after the last valid node and remove the import statement
                            const sourceCode = context.getSourceCode();
                            const importStatement = sourceCode.getText(node);
                            const suffix = lastValidNode.type === "PragmaStatement" ? eol.repeat(3) : eol;

                            return [fixer.insertTextAfter(lastValidNode, suffix + importStatement), fixer.remove(node)];
                        },
                        message: "Import Statement must precede everything except pragma directives."
                    });
                } else if (childNode.type === "ImportStatement") {
                    lastValidNode = childNode;
                }
            }
        }

        return {
            ImportStatement: inspectImportStatement
        };

    }

};
