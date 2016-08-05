/**
 * @fileoverview Ensure that variable, function, parameter and declerative expression names follow mixedCase notation
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var mixedCaseRegEx = /^_?[a-z]+[a-zA-Z]*$/;

		function reportNode (node) {
			context.report ({
				node: node,
				message: 'Identifier name doesn\'t follow the mixedCase notation'
			});
		}

		context.on ('VariableDeclarator', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (!mixedCaseRegEx.test (node.id.name)) {
				reportNode (node);
			}
		});

		context.on ('DeclarativeExpression', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (!node.is_constant && !mixedCaseRegEx.test (node.name)) {
				reportNode (node);
			}
		});

		context.on ('FunctionDeclaration', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (!mixedCaseRegEx.test (node.name)) {
				reportNode (node);
			}
		});

		context.on ('InformalParameter', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (!mixedCaseRegEx.test (node.id)) {
				reportNode (node);
			}
		});
		
	}

};