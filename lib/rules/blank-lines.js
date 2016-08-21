/**
 * @fileoverview Ensure that all imports are on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode (),
			noCodeRegExp = /^[ \t]*$/;
		var topLevelDeclarations = [ 'ContractStatement', 'LibraryStatement' ];

		context.on ('Program', function (emitted) {
			var node = emitted.node, body = node.body;

			function report (node) {
				context.report ({
					node: node,
					message: (
						'Declaration of ' + node.type.replace ('Statement', ' ') + 
						(node.name ? ('\'' +	node.name + '\'') : 'Statement') + 
						' must be succeeded by a 2-line gap.'
					)
				});
			}

			if (emitted.exit) {
				return;
			}

			//examine 1st to 2nd-last item of node's body to ensure that the item is succeeded by 2 blank lines (not even comments are allowed)
			for (var i = 0; i < body.length-1; i++) {
				var endingLineNumber = sourceCode.getEndingLine (body [i]),
					a, b;

				try {
					a = sourceCode.getTextOnLine (endingLineNumber + 1);
					b = sourceCode.getTextOnLine (endingLineNumber + 2);
				} catch (e) {
					return report (body [i]);
				}

				if ( !(noCodeRegExp.test (a) && noCodeRegExp.test (b)) ) {
					report (body [i]);
				}
			}
		});


		function inspectChild (emitted) {
			var node = emitted.node, body = node.body || [];

			function report (node) {
				context.report ({
					node: node,
					message: node.type + ' must be succeeded by a blank line'
				});
			}

			if (emitted.exit) {
				return;
			}

			for (var i = 0; i < body.length-1; i++) {
				var endingLineNumber = sourceCode.getEndingLine (body [i]),
					a, b;

				try {
					a = sourceCode.getTextOnLine (endingLineNumber+1);
					b = sourceCode.getTextOnLine (endingLineNumber+2);
				} catch (e) {}

				if (
					body [i].type === 'FunctionDeclaration' &&
					sourceCode.getLine (body [i]) !== endingLineNumber &&
					(!noCodeRegExp.test (a)) || noCodeRegExp.test (b)
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