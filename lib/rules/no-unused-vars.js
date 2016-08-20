/**
 * @fileoverview Flag all the variables that were declared but never used
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var allVariableDeclarations = {};

		//collect all variable declarations from VariableDeclarators and DeclarativeExpressions
		context.on ('VariableDeclarator', function (emitted) {
			var node = emitted.node;

			if (!emitted.exit) {
				allVariableDeclarations [node.id.name] = node;
			}
		});

		context.on ('DeclarativeExpression', function (emitted) {
			var node = emitted.node;

			//do not examine if the declaration is part of a Struct definition
			if (!emitted.exit && node.parent.type !== 'StructDeclaration') {
				allVariableDeclarations [node.name] = node;
			}
		});

		//While exiting Progam Node, all the vars that haven't been used still exist inside VariableDeclarations. Report them
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

		//As soon as the first use of a variable is encountered, delete that variable's node from allVariableDeclarations
		context.on ('Identifier', function (emitted) {
			if (!emitted.exit) {
				var node = emitted.node,
					sourceCode = context.getSourceCode ();

				if (
					allVariableDeclarations [node.name] &&
					sourceCode.getParent (node).type !== 'VariableDeclarator'
				) {
					delete allVariableDeclarations [node.name];
				}
			}
		});

	}

};