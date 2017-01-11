/**
 * @fileoverview Ensure a) A PRAGMA directive exists and b) its on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		context.on ('Program', function (emitted) {
			var node = emitted.node, body = node.body;

			if (emitted.exit) {
				return;
			}

			(body.length > 0) && (body [0].type !== 'PragmaStatement') && context.report ({
				node: node,
				message: 'No PRAGMA directive \"pragma solidity <VERSION>\" found at the top of file.'
			});
		});


		context.on ('PragmaStatement', function (emitted) {
			var node = emitted.node,
				sourceCode = context.getSourceCode (),
				pragmaParent = sourceCode.getParent (node),
				error;

			if (emitted.exit) {
				return;
			}

			/**
			 * Raise error if Pragma statement is not a direct child of the program
			 * i.e., if a pragma directive is found inside another node (like BlockStatement, etc.)
			 */
			if (pragmaParent.type !== 'Program') {
				error = {
					node: node,
					message: 'Pragma Directive \"' + sourceCode.getText (node) +
						'\" cannot be inside ' + pragmaParent.type
				};

				return context.report (error);
			}

			//Raise error if this pragma dir is not at top of file
			if (node.start !== pragmaParent.body [0].start) {
				error = {
					node: node,
					message: 'Pragma Directive \"' + sourceCode.getText (node) +
						'\" should only be at the top of the file.'
				};

				return context.report (error);
			}
		});

	}

};
