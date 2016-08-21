/**
 * @fileoverview Ensure that all imports are on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	/******************verify: function (context) {

		var sourceCode = context.getSourceCode ();

		function isAfterThreeLinebreaks (prevNode, currentNode) {
			return /\n\s*\n\s*\n\s*$/.test (
				sourceCode.getStringBetweenNodes (prevNode, currentNode)
			);
		}

		//Analyze the Program body to ensure all Contract declarations are 2 blank lines apart
		context.on ('Program', function (emitted) {

			var programBody = emitted.node.body;

			if (emitted.exit) {
				return;
			}

			for (var i = 1; i < programBody.length; i++) {
				if (
					(programBody [i].type === 'ContractStatement' || programBody [i].type === 'LibraryStatement') &&
					!isAfterThreeLinebreaks (programBody [i-1], programBody [i])
				) {
					context.report ({
						node: programBody [i],
						message: (
							'Declaration of ' +
							programBody [i].type.replace ('Statement', '') + ' \'' +
							programBody [i].name + '\' must start after a 2-line gap.'
						)
					});
				}
			}

		});

		//Ensure that the functions inside Contracts & Libraries are also 2 blank lines apart
		var similarNodes = [ 'ContractStatement', 'LibraryStatement' ];

		similarNodes.forEach (function (event) {
			context.on (event, function (emitted) {

				var node = emitted.node,
					body = node.body || [];

				if (emitted.exit) {
					return;
				}

				/**
				 * Check if node is a function declaration
				 * Check if function is non-abstract, i.e., the body {...} exists
				 * Ensure that the preceding node is not a function with definition on single line 'function foo () {}'
				 * Finally, Check if current function occurs after 2 or more blank lines gap or not
				 * If not, report an error!
				 *********
				for (var i = 1; i < body.length; i++) {
					if (
						body [i].type === 'FunctionDeclaration' &&
						!body [i].is_abstract &&
						!(
							body [i-1].type === 'FunctionDeclaration' &&
							sourceCode.getLine (body [i]) - sourceCode.getLine (body [i-1]) === 1
						) &&
						!isAfterThreeLinebreaks (body [i-1], body [i])
					) {
						context.report ({
							node: body [i],
							message: 'Declaration of Function \'' + body [i].name + '\' must start after a 2-line gap.'
						});
					}
				}

			});
		});

	}***************************/

	verify: function (context) {

		var sourceCode = context.getSourceCode ();
		var similarNodes = [ 'ContractStatement', 'LibraryStatement' ];

		context.on ('Program', function (emitted) {
			var node = emitted.node,
				body = node.body || [],
				noCodeRegExp = /^[ \t]*$/;

			function report (node) {
				context.report ({
					node: node,
					message: (
						'Declaration of ' +
						node.type.replace ('Statement', ' ') + 
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
					console.log ('**' + a + '**' + b + '**');
				} catch (e) {
					return report (body [i]);
				}

				if ( !(noCodeRegExp.test (a) && noCodeRegExp.test (b)) ) {
					report (body [i]);
				}
			}
		});

		function inspectTopLevelDec (item) {}
		similarNodes.forEach (inspectTopLevelDec);

	}

};