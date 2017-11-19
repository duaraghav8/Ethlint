/**
 * @fileoverview Ensure that there is no whitespace or comments before semicolons
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	meta: {

		docs: {
			recommended: true,
			type: 'warning',
			description: 'Ensure that there is no whitespace or comments before semicolons'
		},

		schema: []

	},

	create: function (context) {

		var sourceCode = context.getSourceCode ();

		function inspectExpressionStatement (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			var code = sourceCode.getText (node);

			//ensure there's no whitespace or comments before semicolon
			(code [code.length - 1] === ';' && /(\s|\/)/.test (code [code.length - 2])) && context.report ({
				node: node,
				location: {
					column: code.length - 2
				},
				message: 'There should be no whitespace or comments before the semicolon.'
			});
		}


		function inspectUsingStatement (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			var code = sourceCode.getText (node);

			//ensure there's no whitespace or comments before semicolon
			(code [code.length - 1] === ';' && /(\s|\/)/.test (code [code.length - 2])) && context.report ({
				node: node,
				location: {
					column: code.length - 2
				},
				message: 'There should be no whitespace or comments before the semicolon.'
			});
		}

		function inspectVariableDeclaration (emitted) {
			var node = emitted.node, code = sourceCode.getText (node);

			if (emitted.exit) {
				return;
			}

			//ensure there's no whitespace or comments before semicolon
			(code [code.length - 1] === ';' && /(\s|\/)/.test (code [code.length - 2])) && context.report ({
				node: node,
				location: {
					column: code.length - 2
				},
				message: 'There should be no whitespace or comments before the semicolon.'
			});
		}

		//If we're dealing with abstract function declaration, we need to ensure no whitespce or comments before semicolon
		function inspectFunctionDeclaration (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			var code = sourceCode.getText (node);

			(node.is_abstract && code [code.length - 1] === ';' && /(\s|\/)/.test (code [code.length - 2])) &&
			context.report ({
				node: node,
				location: {
					column: code.length - 2
				},
				message: 'There should be no whitespace or comments before the semicolon.'
			});
		}

		function inspectImportStatement (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			var code = sourceCode.getText (node);

			//ensure there's no whitespace or comments before semicolon
			(code [code.length - 1] === ';' && /(\s|\/)/.test (code [code.length - 2])) && context.report ({
				node: node,
				location: {
					column: code.length - 2
				},
				message: 'There should be no whitespace or comments before the semicolon.'
			});
		}

		return {
			ImportStatement: inspectImportStatement,
			FunctionDeclaration: inspectFunctionDeclaration,
			VariableDeclaration: inspectVariableDeclaration,
			UsingStatement: inspectUsingStatement,
			ExpressionStatement: inspectExpressionStatement
		};

	}

};
