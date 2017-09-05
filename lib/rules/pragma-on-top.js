/**
 * @fileoverview Ensure a) A PRAGMA directive exists and b) its on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	meta: {

		docs: {
			recommended: true,
			type: 'warning',
			description: 'Ensure a) A PRAGMA directive exists and b) its on top of the file'
		},

		schema: [],

		fixable: 'code'

	},

	create: function (context) {

		var missinNodeOnTopErrorReported = false;

		/**
		 * This executes only when we're leaving the Program node. At that time,
		 * we check whether the "missing pragma on top" error has already been reported or not.
		 * If not, we proceed to report it here. This happens when there are no pragma statements in
		 * the entire file. If there is one (but not on top of file), it gets reported by inspectPragmaStatement().
		 */
		function inspectProgram (emitted) {
			var node = emitted.node, body = node.body;

			if (!emitted.exit || missinNodeOnTopErrorReported) {
				return;
			}

			(body.length > 0) && (body [0].type !== 'PragmaStatement') && context.report ({
				node: node,
				message: 'No PRAGMA directive \"pragma solidity <VERSION>\" found at the top of file.'
			});
		}


		function inspectPragmaStatement (emitted) {
			var node = emitted.node,
				sourceCode = context.getSourceCode (), pragmaParent = sourceCode.getParent (node), error;

			if (emitted.exit) {
				return;
			}

			var pragmaCode = sourceCode.getText (node);

			/**
			 * Raise error if Pragma statement is not a direct child of the program
			 * i.e., if a pragma directive is found inside another node (like BlockStatement, etc.)
			 */
			if (pragmaParent.type !== 'Program') {
				error = {
					node: node,
					message: 'Pragma Directive "' + pragmaCode + '" cannot be inside ' + pragmaParent.type
				};

				return context.report (error);
			}

			//Raise error if this pragma dir is not at top of file
			if (node.start !== pragmaParent.body [0].start) {
				error = {
					node: node,
					message: 'Pragma Directive "' + pragmaCode + '" should only be at the top of the file.',
					fix: function (fixer) {
						return [fixer.remove (node),
							fixer.insertTextBefore (pragmaParent.body [0], pragmaCode + '\n')];
					}
				};

				missinNodeOnTopErrorReported = true;
				return context.report (error);
			}
		}

		return {
			Program: inspectProgram,
			PragmaStatement: inspectPragmaStatement
		};

	}

};
