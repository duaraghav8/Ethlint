/**
 * @fileoverview Ensure correct positioning of the opening brace '{'
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure correct positioning of the opening brace '{'"
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

            //rules for consequents of if/else if/else				
            let ifConsequentType = node.consequent.type,
                nodeStartingLine = sourceCode.getLine(node);
            let consequentStartingLine = sourceCode.getLine(node.consequent),
                consequentEndingLine = sourceCode.getEndingLine(node.consequent);

            if (ifConsequentType === "EmptyStatement") {

                context.report({
                    node: node.consequent,
                    message: "Clause is followed by an empty statement."
                });

            } else if (ifConsequentType === "BlockStatement") {

                //if the complete test lies on the same line as the 'if' token but the brace doesn't, report
                if (nodeStartingLine === sourceCode.getEndingLine(node.test)) {
                    if (sourceCode.getLine(node.consequent) !== nodeStartingLine) {

                        context.report({
                            node: node.consequent,
                            message: "Opening brace must be on the same line as the 'if' token."
                        });

                    } else {

                        //if the brace IS on the same line, ensure that only a single space exists between it and test
                        (!/^[^\s\/] $/.test(sourceCode.getPrevChars(node.consequent, 2))) && context.report({
                            node: node.consequent,
                            message: "Only use single space between condition and opening brace."
                        });

                    }
                }

            } else {
                /**
				 * If consequent is a single item:
				 *     1. It should be on the line immediately after the test
				 *     2. It should completely reside on a single line
				 */
                if (consequentStartingLine !== sourceCode.getEndingLine(node.test) + 1) {
                    context.report({
                        node: node.consequent,
                        message: "Consequent should exist exactly on the line after condition."
                    });
                } else if (consequentEndingLine !== consequentStartingLine) {
                    context.report({
                        node: node.consequent,
                        message: "Consequent must reside on a single line only."
                    });
                }
            }

            let alternate = node.alternate;

            if (!alternate) {
                return;
            }

            let alternateLine = sourceCode.getLine(alternate);

            /**
			 * If consequent is a BlockStatement, then alternate & 'else' must begin on the same line as ending brace of consequent
			 * Otherwise, 'else' must exist on the line immediately after the finishing line of the consequent
			 */
            if (ifConsequentType === "BlockStatement") {
                if (
                    (alternate.type === "BlockStatement" || alternate.type === "IfStatement") &&
					alternateLine !== consequentEndingLine
                ) {
                    return context.report({
                        node: alternate,
                        message: "Alternate 'else' must begin on the same line as if's closing brace."
                    });
                }
            } else {
                let nextLineText;

                try {
                    nextLineText = sourceCode.getTextOnLine(consequentEndingLine + 1);
                } catch (e) {
                    //if next line doesn't exist, i.e., consequentEndingLine is the last line in the program
                    nextLineText = "";
                }

                //ensure that consequent is followed by 'else' token on the next line
                if (!/^\s*else/.test(nextLineText)) {
                    return context.report({
                        node: node.consequent,
                        location: {
                            line: consequentEndingLine
                        },
                        message: "'else' clause should start on the line after if consequent."
                    });
                }
            }

            //if alternate is another 'if' statement (,i.e., else if (..) {..}), below rules don't apply
            if (alternate.type === "IfStatement") {
                return;
            }

            if (alternate.type === "EmptyStatement") {
                return context.report({
                    node: alternate,
                    message: "'else' is followed by an empty statement."
                });
            }

            if (alternate.type === "BlockStatement") {
                if (!/^[^\s\/] $/.test(sourceCode.getPrevChars(alternate, 2))) {

                    //if the brace IS on the same line, ensure that only a single space exists between it and test
                    context.report({
                        node: alternate,
                        message: "Only use single space between 'else' and opening brace."
                    });

                }

                return;
            }

            //ensure that 'else' token is followed by statement on the next line (when statement is neither EmptyStatement nor inside a block)
            if (sourceCode.getLine(alternate) !== consequentEndingLine + 2) {
                return context.report({
                    node: alternate,
                    message: "Alternate clause should exist on line after 'else'."
                });
            }

            //if alternate is a single statement (not inside block), it must completely reside on a single line
            (sourceCode.getLine(alternate) !== sourceCode.getEndingLine(alternate)) && context.report({
                node: alternate,
                message: "Entire statement must reside on a single line."
            });
        }


        function inspectForStatement(emitted) {
            let node = emitted.node,
                lastNodeOnStartingLine = node.update || node.test || node.init;
            let startingLine = sourceCode.getLine(node);

            if (emitted.exit) {
                return;
            }

            /**
			 * If no BlockStatement found, report. Otherwise:
			 * Check the last non-null node amongst 'init', 'test' and 'update'
			 * If such a node doesn't exist and '{' is on diff line, report.
			 * If such a node exists and it exists on the same line as 'for' and '{' is on diff line, report
			 */
            if (node.body.type !== "BlockStatement") {
                return context.report({
                    node: node,
                    message: "Expected '{' after for statement."
                });
            }

            if (
                (
                    !lastNodeOnStartingLine ||
					startingLine === sourceCode.getEndingLine(lastNodeOnStartingLine)
                ) &&
				startingLine !== sourceCode.getLine(node.body)
            ) {
                return context.report({
                    node: node.body,
                    message: "Opening brace must be on the same line as the for statement."
                });
            }

            if (!/^[^\s\/] $/.test(sourceCode.getPrevChars(node.body, 2))) {
                context.report({
                    node: node.body,
                    message: "Only use single space between for statement & opening brace."
                });
            }
        }


        function inspectWhileStatement(emitted) {
            let node = emitted.node,
                startingLine = sourceCode.getLine(node);

            if (emitted.exit) {
                return;
            }

            /**
             * If no BlockStatement found, report. Otherwise:
             * If 'while' and node.test exist on same line and '{' is on diff line, report
             */
            if (node.body.type !== "BlockStatement") {
                return context.report({
                    node: node,
                    message: "Expected '{' after while statement."
                });
            }

            if (
                startingLine === sourceCode.getEndingLine(node.test) &&
				startingLine !== sourceCode.getLine(node.body)
            ) {
                return context.report({
                    node: node.body,
                    message: "Opening brace must be on the same line as the while statement."
                });
            }

            if (!/^[^\s\/] $/.test(sourceCode.getPrevChars(node.body, 2))) {
                context.report({
                    node: node.body,
                    message: "Only use single space between while declaration & opening brace."
                });
            }
        }


        function inspectDoWhileStatement(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            /**
			 * If no BlockStatement found, report. Otherwise:
			 * If 'while' and node.test exist on same line and '{' is on diff line, report
			 */
            if (node.body.type !== "BlockStatement") {
                return context.report({
                    node: node,
                    message: "Expected '{' after do token."
                });
            }

            if (!/^[^\s\/] $/.test(sourceCode.getPrevChars(node.body, 2))) {
                context.report({
                    node: node.body,
                    message: "Only use single space between 'do' & opening brace."
                });
            }
        }


        function inspectStructDeclaration(emitted) {
            let node = emitted.node,
                code = sourceCode.getText(node).replace("struct " + node.name, "");

            if (emitted.exit) {
                return;
            }

            (code.slice(0, 2) !== " {") && context.report({
                node: node,
                message: `'${node.name}': Declaration & opening brace must be separated by single space only.`
            });
        }


        function inspectContractStatement(emitted) {
            let node = emitted.node,
                code = sourceCode.getTextOnLine(sourceCode.getLine(node));

            if (emitted.exit) {
                return;
            }

            (!/[^\s\/] {/.test(code)) && context.report({
                node: node,
                message: `'${node.name}': Declaration & opening brace must be separated by single space only.`
            });
        }


        function inspectLibraryStatement(emitted) {
            let node = emitted.node,
                code = sourceCode.getTextOnLine(sourceCode.getLine(node));

            if (emitted.exit) {
                return;
            }

            (!/[^\s\/] {/.test(code)) && context.report({
                node: node,
                message: `'${node.name}': Declaration & opening brace must be separated by single space only.`
            });
        }


        function inspectFunctionDeclaration(emitted) {
            let node = emitted.node;

            if (emitted.exit || node.is_abstract) {
                return;
            }

            /**
             * If entire (non-abstract) function's signature is on single line, then the opening brace of its body must be on the same line too.
             * If signature is on multiple lines:
             *     If sign contains only params (each on its own line), then brace must be on the same line as last param's ending line
             *     If sign contains modifiers (each on its own line), then brace must be on the line immediately after ending line of last modifier
             */
            let declarationEndingLine,
                declarationStartingLine = sourceCode.getLine(node),
                bodyStartingLine = sourceCode.getLine(node.body);

            //If the node just before function's body is on the start line itself, then the opening brace must too be on the start line
            if (node.returnParams !== null) {
                declarationEndingLine = sourceCode.getEndingLine(node.returnParams);
            } else if (node.modifiers !== null) {
                //if modifiers is non-null (,i.e., array), compare bodyStartingLine with ending line of the last modifier declaration (last array element)
                declarationEndingLine = sourceCode.getEndingLine(node.modifiers.slice(-1) [0]);
            } else if (node.params !== null) {
                //if params is non-null (,i.e., array), compare bodyStartingLine with ending line of the last param declaration (last array element)
                declarationEndingLine = sourceCode.getEndingLine(node.params.slice(-1) [0]);
            } else {
                //if none of the above is present, then opening brace must surely begin on the same line
                declarationEndingLine = sourceCode.getLine(node);
            }

            let charsBeforeLBrace = sourceCode.getPrevChars(node.body, 2);

            if (declarationEndingLine === declarationStartingLine) {
				
                if (bodyStartingLine !== declarationEndingLine) {
                    context.report({
                        node: node.body,
                        message: "Opening brace must be on the same line as function's declaration."
                    });
                } else {
                    (!/[^\s\/] /.test(charsBeforeLBrace)) && context.report({
                        node: node.body,
                        message: "Opening brace must be preceded by single space only."
                    });
                }

                return;

            }

            if (node.returnParams) {
                if (sourceCode.getLine(node.body) !== (sourceCode.getEndingLine(node.returnParams) + 1)) {
                    context.report({
                        node: node.body,
                        message: "Opening brace must be on the line after returns declaration."
                    });
                }

                return;
            }

            if (node.modifiers) {
                const lbraceLine = sourceCode.getLine(node.body),
                    lastModifEndLine = sourceCode.getEndingLine(node.modifiers.slice(-1) [0]);

                if (lbraceLine !== lastModifEndLine+1) {
                    context.report({
                        node: node.body,
                        message: "Opening brace must be on the line after last modifier."
                    });
                }

                return;
            }

            (!/[^\s\/] /.test(charsBeforeLBrace)) && context.report({
                node: node.body,
                message: "Opening brace must be preceded by only a single space."
            });
        }


        return {
            FunctionDeclaration: inspectFunctionDeclaration,
            LibraryStatement: inspectLibraryStatement,
            ContractStatement: inspectContractStatement,
            StructDeclaration: inspectStructDeclaration,
            DoWhileStatement: inspectDoWhileStatement,
            WhileStatement: inspectWhileStatement,
            ForStatement: inspectForStatement,
            IfStatement: inspectIfStatement
        };
		
    }

};
