/**
 * @fileoverview Enforce standardized indentation style
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


// This func will receive either empty str (len = 0), str with N Spaces (N >= 1) or N Tabs (N >= 1)
function getIndentDescription(indentStyle, level) {
    // If either user has specified 0 indent or we're at level 0 (start), totalIndent becomes 0.
    const totalIndent = indentStyle.length * level, s = totalIndent > 1 ? "s" : "";

    // If style is that there should be no indent for any level OR we're at base level
    if (totalIndent === 0) {
        return "0 whitespace";
    }

    if (indentStyle [0] === " ") {
        return `${totalIndent} space${s}`;
    }

    // If above 2 are bypassed, indent style must be tab(s)
    return `${totalIndent} tab${s}`;
}

function getIndentString(indentStyle, level) {
    return Array(level + 1).join(indentStyle);
}


module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure consistent indentation per level (4 spaces by default)"
        },

        schema: [{
            oneOf: [
                { type: "string", enum: ["tab"] },
                { type: "integer", minimum: 0 }
            ]
        }]

    },

    create: function(context) {

        // default configurations
        let BASE_INDENTATION_STYLE = " ".repeat(4),
            BASE_INDENTATION_STYLE_DESC = "4 spaces";

        if (context.options) {
            if (context.options [0] === "tab") {
                BASE_INDENTATION_STYLE = "\t";
                BASE_INDENTATION_STYLE_DESC = "1 tab";
            } else {
                let spCount = context.options [0];

                BASE_INDENTATION_STYLE = " ".repeat(spCount);
                BASE_INDENTATION_STYLE_DESC = spCount + " space" + (spCount === 1 ? "" : "s");
            }
        }

        let BASE_INDENTATION_STYLE_REGEXP_GLOBAL = new RegExp(BASE_INDENTATION_STYLE, "g");


        let sourceCode = context.getSourceCode();
        let topLevelDeclarations = ["ContractStatement", "LibraryStatement"];

        //Ensure NO indentation exists before top-level declarations (contract, library)
        function inspectProgram(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            function inspectProgramChild(programChild) {
                //if node's code starts at index 0, getPrevChar() returns null (meaning no errors), so change it to '\n'
                let prevChar = sourceCode.getPrevChar(programChild) || "\n",
                    childEndingLine = sourceCode.getEndingLine(programChild),
                    childEndingLineText = sourceCode.getTextOnLine(childEndingLine);

                function report(messageText) {
                    context.report({
                        node: programChild,
                        message: (
                            programChild.type.replace("Statement", "").toLowerCase() +
							( programChild.name ? (" '" + programChild.name + "'") : " statement" ) +
							": " + messageText
                        )
                    });
                }

                if (prevChar !== "\n") {
                    //either indentation exists, or some other character - both are not allowed
                    if (/\s/.test(prevChar)) {
                        report("There should be no indentation before top-level declaration.");
                    } else {
                        report("There should be no character(s) before top-level declaration.");
                    }
                }

                //if node starts and ends on different lines and its last line starts with a whitespace or multiline/natspec comment, report
                if (
                    sourceCode.getLine(programChild) !== childEndingLine &&
					/^(\s+)|(\/\*[^*\/]*\*\/)/.test(childEndingLineText)
                ) {
                    context.report({
                        node: programChild,
                        location: {
                            line: childEndingLine,
                            column: 0
                        },
                        message: "Line shouln't have any indentation or comments at the beginning."
                    });
                }

            }

            node.body.forEach(inspectProgramChild);
        }



        //Ensure level 1 indentation before all immediate children of top-level declarations
        function inspectTopLevelDeclaration(emitted) {
            let body = emitted.node.body || [],
                levelOneIndentRegExp = new RegExp("^\\n" + BASE_INDENTATION_STYLE + "$"),
                endingLineRegExp = new RegExp("^" + BASE_INDENTATION_STYLE + "(\\S| \\*)$"),	//either a non-whitespace character or 1 extra whitespace followed by * (closing of multi-line comment)
                endingLineExtraIndentRegExp = new RegExp("^" + BASE_INDENTATION_STYLE.repeat(2) + "(\\S| \\*)$");

            if (emitted.exit) {
                return;
            }

            function inspectChild(child) {
                let prevChars = sourceCode.getPrevChars(child, BASE_INDENTATION_STYLE.length+1),
                    endingLineNum = sourceCode.getEndingLine(child);

                //if the start of node doesn't follow correct indentation
                if (!levelOneIndentRegExp.test(prevChars)) {
                    context.report({
                        node: child,
                        message: `Only use indent of ${BASE_INDENTATION_STYLE_DESC}.`
                    });
                }

                // If the node starts & ends on same line, exit.
                if (sourceCode.getLine(child) === endingLineNum) {
                    return;
                }

                // If node starts & ends on diff lines, the ending line must also follow correct indentation.
                // Exception to this is an abstract function whose declaration spans over multiple lines. Eg-
                // function foo()
                //     payable
                //     returns (uint, string);

                if (child.type === "FunctionDeclaration" && child.is_abstract) {

                    if (!endingLineExtraIndentRegExp.test(
                        sourceCode.getTextOnLine(endingLineNum).slice(0, BASE_INDENTATION_STYLE.repeat(2).length+1))) {
                        context.report({
                            node: child,
                            location: {
                                line: endingLineNum,
                                column: 0
                            },
                            message: `Only use indent of ${BASE_INDENTATION_STYLE_DESC}.`
                        });
                    }

                    return;
                }

                if (!endingLineRegExp.test(
                    sourceCode.getTextOnLine(endingLineNum).slice(0, BASE_INDENTATION_STYLE.length+1))) {
                    context.report({
                        node: child,
                        location: {
                            line: endingLineNum,
                            column: 0
                        },
                        message: `Only use indent of ${BASE_INDENTATION_STYLE_DESC}.`
                    });
                }
            }

            body.forEach(inspectChild);
        }



        //Ensure 1 extra indentation inside Block than before it
        function inspectBlockStatement(emitted) {
            let node = emitted.node;

            //if the complete block resides on the same line, no need to check for indentation
            if (emitted.exit || (sourceCode.getLine(node) === sourceCode.getEndingLine(node))) {
                return;
            }

            let parent = sourceCode.getParent(node),
                parentDeclarationLine = sourceCode.getLine(parent),
                parentDeclarationLineText = sourceCode.getTextOnLine(parentDeclarationLine),
                currentIndent, currentIndentLevel;

            function inspectBlockItem(blockIndent, blockIndentDesc, blockItem) {
                let prevChars = sourceCode.getPrevChars(blockItem, blockIndent.length+1),
                    endingLineNum = sourceCode.getEndingLine(blockItem),
                    endingLineRegExp = new RegExp("^" + blockIndent + "(" + BASE_INDENTATION_STYLE + ")?\\S.*$");

                if (prevChars !== ("\n" + blockIndent)) {
                    context.report({
                        node: blockItem,
                        message: `Only use indent of ${blockIndentDesc}.`
                    });
                }

                /**
				 * If the block item spans over multiple lines, make sure the ending line also follows the indent rule
				 * An exception to this is the if-else statements when they don't have BlockStatement as their body
				 * eg-
				 * if (a)
				 *     foo();
				 * else
				 *     bar();
				 *
				 * Another exception is chaining.
				 * eg-
				 * function() {
				 *   myObject
				 *     .funcA()
				 *     .funcB()
				 *     [0];
				 * }
				 * Ending line has 1 extra indentation but this is acceptable.
				 */
                if (
                    blockItem.type !== "IfStatement" &&
					sourceCode.getLine(blockItem) !== endingLineNum &&
					!endingLineRegExp.test(sourceCode.getTextOnLine(endingLineNum))
                ) {
                    context.report({
                        node: blockItem,
                        location: {
                            line: endingLineNum,
                            column: 0
                        },
                        message: `Only use indent of ${blockIndentDesc}.`
                    });
                }
            }

            currentIndent = parentDeclarationLineText.slice(
                0,
                parentDeclarationLineText.indexOf(parentDeclarationLineText.trim())
            );

            //in case of no match, match() returns null. Return [] instead to avoid crash
            currentIndentLevel = (currentIndent.match(BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

            //ensure that there is only whitespace of correct level before the block's parent's code
            if (getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
                return;	//exit now, we can' proceed further unless this is fixed
            }

            //indentation of items inside block should be 1 level greater than that of parent
            const blockIndent = getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel + 1);
            const blockIndentDesc = getIndentDescription(BASE_INDENTATION_STYLE, currentIndentLevel + 1);

            node.body.forEach(inspectBlockItem.bind(null, blockIndent, blockIndentDesc));
        }



        function inspectStructDeclaration(emitted) {
            let node = emitted.node,
                body = node.body || [],
                endingLineNum = sourceCode.getEndingLine(node);
            let structDeclarationLineText, currentIndent, currentIndentLevel;

            function inspectStructAttr(structIndent, structIndentDesc, attr) {
                let indentRegExp = new RegExp("^" + structIndent + "[^\\s(\/\*)]"),
                    attrLineText = sourceCode.getTextOnLine(sourceCode.getLine(attr));

                //attribute declaration must be preceded by only correct level of indentation & no comments
                !indentRegExp.test(attrLineText) && context.report({
                    node: attr,
                    message: `Only use indent of ${structIndentDesc}.`
                });
            }

            // No need to lint further if entire struct declaration is on single line
            if (emitted.exit || sourceCode.getLine(node) === endingLineNum) {
                return;
            }

            structDeclarationLineText = sourceCode.getTextOnLine(sourceCode.getLine(node));

            currentIndent = structDeclarationLineText.slice(
                0,
                structDeclarationLineText.indexOf(structDeclarationLineText.trim())
            );

            currentIndentLevel = (currentIndent.match(BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

            //ensure that there is only whitespace of correct level on the line containing struct declaration
            if (getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
                return;	//exit now, we can' proceed further unless this is fixed
            }

            const structIndent = getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel + 1);
            const structIndentDesc = getIndentDescription(BASE_INDENTATION_STYLE, currentIndentLevel + 1);

            body.forEach(inspectStructAttr.bind(null, structIndent, structIndentDesc));

        }



        function inspectArrayExpression(emitted) {
            let node = emitted.node, elements = node.elements;
            let endingLineNum = sourceCode.getEndingLine(node),
                arrayExpressionLineText, currentIndent, currentIndentLevel;

            function inspectElement(arrayIndent, arrayIndentDesc, elem) {
                let indentRegExp = new RegExp("^" + arrayIndent + "[^\\s(\/\*)]"),
                    elemLineText = sourceCode.getTextOnLine(sourceCode.getLine(elem));

                //element declaration must be preceded by only correct level of indentation & no comments
                !indentRegExp.test(elemLineText) && context.report({
                    node: elem,
                    message: `Only use indent of ${arrayIndentDesc}.`
                });
            }

            // No need to lint further if entire arary declaration is on single line
            if (emitted.exit || sourceCode.getLine(node) === endingLineNum) {
                return;
            }

            arrayExpressionLineText = sourceCode.getTextOnLine(sourceCode.getLine(node));

            currentIndent = arrayExpressionLineText.slice(
                0,
                arrayExpressionLineText.indexOf(arrayExpressionLineText.trim())
            );

            currentIndentLevel = (currentIndent.match(BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

            //ensure that there is only whitespace of correct level on the line containing array expression
            if (getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
                return;	//exit now, we can' proceed further unless this is fixed
            }

            const arrayIndent = getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel + 1);
            const arrayIndentDesc = getIndentDescription(BASE_INDENTATION_STYLE, currentIndentLevel + 1);

            elements.forEach(inspectElement.bind(null, arrayIndent, arrayIndentDesc));
        }


        //function params (if on multiple lines)
        function inspectFunctionDeclaration(emitted) {
            let node = emitted.node, params = node.params || [];

            let startLine = sourceCode.getLine(node),
                lastArgLine = params.length ? sourceCode.getEndingLine(params.slice(-1) [0]) : startLine,
                functionDeclarationLineText, currentIndent, currentIndentLevel;

            function inspectParam(paramIndent, paramIndentDesc, param) {
                let indentRegExp = new RegExp("^" + paramIndent + "[^\\s(\/\*)]"),
                    paramLineText = sourceCode.getTextOnLine(sourceCode.getLine(param));

                //parameter declaration must be preceded by only correct level of indentation & no comments
                !indentRegExp.test(paramLineText) && context.report({
                    node: param,
                    message: `Only use indent of ${paramIndentDesc}.`
                });
            }

            // If declaration args start & end on same line, exit now
            if (emitted.exit || startLine === lastArgLine) {
                return;
            }

            functionDeclarationLineText = sourceCode.getTextOnLine(startLine);

            currentIndent = functionDeclarationLineText.slice(
                0,
                functionDeclarationLineText.indexOf(functionDeclarationLineText.trim())
            );

            currentIndentLevel = (currentIndent.match(BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

            //ensure that there is only whitespace of correct level on the line containing parameter
            if (getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
                return;	//exit now, we can' proceed further unless this is fixed
            }

            const paramIndent = getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel + 1);
            const paramIndentDesc = getIndentDescription(BASE_INDENTATION_STYLE, currentIndentLevel + 1);

            params.forEach(inspectParam.bind(null, paramIndent, paramIndentDesc));
        }


        function inspectCallExpression(emitted) {

            let node = emitted.node;
            let endingLineNum = sourceCode.getEndingLine(node),
                callExpressionLineText, currentIndent, currentIndentLevel;

            function inspectArgument(argIndent, argIndentDesc, argument) {
                let indentRegExp = new RegExp("^" + argIndent + "[^\\s(\/\*)]"),
                    argLineText = sourceCode.getTextOnLine(sourceCode.getLine(argument));

                //parameter declaration must be preceded by only correct level of indentation & no comments
                !indentRegExp.test(argLineText) && context.report({
                    node: argument,
                    message: `Only use indent of ${argIndentDesc}.`
                });
            }

            // Return if the call starts & ends on same line
            // Also return if the callee is NOT an identifier, else rule creates false positives
            // eg-
            // foo()
            //     .bar(10, "hello");
            //
            // baz(10, "hello");
            //
            // In first eg, rule will lint at args for indent because it thinks the call spans over multiple lines
            if (emitted.exit ||
				sourceCode.getLine(node) === endingLineNum || node.callee.type !== "Identifier") {
                return;
            }

            callExpressionLineText = sourceCode.getTextOnLine(sourceCode.getLine(node));

            currentIndent = callExpressionLineText.slice(
                0,
                callExpressionLineText.indexOf(callExpressionLineText.trim())
            );

            currentIndentLevel = (currentIndent.match(BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

            //ensure that there is only whitespace of correct level on the line containing parameter
            if (getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
                return;	//exit now, we can' proceed further unless this is fixed
            }

            const argIndent = getIndentString(BASE_INDENTATION_STYLE, currentIndentLevel + 1);
            const argIndentDesc = getIndentDescription(BASE_INDENTATION_STYLE, currentIndentLevel + 1);

            node.arguments.forEach(inspectArgument.bind(null, argIndent, argIndentDesc));

        }


        let response = {
            CallExpression: inspectCallExpression,
            FunctionDeclaration: inspectFunctionDeclaration,
            ArrayExpression: inspectArrayExpression,
            StructDeclaration: inspectStructDeclaration,
            BlockStatement: inspectBlockStatement,
            Program: inspectProgram
        };

        topLevelDeclarations.forEach(function(nodeName) {
            response [nodeName] = inspectTopLevelDeclaration;
        });

        return response;

    }

};
