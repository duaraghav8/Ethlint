/**
 * @fileoverview Specify where whitespace is suitable and where it isn't
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	meta: {

		docs: {
			recommended: true,
			type: 'warning',
			description: 'Specify where whitespace is suitable and where it isn\'t'
		},

		schema: []

	},

	create: function (context) {

		var sourceCode = context.getSourceCode ();

		function inspectNameValueAssignment (emitted) {
			if (emitted.exit) {
				return;
			}

			var node = emitted.node,
				codeBetweenNameAndValue = sourceCode.getStringBetweenNodes (node.name, node.value);
			var validationRegexp = /^((: )|(:)|( : ))$/;

			(!validationRegexp.test (codeBetweenNameAndValue)) && context.report ({
				location: {
					column: sourceCode.getColumn (node.name) + 1
				},

				node: node,
				message: ('Name \'' + node.name.name +
					'\': Only "N: V", "N : V" or "N:V" spacing style should be used in Name-Value Mapping.')
			});

			//If this is not the last node of its parent array, ensure the comma spacing is acceptable
			var parentArray = node.parent.arguments;

			if (node.start === parentArray.slice (-1) [0].start) {
				return;
			}

			var codeAfterCurrentAssignment = sourceCode.getNextChars (node.value, 3);
			validationRegexp = /^((,[^ \n\/].)|(, [^ \n\/])|(,\n[^\n\/]))$/;

			(!validationRegexp.test (codeAfterCurrentAssignment)) && context.report ({
				location: {
					column: sourceCode.getEndingColumn (node.value) + 1
				},

				node: node,
				message: '"' + sourceCode.getText (node.value) + '" should be immediately followed by a comma, then an optional space.'
			});
		}


		function inspectMemberExpression (emitted) {
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
		}


		function inspectBlockStatement (emitted) {
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
		}


		function inspectObjectExpression (emitted) {
			var node = emitted.node, properties = node.properties;

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
		}

		return {
			ObjectExpression: inspectObjectExpression,
			BlockStatement: inspectBlockStatement,
			MemberExpression: inspectMemberExpression,
			NameValueAssignment: inspectNameValueAssignment
		};

	}

};
