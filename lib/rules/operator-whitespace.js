/**
 * @fileoverview Ensure that operators are surrounded by a single space on either side
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode ();

		context.on ('BinaryExpression', function (emitted) {
			var leftNode,
			    node = emitted.node;

			if (emitted.exit) {
				return;
			}

			// Handle case where left node is a binary expression and right node may be a literal
			if (sourceCode.isASTNode(node.left) && node.left.type === 'BinaryExpression'){
				leftNode = node.left.right;
			} else {
				leftNode = node.left;
			}

			var strBetweenLeftAndRight = sourceCode.getStringBetweenNodes (leftNode, node.right).split (node.operator),
				onlyCharsRegExp = /^[^\s\/]$/;

			if (strBetweenLeftAndRight [0].slice (-1) === ' ' || strBetweenLeftAndRight [1] [0] === ' ') {
				if (strBetweenLeftAndRight [0].slice (-1) !== strBetweenLeftAndRight [1] [0]) {
					context.report ({
						node: node,
						location: {
							column: sourceCode.getEndingColumn (node.left) + 1
						},
						message: 'Single space should be either on both sides of \'' + node.operator + '\' or not at all.'
					});
				} else {
					var secondLastCharOnLeft = strBetweenLeftAndRight [0].slice (-2, -1),
						secondCharOnRight = strBetweenLeftAndRight [1] [1];

					secondLastCharOnLeft && (!onlyCharsRegExp.test (secondLastCharOnLeft)) && context.report ({
						node: node,
						location: {
							column: sourceCode.getEndingColumn (node.left)
						},
						message: 'There should be a maximum of single space and no comments between left side and \'' + node.operator + '\'.'
					});

					secondCharOnRight && (!onlyCharsRegExp.test (secondCharOnRight)) && context.report ({
						node: node,
						location: {
							column: sourceCode.getColumn (node.right)
						},
						message: 'There should be a maximum of single space and no comments between right side and \'' + node.operator + '\'.'
					});
				}

				return;
			}

			var firstCharOnLeft = strBetweenLeftAndRight [0].slice (-1),
				firstCharOnRight = strBetweenLeftAndRight [1] [0];

			firstCharOnLeft && (!onlyCharsRegExp.test (firstCharOnLeft)) && context.report ({
				node: node,
				location: {
					column: sourceCode.getEndingColumn (node.left)
				},
				message: 'There should be no comments between left side and \'' + node.operator + '\'.'
			});

			firstCharOnRight && (!onlyCharsRegExp.test (firstCharOnRight)) && context.report ({
				node: node,
				location: {
					column: sourceCode.getColumn (node.right)
				},
				message: 'There should be no comments between right side and \'' + node.operator + '\'.'
			});

		});
	
	}

};