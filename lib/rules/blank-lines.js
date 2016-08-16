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

		context.on ('Program', function (emitted) {

			var programBody = emitted.node.body;

			if (emitted.exit) {
				return;
			}

			for (var i = 1; i < programBody.length; i++) {
				if (
					programBody [i].type === 'ContractStatement' &&
					!isAfterThreeLinebreaks (programBody [i])
				) {
					context.report ({
						node: programBody [i],
						message: 'Declaration of Contract \'' + programBody [i].name + '\' must start after a 2-line gap'
					});
				}
			}

		});

	}

};