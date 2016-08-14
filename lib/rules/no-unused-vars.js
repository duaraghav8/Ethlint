/**
 * @fileoverview Flag all the variables that were declared but never used
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var allVariableDeclarations = {};

		context.on ('VariableDeclarator', function (emitted) {
			var node = emitted.node;

			if (!emitted.exit) {
				allVariableDeclarations [node.id.name] = node;
			}
		});

		context.on ('DeclarativeExpression', function (emitted) {
			var node = emitted.node;

			if (!emitted.exit) {
				allVariableDeclarations [node.name] = node;
			}
		});

		context.on ('Program', function (emitted) {
			if (emitted.exit) {

				Object.keys (allVariableDeclarations).forEach (function (name) {
					context.report ({
						node: allVariableDeclarations [name],
						message: 'Variable \'' + name + '\' is declared but never used.'
					});
				});

			}
		});

		context.on ('Identifier', function (emitted) {
			if (!emitted.exit) {
				var node = emitted.node,
					sourceCode = context.getSourceCode ();

				if (sourceCode.getParent (node).type !== 'VariableDeclarator') {
					delete allVariableDeclarations [node.name];
				}
			}
		});

	}

};