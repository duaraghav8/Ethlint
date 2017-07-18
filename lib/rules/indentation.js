/**
 * @fileoverview Enforce standardized indentation style
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

function getIndentString (indentStyle, level) {
	return Array (level + 1).join (indentStyle);
}

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode ();

		var BASE_INDENTATION_STYLE = '    ',
			BASE_INDENTATION_STYLE_DESC = '4 SPACES',
			BASE_INDENTATION_STYLE_REGEXP_GLOBAL = new RegExp (BASE_INDENTATION_STYLE, 'g');

		var topLevelDeclarations = [
			'ContractStatement',
			'LibraryStatement'
		];

		//Ensure NO indentation exists before top-level declarations (contract, library)
		context.on ('Program', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			function inspectProgramChild (programChild) {
				//if node's code starts at index 0, getPrevChar() returns null (meaning no errors), so change it to '\n'
				var prevChar = sourceCode.getPrevChar (programChild) || '\n',
					childEndingLine = sourceCode.getEndingLine (programChild),
					childEndingLineText = sourceCode.getTextOnLine (childEndingLine);

				function report (messageText) {
					context.report ({
						node: programChild,
						message: (
							programChild.type.replace ('Statement', '').toLowerCase () +
							( programChild.name ? (' \'' + programChild.name + '\'') : ' statement' ) +
							': ' + messageText
						)
					});
				}

				if (prevChar !== '\n') {
					//either indentation exists, or some other character - both are not allowed
					if (/\s/.test (prevChar)) {
						report ('There should be no indentation before top-level declaration.');
					} else {
						report ('There should be no character(s) before top-level declaration.');
					}
				}

				//if node starts and ends on different lines and its last line starts with a whitespace or multiline/natspec comment, report
				if (
					sourceCode.getLine (programChild) !== childEndingLine &&
					/^(\s+)|(\/\*[^*\/]*\*\/)/.test (childEndingLineText)
				) {
					context.report ({
						node: programChild,
						location: {
							line: childEndingLine,
							column: 0
						},
						message: 'Indentation: Line should not have any indentation or comments at the beginning.'
					});
				}

			}

			node.body.forEach (inspectProgramChild);
		});



		//Ensure level 1 indentation before all immediate children of top-level declarations
		topLevelDeclarations.forEach (function (event) {

			context.on (event, function (emitted) {
				var body = emitted.node.body || [],
					levelOneIndentRegExp = new RegExp ('^\\n' + BASE_INDENTATION_STYLE + '$'),
					endingLineRegExp = new RegExp ('^' + BASE_INDENTATION_STYLE + '(\\S| *)$');	//either a non-whitespace character or 1 extra whitespace followed by * (closing of multi-line comment)

				if (emitted.exit) {
					return;
				}

				function inspectChild (child) {
					var prevChars = sourceCode.getPrevChars (child, BASE_INDENTATION_STYLE.length+1),
						endingLineNum = sourceCode.getEndingLine (child);

					//if the start of node doesn't follow correct indentation
					if (!levelOneIndentRegExp.test (prevChars)) {
						context.report ({
							node: child,
							message: 'Incorrect indentation: Make sure you use ' + BASE_INDENTATION_STYLE_DESC + ' per level and don\'t precede the code by any comments.'
						});
					}

					//if the node doesn't end on the same line as it starts and the ending line doesn't follow correct indentation
					if (
						sourceCode.getLine (child) !== endingLineNum &&
						!endingLineRegExp.test (sourceCode.getTextOnLine (endingLineNum).slice (0, 5))
					) {
						context.report ({
							node: child,
							location: {
								line: endingLineNum,
								column: 0
							},
							message: 'Incorrect indentation: Make sure you use ' + BASE_INDENTATION_STYLE_DESC + ' per level and don\'t precede the code by any comments.'
						});
					}
				}

				body.forEach (inspectChild);
			});

		});



		//Ensure 1 extra indentation inside Block than before it
		context.on ('BlockStatement', function (emitted) {
			var node = emitted.node;

			//if the complete block resides on the same line, no need to check for indentation
			if (emitted.exit || (sourceCode.getLine (node) === sourceCode.getEndingLine (node))) {
				return;
			}

			var parent = sourceCode.getParent (node),
				parentDeclarationLine = sourceCode.getLine (parent),
				parentDeclarationLineText = sourceCode.getTextOnLine (parentDeclarationLine),
				currentIndent, currentIndentLevel, blockIndent;

			function inspectBlockItem (blockIndent, blockItem) {
				var prevChars = sourceCode.getPrevChars (blockItem, blockIndent.length+1),
					endingLineNum = sourceCode.getEndingLine (blockItem),
					endingLineRegExp = new RegExp ('^' + blockIndent + '\\S.*$');

				if (prevChars !== ('\n' + blockIndent)) {
					context.report ({
						node: blockItem,
						message: 'Incorrect Indentation: make sure only \"' + blockIndent + '\" is used as indentation for this line.'
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
				 */
				if (
					blockItem.type !== 'IfStatement' &&
					sourceCode.getLine (blockItem) !== endingLineNum &&
					!endingLineRegExp.test (sourceCode.getTextOnLine (endingLineNum))
				) {
					context.report ({
						node: blockItem,
						location: {
							line: endingLineNum,
							column: 0
						},
						message: 'Incorrect Indentation: make sure only \"' + blockIndent + '\" is used as indentation for this line.'
					});
				}
			}

			currentIndent = parentDeclarationLineText.slice (
				0,
				parentDeclarationLineText.indexOf (parentDeclarationLineText.trim ())
			);

			//in case of no match, match() returns null. Return [] instead to avoid crash
			currentIndentLevel = (currentIndent.match (BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

			//ensure that there is only whitespace of correct level before the block's parent's code
			if (getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
				return;	//exit now, we can' proceed further unless this is fixed
			}

			//indentation of items inside block should be 1 level greater than that of parent
			blockIndent = getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel + 1);
			node.body.forEach (inspectBlockItem.bind (null, blockIndent));
		});



		context.on ('StructDeclaration', function (emitted) {
			var node = emitted.node,
				body = node.body || [],
				endingLineNum = sourceCode.getEndingLine (node);
			var structDeclarationLineText, currentIndent, currentIndentLevel, structIndent;
			var MAX_ATTR_IN_SINGLE_LINE = 3;

			function inspectStructAttr (structIndent, attr) {
				var indentRegExp = new RegExp ('^' + structIndent + '[^\\s(\/\*)]'),
					attrLineText = sourceCode.getTextOnLine (sourceCode.getLine (attr));

				//attribute declaration must be preceded by only correct level of indentation & no comments
				!indentRegExp.test (attrLineText) && context.report ({
					node: attr,
					message: 'Incorrect Indentation: Make sure you use exacly \"' + structIndent + '\" for indentation on this line and don\'t precede the declaration by comment(s).'
				});
			}

			if (emitted.exit) {
				return;
			}

			//raise an error and stop linting if more than 3 attributes exist & declaration is on single line
			if (sourceCode.getLine (node) === endingLineNum) {
				if (body.length > MAX_ATTR_IN_SINGLE_LINE) {
					context.report ({
						node: node,
						message: '\'' + node.name + '\': In case of more than 3 properties, struct declaration needs to be spread over multiple lines with 1 property per line.'
					});
				}
				return;
			}

			structDeclarationLineText = sourceCode.getTextOnLine (sourceCode.getLine (node));

			currentIndent = structDeclarationLineText.slice (
				0,
				structDeclarationLineText.indexOf (structDeclarationLineText.trim ())
			);

			currentIndentLevel = (currentIndent.match (BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

			//ensure that there is only whitespace of correct level on the line containing struct declaration
			if (getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
				return;	//exit now, we can' proceed further unless this is fixed
			}

			structIndent = getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel + 1);
			body.forEach (inspectStructAttr.bind (null, structIndent));

		});



		context.on ('ArrayExpression', function (emitted) {
			var node = emitted.node, elements = node.elements;
			var endingLineNum = sourceCode.getEndingLine (node),
				arrayExpressionLineText, currentIndent, currentIndentLevel, arrayIndent;
			var MAX_ELEMS_IN_SINGLE_LINE = 3;

			function inspectElement (arrayIndent, elem) {
				var indentRegExp = new RegExp ('^' + arrayIndent + '[^\\s(\/\*)]'),
					elemLineText = sourceCode.getTextOnLine (sourceCode.getLine (elem));

				//element declaration must be preceded by only correct level of indentation & no comments
				!indentRegExp.test (elemLineText) && context.report ({
					node: elem,
					message: 'Incorrect Indentation: Make sure you use exacly \"' + arrayIndent + '\" for indentation on this line and don\'t precede the declaration by comment(s).'
				});
			}

			if (emitted.exit) {
				return;
			}

			if (sourceCode.getLine (node) === endingLineNum) {
				if (elements.length > MAX_ELEMS_IN_SINGLE_LINE) {
					context.report ({
						node: node,
						message: 'In case of more than 3 elements, array expression needs to be spread over multiple lines with 1 element per line.'
					});
				}
				return;
			}

			arrayExpressionLineText = sourceCode.getTextOnLine (sourceCode.getLine (node));

			currentIndent = arrayExpressionLineText.slice (
				0,
				arrayExpressionLineText.indexOf (arrayExpressionLineText.trim ())
			);

			currentIndentLevel = (currentIndent.match (BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

			//ensure that there is only whitespace of correct level on the line containing array expression
			if (getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
				return;	//exit now, we can' proceed further unless this is fixed
			}

			arrayIndent = getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel + 1);
			elements.forEach (inspectElement.bind (null, arrayIndent));
		});


		//function params (if on multiple lines)
		context.on ('FunctionDeclaration', function (emitted) {
			var node = emitted.node, params = node.params || [];
			var MAX_PARAMS_ON_SINGLE_LINE = 3;

			var startLine = sourceCode.getLine (node),
				lastArgLine = params.length ? sourceCode.getEndingLine (params.slice (-1) [0]) : startLine,
				functionDeclarationLineText, currentIndent, currentIndentLevel, paramIndent;

			function inspectParam (paramIndent, param) {
				var indentRegExp = new RegExp ('^' + paramIndent + '[^\\s(\/\*)]'),
					paramLineText = sourceCode.getTextOnLine (sourceCode.getLine (param));

				//parameter declaration must be preceded by only correct level of indentation & no comments
				!indentRegExp.test (paramLineText) && context.report ({
					node: param,
					message: 'Incorrect Indentation: Make sure you use exacly \"' + paramIndent + '\" for indentation on this line and don\'t precede the declaration by comment(s).'
				});
			}

			if (emitted.exit) {
				return;
			}

			if (startLine === lastArgLine) {
				if (params.length > MAX_PARAMS_ON_SINGLE_LINE) {
					context.report ({
						node: node,
						message: 'Function \'' + node.name + '\': in case of more than 3 parameters, drop each into its own line.'
					});
				}
				return;
			}

			functionDeclarationLineText = sourceCode.getTextOnLine (startLine);

			currentIndent = functionDeclarationLineText.slice (
				0,
				functionDeclarationLineText.indexOf (functionDeclarationLineText.trim ())
			);

			currentIndentLevel = (currentIndent.match (BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

			//ensure that there is only whitespace of correct level on the line containing parameter
			if (getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
				return;	//exit now, we can' proceed further unless this is fixed
			}

			paramIndent = getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel + 1);

			params.forEach (inspectParam.bind (null, paramIndent));
		});


		context.on ('CallExpression', function (emitted) {

			var node = emitted.node;
			var endingLineNum = sourceCode.getEndingLine (node),
				callExpressionLineText, currentIndent, currentIndentLevel, argIndent;
			var MAX_ARGS_ON_SINGLE_LINE = 3;

			function inspectArgument (argIndent, argument) {
				var indentRegExp = new RegExp ('^' + argIndent + '[^\\s(\/\*)]'),
					argLineText = sourceCode.getTextOnLine (sourceCode.getLine (argument));

				//parameter declaration must be preceded by only correct level of indentation & no comments
				!indentRegExp.test (argLineText) && context.report ({
					node: argument,
					message: 'Incorrect Indentation: Make sure you use exacly \"' + argIndent + '\" for indentation on this line and don\'t precede the declaration by comment(s).'
				});
			}

			if (emitted.exit) {
				return;
			}

			if (sourceCode.getLine (node) === endingLineNum) {
				if (node.arguments.length > MAX_ARGS_ON_SINGLE_LINE) {
					context.report ({
						node: node,
						message: 'Function \'' + node.callee.name + '\': in case of more than 3 arguments, drop each into its own line.'
					});
				}
				return;
			}

			callExpressionLineText = sourceCode.getTextOnLine (sourceCode.getLine (node));

			currentIndent = callExpressionLineText.slice (
				0,
				callExpressionLineText.indexOf (callExpressionLineText.trim ())
			);

			currentIndentLevel = (currentIndent.match (BASE_INDENTATION_STYLE_REGEXP_GLOBAL) || []).length;

			//ensure that there is only whitespace of correct level on the line containing parameter
			if (getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel) !== currentIndent) {
				return;	//exit now, we can' proceed further unless this is fixed
			}

			argIndent = getIndentString (BASE_INDENTATION_STYLE, currentIndentLevel + 1);

			node.arguments.forEach (inspectArgument.bind (null, argIndent));

		});

	}

};
