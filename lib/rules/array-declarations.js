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

			if (emitted.exit) {
				return;
			}

			if (node.array_parts.length) {
				var code = sourceCode.getText (node),
					flag = /\s/.test (
						code.slice (0, code.indexOf ('['))
					);

				flag && context.report ({
					node: node,
					message: (
						'There should be no space between literal ' +
						(typeof node.literal === 'string' ? node.literal + ' ' : '') +
						'and \'[]\''
					)
				});

				if (
					node.array_parts.length === 1 &&
					node.array_parts [0] === null &&
					/\s/.test (code.slice (code.indexOf ('[') + 1))
				) {
					context.report ({
						node: node,
						message: 'There should be no space between square brackets. Use [] instead.'
					});
				}
			}

		});

	}

};