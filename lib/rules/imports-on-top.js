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

        let lastValidNode = null;
        let combinedImportFix = false;

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

            for (let childNode of programNode.body) {
                // If we've reached this import while traversing body, it means its position is fine.
                if (node.start === childNode.start) {
                    // Save this node as the last valid import node (used for the rule's fix() method)
                    lastValidNode = node;
                    return;
                }

                // The moment we find 1 node not allowed above import, report and exit.
                //   - Remove import from current position
                //   - Place it right before childNode.start
                //   - The fix will place it right after the last valid import node
                if (nodesAllowedAbove.indexOf(childNode.type) < 0) {
                    return context.report({
                        node,
                        fix(fixer) {
                            const sourceCode = context.getSourceCode();

                            // The first invalid import statement's fix will involve:
                            //   - combining all of the following import statements in the file into one block of text
                            //   - Inserting all those statements after the last valid import node, or two lines after the pragma
                            //   - Removing the import node
                            // All future import statements' fixes will involve just simply removing the node
                            if (!combinedImportFix) {
                                combinedImportFix = true;

                                // Create a list of the text of the current import and all following import statements
                                const importNodeText = [];
                                for (let childNode of programNode.body.slice(indexOfNode)) {
                                    if (childNode.type === "ImportStatement") {
                                        importNodeText.push(sourceCode.getText(childNode));
                                    }
                                }

                                let suffix = eol;
                                const importStatements = importNodeText.join(eol);

                                if (!lastValidNode && programNode.body[0].type === "PragmaStatement") {
                                    // Insert after the "pragma solidity ^..." statement with an extra line break
                                    lastValidNode = programNode.body[0];
                                    suffix += eol + eol;
                                }

                                if (!lastValidNode) {
                                    // Insert at the beginning of the file and remove the node
                                    return [fixer.insertTextAt(0, suffix + importStatements), fixer.remove(node)];
                                }

                                // Insert all the import statements after the last valid node
                                return [
                                    fixer.insertTextAfter(lastValidNode, suffix + importStatements),
                                    fixer.remove(node)
                                ];
                            } else {
                                // Just remove the node
                                return [fixer.remove(node)];
                            }

                        },
                        message: "Import Statement must precede everything except pragma directives."
                    });
                }
            }
        }

        return {
            ImportStatement: inspectImportStatement
        };

    }

};
