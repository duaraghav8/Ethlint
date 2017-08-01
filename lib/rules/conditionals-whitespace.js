/**
 * @fileoverview Ensure that there is exactly one space between conditional operators and parenthetic blocks
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

        var sourceCode = context.getSourceCode ();

        context.on ('IfStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			/**
			 * Ensure a single space between 'if' token and the opening parenthesis 'if (...)'
			 */
			var ifTokenLength = 'if'.length,
				nodeCode = sourceCode.getText (node).slice (ifTokenLength, ifTokenLength + 2);

			(nodeCode !== ' (') && context.report ({
				node: node,
				location: {
					column: sourceCode.getColumn (node) + ifTokenLength
				},
				message: 'There should be exactly a single space between the \'if\' token and the parenthetic block representing the conditional.'
			});
		});


		context.on ('WhileStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			/**
			 * Ensure a single space between 'while' token and the opening parenthesis 'while (...)'
			 */
			var whileTokenLength = 'while'.length,
				nodeCode = sourceCode.getText (node).slice (whileTokenLength, whileTokenLength + 2);

			(nodeCode !== ' (') && context.report ({
				node: node,
				location: {
					column: sourceCode.getColumn (node) + whileTokenLength
				},
				message: 'There should be exactly a single space between the \'while\' token and the parenthetic block representing the conditional.'
			});
		});


		context.on ('ForStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			/**
			 * Ensure a single space between 'for' token and the opening parenthesis 'for (...)'
			 */
			var forTokenLength = 'for'.length,
				nodeCode = sourceCode.getText (node).slice (forTokenLength, forTokenLength + 2);

			(nodeCode !== ' (') && context.report ({
				node: node,
				location: {
					column: sourceCode.getColumn (node) + forTokenLength
				},
				message: 'There should be exactly a single space between the \'for\' token and the parenthetic block representing the conditional.'
			});
		});
    }
}