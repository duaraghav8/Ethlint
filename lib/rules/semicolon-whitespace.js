/**
 * @fileoverview Ensure that there is no whitespace or comments before semicolons
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

        var sourceCode = context.getSourceCode ();
 
        context.on ('ExpressionStatement', function (emitted) {
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
		});


		context.on ('UsingStatement', function (emitted) {
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
		});

        context.on ('VariableDeclaration', function (emitted) {
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
        });
        
		//If we're dealing with abstract function declaration, we need to ensure no whitespce or comments before semicolon
		context.on ('FunctionDeclaration', function (emitted) {
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
		});

		context.on ('ImportStatement', function (emitted) {
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
		});
    }
}