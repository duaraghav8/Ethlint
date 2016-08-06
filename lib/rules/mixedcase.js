/**
 * @fileoverview Ensure that variable, function, parameter and declerative expression names follow mixedCase notation
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var mixedCaseRegEx = /^_?[a-z]+[a-zA-Z]*$/;

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
				context.report ({
					node: node,
					message: '\'' + node.name + '\' doesn\'t follow the mixedCase notation'
				});
			}
		});

		context.on ('FunctionDeclaration', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (!mixedCaseRegEx.test (node.name)) {
				context.report ({
					node: node,
					message: '\'' + node.name + '\' doesn\'t follow the mixedCase notation'
				});
			}
		});

		context.on ('InformalParameter', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (!mixedCaseRegEx.test (node.id)) {
				context.report ({
					node: node,
					message: '\'' + node.id + '\' doesn\'t follow the mixedCase notation'
				});
			}
		});
		
	}

};