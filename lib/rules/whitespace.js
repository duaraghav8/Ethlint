/**
 * @fileoverview Specify where whitespace is suitable and where it isn't
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode ();

		//same could potentially be applied to FunctionDeclaration
		context.on ('CallExpression', function (emitted) {
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

			var nodeCode = sourceCode.getText (node);

			//for a 0-argument call, ensure that name is followed by '()'
			if (!callArgs.length) {
				var codeWithoutArgs = nodeCode.replace (node.callee.name, '').trim ();

				(!/^\(\)/.test (codeWithoutArgs)) && context.report ({
					node: node,
					message: '\"' + nodeCode + '\": ' +
					'A call without arguments should have brackets without any whitespace between them, like \'functionName ()\'.'
				});

				return;
			}

			//CHECKING FOR COMMA WHITESPACE
			callArgs.slice (0, -1).forEach (inspectCallArgForCommaWhitespace);

			var lastCallArg = callArgs.slice (-1) [0];

			//if call spans over multiple lines (due to too many arguments), below rules don't apply
			if (sourceCode.getLine (node) !== sourceCode.getEndingLine (lastCallArg)) {
				return;
			}

			var charBeforeFirstArg = sourceCode.getPrevChar (callArgs [0]),
				charAfterLastCallArg = sourceCode.getNextChar (lastCallArg);

			(charBeforeFirstArg !== '(') && context.report ({
				node: callArgs [0],
				location: {
					column: sourceCode.getColumn (callArgs [0]) - 1
				},
				message: '\'' + node.callee.name + '\': The first argument must not be preceeded by any whitespace or comments (only \'(\').'
			});

			(charAfterLastCallArg !== ')') && context.report ({
				node: callArgs [0],
				location: {
					column: sourceCode.getEndingColumn (lastCallArg) + 1
				},
				message: '\'' + node.callee.name + '\': The last argument must not be succeeded by any whitespace or comments (only \')\').'
			});
		});


		context.on ('MemberExpression', function (emitted) {
			var node = emitted.node,
				property = node.property;

			/**
			 * If expression spans over multiple lines, below rule doesn't apply
			 * eg- myArray [
			 *         fooBar ()
			 *             .getIndex ()
			 *             .toBase10 ()
			 * 	   ];
			 */
			if (emitted.exit || (sourceCode.getLine (node) !== sourceCode.getEndingLine (property)) || !node.computed) {
				return;
			}

			var charBeforeProperty = sourceCode.getPrevChar (property),
				charAfterProperty = sourceCode.getNextChar (property);

			(charBeforeProperty !== '[') && context.report ({
				node: property,
				location: {
					column: sourceCode.getColumn (property) - 1
				},
				message: 'There should be no whitespace or comments between \'[\' and property.'
			});

			(charAfterProperty !== ']') && context.report ({
				node: property,
				location: {
					column: sourceCode.getEndingColumn (property) + 1
				},
				message: 'There should be no whitespace or comments between property and \']\'.'
			});
		});


		context.on ('BlockStatement', function (emitted) {
			var node = emitted.node, blockBody = node.body,
				lastBlockItem = blockBody.slice (-1) [0];	//if block is empty, this becomes undefined

			//if block spans over multiple lines or is child of a function declaration, below rules don't apply
			if (emitted.exit ||
				(lastBlockItem && sourceCode.getLine (node) !== sourceCode.getEndingLine (lastBlockItem)) ||
				node.parent.type === 'FunctionDeclaration'
			) {
				return;
			}

			//for a 0-item block, ensure that block node's code is simply '{}'
			if (!blockBody.length) {
				var nodeCode = sourceCode.getText (node);

				(nodeCode !== '{}') && context.report ({
					node: node,
					message: 'An empty block shouldn\'t have any whitespace or comments between the braces, i.e., \'{}\'.'
				});

				return;
			}

			var charBeforeFirstItem = sourceCode.getPrevChar (blockBody [0]),
				charAfterLastItem = sourceCode.getNextChar (lastBlockItem);

			(charBeforeFirstItem !== '{') && context.report ({
				node: blockBody [0],
				location: {
					column: sourceCode.getColumn (blockBody [0]) - 1
				},
				message: 'There should be no whitespace or comments between the opening brace \'{\' and first item.'
			});

			(charAfterLastItem !== '}') && context.report ({
				node: lastBlockItem,
				location: {
					column: sourceCode.getEndingColumn (lastBlockItem) + 1
				},
				message: 'There should be no whitespace or comments between the last item and closing brace \'}\'.'
			});
		});


		context.on ('ObjectExpression', function (emitted) {
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

			//for a 0-property object, ensure that ObjectExpression node's code is simply '{}'
			if (!properties.length) {
				var nodeCode = sourceCode.getText (node);

				(nodeCode !== '{}') && context.report ({
					node: node,
					message: 'An empty Object Expression shouldn\'t have any whitespace or comments between the braces, i.e., \'{}\'.'
				});

				return;
			}

			//CHECK FOR COMMA WHITESPACE
			properties.slice (0, -1).forEach (inspectObjectPropForWhitespace);

			var lastProperty = lastProperty = properties.slice (-1) [0];

			//if whole ObjectExpression spans over multiple lines, then below checks don't apply to it
			if (sourceCode.getLine (node) !== sourceCode.getEndingLine (lastProperty)) {
				return;
			}

			var charBeforeFirstProp = sourceCode.getPrevChar (properties [0]),
				charAfterLastProp = sourceCode.getNextChar (lastProperty);

			(charBeforeFirstProp !== '{') && context.report ({
				node: properties [0],
				location: {
					column: sourceCode.getColumn (properties [0]) - 1
				},
				message: 'There should be no whitespace or comments between the opening brace \'{\' and first property.'
			});

			(charAfterLastProp !== '}') && context.report ({
				node: lastProperty,
				location: {
					column: sourceCode.getEndingColumn (lastProperty) + 1
				},
				message: 'There should be no whitespace or comments between the last property and closing brace \'}\'.'
			});
		});


		context.on ('AssignmentExpression', function (emitted) {
			var node = emitted.node, op = node.operator;

			if (emitted.exit) {
				return;
			}

			var charsAfterLeftNode = sourceCode.getNextChars (node.left, 1 + op.length),
				charsBeforeRightNode = sourceCode.getPrevChars (node.right, 1 + op.length);

			(charsAfterLeftNode !== ' ' + op) && context.report ({
				node: node.left,
				message: '\'' + op + '\' must be preceeded by exactly a single space.'
			});

			(charsBeforeRightNode !== op + ' ') && context.report ({
				node: node.right,
				message: '\'' + op + '\' must be succeeded by exactly a single space.'
			});
		});

		//statement like `var x = 10` doesn't come under AssignmentExpression, so needs to be checked separately
		context.on ('VariableDeclaration', function (emitted) {
			var node = emitted.node, code = sourceCode.getText (node);

			if (emitted.exit) {
				return;
			}

			//if a particular character is '=', check its left and right for single space
			for (var i = 2; i < code.length; i++) {
				if (code [i] === '=') {
					(!/^[^\/\s] $/.test (code.slice (i-2, i))) && context.report ({
						node: node,
						message: 'There should be only a single space between assignment operator \'=\' and its left side.' 
					});

					(!/^ [^\/\s]$/.test (code.slice (i+1, i+3))) && context.report ({
						node: node,
						message: 'There should be only a single space between assignment operator \'=\' and its right side.' 
					});
				}
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


		/************************************************************************************************
		 * From here on, we're explicitly looking for comma whitespace errors
		 ************************************************************************************************/
		context.on ('ArrayExpression', function (emitted) {
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
		});


		context.on ('SequenceExpression', function (emitted) {
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
		});

	}

};