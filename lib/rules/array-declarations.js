/**
 * @fileoverview Ensure that array declarations don't have space between the type and brackets (i.e. uint[] x, not uint [] x; or uint[ ] x;)
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode ();

		context.on ('Type', function (emitted) {
			var node = emitted.node;

			if (emitted.exit || !node.array_parts.length) {
				return;
			}

			var code = sourceCode.getText (node),
				isSpaceBetweenLiteralAndBracket = !/\w/.test ( code.slice (code.indexOf ('[')-1, code.indexOf ('[')) );

			isSpaceBetweenLiteralAndBracket && context.report ({
				node: node,
				message: (
					'There should be no whitespace between literal ' +
					(typeof node.literal === 'string' ? node.literal + ' ' : '') +
					'and \'[]\''
				)
			});

			if (
				node.array_parts.length === 1 &&
				node.array_parts [0] === null &&
				code.slice (code.indexOf ('[')) !== '[]'
			) {
				context.report ({
					node: node,
					message: 'There should be no whitespace between square brackets. Use [] instead.'
				});
			}
		});

	}

};