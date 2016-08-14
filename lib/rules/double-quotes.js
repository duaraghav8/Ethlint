/**
 * @fileoverview Ensure that string are quoted with double-quotes only
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var doubleQuotesLiteralRegExp = /^\".*\"$/,
			sourceCode = context.getSourceCode ();

		context.on ('Literal', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (
				typeof node.value === 'string' &&
				!doubleQuotesLiteralRegExp.test (sourceCode.getText (node))
			) {
				context.report ({
					node: node,
					message: 'String Literals must be quoted with double quotes only.'
				});
			}
		});

	}

};