/**
 * @fileoverview Ensure that all imports are on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

function getCurrentIndent (indentStyle, level) {
	return Array (level + 1).join (indentStyle);
}

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode ();
		var BASE_INDENTATION_STYLE = '    ', BASE_INDENTATION_STYLE_DESC = '4 SPACES';
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
				var prevChar = sourceCode.getPrevChar (programChild) || '\n';

				function report (messageText) {
					context.report ({
						node: programChild,
						message: (
							programChild.type.replace ('Statement', '').toLowerCase () +
							' \'' + programChild.name + '\'' +
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

			}

			node.body.forEach (inspectProgramChild);
		});

		//Ensure level 1 indentation before all immediate children of top-level declarations
		topLevelDeclarations.forEach (function (event) {

			context.on (event, function (emitted) {
				var body = emitted.node.body || [],
					levelOneIndentRegExp = new RegExp ('^\\n' + BASE_INDENTATION_STYLE + '$'),
					endingLineRegExp = new RegExp ('^' + BASE_INDENTATION_STYLE + '\\S$');

				if (emitted.exit) {
					return;
				}

				function inspectChild (child) {
					var prevChars = sourceCode.getPrevChars (child, BASE_INDENTATION_STYLE.length + 1),
						endingLineNum = sourceCode.getEndingLine (child);

					//if the start of node doesn't follow correct indentation
					if (!levelOneIndentRegExp.test (prevChars)) {
						context.report ({
							node: child,
							message: 'Incorrect indentation: Make sure you use ' + BASE_INDENTATION_STYLE_DESC + ' per level.'
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
							message: 'Incorrect indentation: Make sure you use ' + BASE_INDENTATION_STYLE_DESC + ' per level.'
						});
					}
				}

				body.forEach (inspectChild);
			});

		});

		/*************
		//Ensure 1 extra indentation inside Block than before it
		context.on ('BlockStatement', function (emitted) {

		});
		**************/

	}

};