/**
 * @fileoverview Ensure that all imports are on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode ();

		function isAfterThreeLinebreaks (node) {
			var blankLineCounter = 3,
				whiteSpaceRegExp = /\s/;
			var currentChar = ' ', prevCharsCount = 1;

			while (blankLineCounter && whiteSpaceRegExp.test (currentChar)) {
				currentChar = sourceCode.getPrevChars (node, prevCharsCount++) [0];
				currentChar === '\n' && blankLineCounter--;
			}

			return !blankLineCounter;
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
					!isAfterThreeLinebreaks (programBody [i])
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
					body = node.body;

				//exit if body is null, i.e., empty contract/library
				if (emitted.exit || !body) {
					return;
				}

				/**
				 * Check if node is a function declaration
				 * Check if function is non-abstract, i.e., the body {...} exists
				 * Ensure that the preceding node is not a function with definition on single line 'function foo () {}'
				 * Finally, Check if current function occurs after 2 or more blank lines gap or not
				 * If not, report an error!
				 */
				for (var i = 1; i < body.length; i++) {
					if (
						body [i].type === 'FunctionDeclaration' &&
						!body [i].is_abstract &&
						!(
							body [i-1].type === 'FunctionDeclaration' &&
							sourceCode.getLine (body [i]) - sourceCode.getLine (body [i-1]) === 1
						) &&
						!isAfterThreeLinebreaks (body [i])
					) {
						context.report ({
							node: body [i],
							message: 'Declaration of Function \'' + body [i].name + '\' must start after a 2-line gap.'
						});
					}
				}

			});
		});

	}

};