/**
 * @fileoverview Ensure appropriate number of blank lines exist between different segments of the code.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


// TODO: generalize this method for N consec. blank lines in future
function has2ConsecutiveBlankLines(string) {
    return /\n[ \t]*\n[ \t]*\n/.test(string);
}


module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that there is exactly a 2-line gap between Contract and Funtion declarations"
        },

        schema: []

    },

    create: function(context) {

        let sourceCode = context.getSourceCode(),
            noCodeRegExp = /^[ \t]*$/,
            isCommentRegExp = /\s*(\/\/*)|(\*\\*)|(\/\**)$/;
        let topLevelDeclarations = [ "ContractStatement", "LibraryStatement" ];

        function inspectProgram(emitted) {
            if (emitted.exit) {
                return;
            }

            function report(topLevelNode) {
                const message = `${topLevelNode.type.replace("Statement", "")} '${topLevelNode.name}' `
                    + "must be preceded by 2 blank lines.";

                context.report({ node: topLevelNode, message });
            }

            const {node} = emitted, programBody = node.body;

            for (let i = 1; i < programBody.length; i++) {
                const currNode = programBody [i], prevNode = programBody [i-1];

                if (topLevelDeclarations.indexOf(currNode.type) < 0) {
                    continue;
                }

                if (!has2ConsecutiveBlankLines(sourceCode.getStringBetweenNodes(prevNode, currNode))) {
                    report(currNode);
                }
            }
        }


        function inspectChild(emitted) {
            let node = emitted.node, body = node.body || [];

            function report(node) {
                context.report({
                    node: node,
                    message: node.type + " must be succeded by 1 blank line"
                });
            }

            if (emitted.exit) {
                return;
            }

            for (let i = 0; i < body.length-1; i++) {
                let endingLineNumber = sourceCode.getEndingLine(body [i]),
                    a, b, c;

                try {
                    a = sourceCode.getTextOnLine(endingLineNumber+1);
                    b = sourceCode.getTextOnLine(endingLineNumber+2);
                    c = sourceCode.getTextOnLine(endingLineNumber);
                } catch (e) { /* ignore */ }

                if (
                    body [i].type === "FunctionDeclaration" &&
                    sourceCode.getLine(body [i]) !== endingLineNumber &&
                    !isCommentRegExp.test(c) &&
                    ((!noCodeRegExp.test(a)) || noCodeRegExp.test(b) || endingLineNumber === sourceCode.getLine(body [i+1]))
                ) {
                    report(body [i]);
                }
            }
        }


        let listeners = {
            Program: inspectProgram
        };

        topLevelDeclarations.forEach(function(node) {
            listeners [node] = inspectChild;
        });

        return listeners;

    }

};
