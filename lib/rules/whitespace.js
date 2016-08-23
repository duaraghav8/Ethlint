/**
 * @fileoverview Specify where whitespace is suitable and where it isn't
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode ();

		context.on ('BlockStatement', function (emitted) {

			var node = emitted.node,
				blockBody = node.body;

			//Function's body is an exception to this rule
			if (emitted.exit || node.parent.type === 'FunctionDeclaration') {
				return;
			}

			//if block has only 1 item, starts & ends on same line and doesn't have 1 space before & after item, report
			if (blockBody.length === 1 && sourceCode.getLine (node) === sourceCode.getEndingLine (node)) {
				if (sourceCode.getPrevChars (blockBody [0], 2) !== '{ ') {
					context.report ({
						node: blockBody [0],
						message: blockBody [0].type + ': Item should be preceded by exactly 1 space.'
					});
				}
				if (sourceCode.getNextChars (blockBody [0], 2) !== ' }') {
					context.report ({
						node: blockBody [0],
						message: blockBody [0].type + ': Item should be followed by exactly 1 space.'
					});
				}
			}

		});

		context.on ('CallExpression', function (emitted) {
			var node = emitted.node,
				fName = node.callee.name,
				nodeCode = sourceCode.getText (node);

			if (emitted.exit) {
				return;
			}

			var callExprWithoutArgsRegExp = new RegExp ('^' + fName + ' ?\\(\\)');

			//if no arguments and call isn't like func() OR func (), report
			if (!node.arguments.length) {
				if (!callExprWithoutArgsRegExp.test (nodeCode)) {
					context.report ({
						node: node,
						message: 'There should be a maximum of one space between function name and \'()\', like: ' + fName + '();\' or \'' + fName + ' ()\'.'
					});
				}
				return;
			}

			var lastArg = node.arguments.slice (-1) [0];

			//if all arguments are NOT on same line as func call, return
			if ( !(sourceCode.getLine (node) === sourceCode.getEndingLine (lastArg)) ) {
				return;
			}

			var argsText = nodeCode.replace (new RegExp (fName + '[^\\(]*'), ''),
				argTextRegExp = /, \S/;		//argument, followed by comma, then space, then non-whitespace char

			//if there's space after '(', report
			if (!/^\(\S/.test (argsText)) {
				context.report ({
					node: node,
					message: 'There should be no whitespace after opening bracket.'
				});
			}

			/**
			 * If there's no space following every comma inside argsText, report
			 * The last arg is an exception, because there is no comma after it
			 */
			node.arguments.slice (0, -1).forEach (function (arg) {
				if ( !argTextRegExp.test (sourceCode.getNextChars (arg, 3)) ) {
					context.report ({
						node: arg,
						message: arg.type + ': There should be a space after the comma'
					});
				}
			});

			//last argument must immediately be followed by closing bracket
			if (sourceCode.getNextChar (lastArg) !== ')') {
				context.report ({
					node: lastArg,
					message: 'There should be no whitespace between the last argument and closing bracket \')\''
				});
			}

		});

	}

};