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
			if (emitted.exit || (sourceCode.getLine (node) !== sourceCode.getEndingLine (property))) {
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
			var node = emitted.node, properties = node.properties,
				lastProperty = properties.slice (-1) [0];	//undefined if ObjectExpression is empty, i.e., {}

			if (
				emitted.exit ||
				(lastProperty && sourceCode.getLine (node) !== sourceCode.getEndingLine (lastProperty))
			) {
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

	}

};