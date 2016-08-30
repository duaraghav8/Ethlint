/**
 * @fileoverview Ensure that strings are quoted with double-quotes only
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

/**
 * Determine whether the provided literal is in Hex Notation
 * @param {String} literal The literal to test for Hex Notation
 * @returns {Boolean}
 */
function isHex (literal) {
	var reg = /^[0-9a-f]+$/i;

	//test for '0x' separately because hex notation should not be a part of the standard RegExp
	if (literal.slice (0, 2) !== '0x') {
		return false;
	}

	return reg.test (literal.slice (2));
}

module.exports = {

	verify: function (context) {

		var doubleQuotesLiteralRegExp = /^\".*\"$/,
			sourceCode = context.getSourceCode ();

		function inspectLiteral (emitted) {
			var node = emitted.node, nodeText = sourceCode.getText (node);

			if (emitted.exit ||
				typeof node.value !== 'string' ||
				(nodeText [0] !== '\'' && nodeText [0] !== '\"' && isHex (node.value))
			) {
				return;
			}

			if (!doubleQuotesLiteralRegExp.test (nodeText)) {
				context.report ({
					node: node,
					message: '\'' + node.value + '\': String Literals must be quoted with \"double quotes\" only.'
				});
			}
		}

		context.on ('Literal', inspectLiteral);

	}

};