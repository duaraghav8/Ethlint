/**
 * @fileoverview Ensure appropriate number of blank lines exist between different segments of the code.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode (),
			noCodeRegExp = /^[ \t]*$/,
			isCommentRegExp = /\s*(\/\/*)|(\*\\*)|(\/\**)$/;
		var topLevelDeclarations = [ 'ContractStatement', 'LibraryStatement' ];

		context.on ('Program', function (emitted) {
			var node = emitted.node, body = node.body;

			function report (node) {
				context.report ({
					node: node,
					message: node.type + (node.name ? (' \'' + node.name + '\'') : '') + ' must be preceded by a 2-line gap.'
				});
			}

			if (emitted.exit) {
				return;
			}

			//examine 1st to 2nd-last item of node's body to ensure that the item is succeded by 2 blank lines (not even comments are allowed)
			for (var i = 0; i < body.length-1; i++) {
				var endingLineNumber = sourceCode.getEndingLine (body [i]),
					a, b;

				//the 2 blank line rule applies only to Contract & Library Declarations
				if (topLevelDeclarations.indexOf (body [i+1].type) === -1) {
					continue;
				}

				try {
					a = sourceCode.getTextOnLine (endingLineNumber + 1);
					b = sourceCode.getTextOnLine (endingLineNumber + 2);
				} catch (e) {
					return report (body [i]);
				}

				if ( !(noCodeRegExp.test (a) && noCodeRegExp.test (b)) ) {
					report (body [i+1]);
				}
			}
		});


		function inspectChild (emitted) {
			var node = emitted.node, body = node.body || [];

			function report (node) {
				context.report ({
					node: node,
					message: node.type + ' must be succeded by 1 blank line'
				});
			}

			if (emitted.exit) {
				return;
			}

			for (var i = 0; i < body.length-1; i++) {
				var endingLineNumber = sourceCode.getEndingLine (body [i]),
					a, b, c;

				try {
					a = sourceCode.getTextOnLine (endingLineNumber+1);
					b = sourceCode.getTextOnLine (endingLineNumber+2);
					c = sourceCode.getTextOnLine (endingLineNumber);
				} catch (e) { /* ignore */ }

				if (
					body [i].type === 'FunctionDeclaration' &&
					sourceCode.getLine (body [i]) !== endingLineNumber &&
					!isCommentRegExp.test(c) &&
					(
						(!noCodeRegExp.test (a)) || noCodeRegExp.test (b) || endingLineNumber === sourceCode.getLine (body [i+1])
					)
				) {
					report (body [i]);
				}
			}
		}

		topLevelDeclarations.forEach (function (event) {
			context.on (event, inspectChild)
		});

	}

};
