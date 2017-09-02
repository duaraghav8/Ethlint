/**
 * @fileoverview Ensure that there is no whitespace or comments between comma delimited elements and commas
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	meta: {

		docs: {
			recommended: true,
			type: 'error',
			description: 'Ensure that there is no whitespace or comments between comma delimited elements and commas'
		},

		schema: []

	},

	create: function (context) {

		var sourceCode = context.getSourceCode ();

		function inspectObjectExpression (emitted) {
			var node = emitted.node, properties = node.properties;

			function inspectObjectPropForWhitespace (prop) {
				var charAfterProp = sourceCode.getNextChar (prop);

				(charAfterProp !== ',') && context.report ({
					node: prop,
					location: {
						column: sourceCode.getEndingColumn (prop) + 1
					},
					message: 'There should be no whitespace or comments between object property and the comma following it.'
				});
			}

			if (emitted.exit) {
				return;
			}

			//CHECK FOR COMMA WHITESPACE
			properties.slice (0, -1).forEach (inspectObjectPropForWhitespace);
		}


		function inspectCallExpression (emitted) {
			var node = emitted.node,
				callArgs = node.arguments;

			function inspectCallArgForCommaWhitespace (arg) {
				var charAfterArg = sourceCode.getNextChar (arg);

				(charAfterArg !== ',') && context.report ({
					node: arg,
					location: {
						column: sourceCode.getEndingColumn (arg) + 1
					},
					message: 'There should be no whitespace or comments between argument and the comma following it.'
				});
			}

			if (emitted.exit) {
				return;
			}

			//CHECKING FOR COMMA WHITESPACE
			callArgs.slice (0, -1).forEach (inspectCallArgForCommaWhitespace);
		}


		function inspectArrayExpression (emitted) {
			var node = emitted.node;

			function inspectArrayElementForCommaWhitespace (elem) {
				var charAfterElem = sourceCode.getNextChar (elem);

				(charAfterElem !== ',') && context.report ({
					node: elem,
					location: {
						column: sourceCode.getEndingColumn (elem) + 1
					},
					message: 'There should be no whitespace or comments between Array element and the comma following it.'
				});
			}

			if (emitted.exit) {
				return;
			}

			//need to test comma from starting to second last elem, since there's no comma after last element
			node.elements.slice (0, -1).forEach (inspectArrayElementForCommaWhitespace);
		}


		function inspectSequenceExpression (emitted) {
			var node = emitted.node, expressions = node.expressions || [];

			function inspectExprForWhitespace (expr) {
				var charAfterExpr = sourceCode.getNextChar (expr);

				(charAfterExpr !== ',') && context.report ({
					node: expr,
					location: {
						column: sourceCode.getEndingColumn (expr) + 1
					},
					message: 'There should be no whitespace or comments between Tuple\'s element and the comma following it.'
				});
			}

			if (emitted.exit) {
				return;
			}

			expressions.slice (0, -1).forEach (inspectExprForWhitespace);
		}


		function inspectVariableDeclarationTuple (emitted) {
			var node = emitted.node, declarations = node.declarations;

			function inspectVariableDeclaratorForWhitespace (vd) {
				var charAfterExpr = sourceCode.getNextChar (vd);

				(charAfterExpr !== ',') && context.report ({
					node: vd,
					location: {
						column: sourceCode.getEndingColumn (vd) + 1
					},
					message: '\'' + vd.id.name + '\': identifier should be immediately followed by a comma without any whitespace in between.'
				});
			}

			if (emitted.exit) {
				return;
			}

			declarations.slice (0, -1).forEach (inspectVariableDeclaratorForWhitespace);
		}


		return {
			VariableDeclarationTuple: inspectVariableDeclarationTuple,
			SequenceExpression: inspectSequenceExpression,
			ArrayExpression: inspectArrayExpression,
			CallExpression: inspectCallExpression,
			ObjectExpression: inspectObjectExpression
		};
	}
};
