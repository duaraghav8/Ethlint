/**
 * @fileoverview Ensure that variable, function, parameter and declerative expression names follow mixedCase notation
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var mixedCaseRegEx = /^_?[a-z][a-zA-Z0-9]*_?$/;
		var similarNodes = [
			'FunctionDeclaration',
			'ModifierDeclaration'
		];

		function report (node, name) {
			context.report ({
				node: node,
				message: '\'' + name + '\' doesn\'t follow the mixedCase notation'
			});
		}

		similarNodes.forEach (function (event) {
			context.on (event, function (emitted) {
				var node = emitted.node;

				/**
				 * If node's parent is contract / library and node is either a modifier (which means Inheritance), do not apply mixedcase
				 */
				if (
					emitted.exit ||
					(
						(node.parent.type === 'ContractStatement' || node.parent.type === 'LibraryStatement') &&
						(node.type === 'FunctionDeclaration' && node.parent.name === node.name)
					)
				) {
					return;
				}

				if (!mixedCaseRegEx.test (node.name)) {
					report (node, node.name);
				}
			});
		});

		context.on ('VariableDeclarator', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (!mixedCaseRegEx.test (node.id.name)) {
				context.report ({
					node: node,
					message: 'Identifier name \'' + node.id.name + '\' doesn\'t follow the mixedCase notation'
				});
			}
		});

		context.on ('DeclarativeExpression', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (!node.is_constant && !mixedCaseRegEx.test (node.name)) {
				report (node, node.name);
			}
		});

		context.on ('InformalParameter', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (!mixedCaseRegEx.test (node.id)) {
				report (node, node.id);
			}
		});
		
	}

};