/**
 * @fileoverview Ensure that operators are surrounded by a single space on either side
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {
		
		var sourceCode = context.getSourceCode (),
			whitespaceRegExp = / /;
		var NODES_TO_CAPTURE = [
			'AssignmentExpression',
			'BinaryExpression'
		];

		NODES_TO_CAPTURE.forEach (function (event) {

			context.on (event, function (emitted) {

				var node = emitted.node,
					sourceCodeText = sourceCode.getText (node),
					opIndex = sourceCodeText.indexOf (node.operator);

				if (emitted.exit) {
					return;
				}

				if (
					!whitespaceRegExp.test (sourceCodeText [opIndex - 1]) ||
					whitespaceRegExp.test (sourceCodeText [opIndex - 2]) ||
					!whitespaceRegExp.test (sourceCodeText [opIndex + node.operator.length]) ||
					whitespaceRegExp.test (sourceCodeText [opIndex + node.operator.length + 1])
				) {
					context.report ({
						node: node,
						message: (
							'Operator \'' +
							node.operator +
							'\' needs to be surrounded by (only) a single space on either side.'
						)
					});
				}

			});

		});

	}

};