/**
 * @fileoverview Specify where whitespace is suitable and where it isn't
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode ();

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

			var argsText = nodeCode.replace (new RegExp (fName + '\s*'), '')

			//if all arguments are NOT on same line as func call, return
			if ( !(sourceCode.getLine (node) === sourceCode.getEndingLine (node.arguments.slice (-1) [0])) ) {
				return;
			}

			 //if there's space after '(', report
			 if (!/\(\S/.test (argsText)) {
			 	context.report ({
			 		node: node,
			 		message: 'There should be no whitespace after opening bracket.'
			 	});
			 }

			 //if there's no space following every comma inside argsText, report
			 node.arguments.forEach (function (arg) {
			 	//console.log ('*******', arg);
			 });

		});

	}

};