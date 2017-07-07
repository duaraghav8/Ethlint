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
				for (var i = nodeCode.length; i > 0; i--) {
					if (nodeCode [i] === ')' && nodeCode [i-1] === '(') {
						return;
					}
					if (/[\s\(\)]/.test (nodeCode [i])) {
						break;
					}
				}

				return context.report ({
					node: node,
					message: '\"' + nodeCode + '\": ' +
					'A call without arguments should have brackets without any whitespace between them, like \'functionName ()\'.'
				});
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

			(callArgs [0].type !== 'NameValueAssignment' && charBeforeFirstArg !== '(') && context.report ({
				node: callArgs [0],
				location: {
					column: sourceCode.getColumn (callArgs [0]) - 1
				},
				message: '\'' + node.callee.name + '\': The first argument must not be preceded by any whitespace or comments (only \'(\').'
			});

			(lastCallArg.type !== 'NameValueAssignment' && charAfterLastCallArg !== ')') && context.report ({
				node: callArgs [0],
				location: {
					column: sourceCode.getEndingColumn (lastCallArg) + 1
				},
				message: '\'' + node.callee.name + '\': The last argument must not be succeded by any whitespace or comments (only \')\').'
			});
		});


		context.on ('NameValueAssignment', function (emitted) {
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
			/**
			 * node.operator is refined here by adding backslash before all the 'special' characters.
			 * 'special' chars are thos chars that are part of solidity assignment operators and, if used without backslash in JS RegExp,
			 * behave as wildcard characters. So to make sure they're treated as simple strings, we add '\' before them.
			 * As of today, these chars include: * / + | ^
			 */
			var node = emitted.node,
				op = node.operator.replace (/([\+\*\/\|\^])/g, '\\$1'), opLength = node.operator.length;

			if (emitted.exit) {
				return;
			}

			// If expression is 'abc *= def;', then charsAfterLeftNode will contain ' *= d'.
			var charsAfterLeftNode = sourceCode.getNextChars (node.left, 3 + opLength),
				validationRegexp = new RegExp ('^ ' + op + ' [^\\s]$');

			(!validationRegexp.test (charsAfterLeftNode)) && context.report ({
				node: node.left,
				message: 'Assignment operator must have exactly single space on both sides of it.'
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

			//If parameters are specified, ensure appropriate spacing surrounding commas
			var params = node.params;

			if (params && params.length > 1) {
				params.slice (0, -1).forEach (function (arg) {
					sourceCode.getNextChar (arg) !== ',' && context.report ({
						node: arg,
						location: {
							column: sourceCode.getEndingColumn (arg) + 1
						},
						message: node.name + ' ' + arg.id + '(): All arguments (except the last one) must be immediately followed by a comma.'
					});
				});
			}
		});


		// The InformalParameter nodes (params) in modifier declaration should follow the same spacing rules as function declarations
		context.on ('ModifierDeclaration', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			//If parameters are specified, ensure appropriate spacing surrounding commas
			var params = node.params;

			if (params && params.length > 1) {
				params.slice (0, -1).forEach (function (arg) {
					sourceCode.getNextChar (arg) !== ',' && context.report ({
						node: arg,
						location: {
							column: sourceCode.getEndingColumn (arg) + 1
						},
						message: node.name + ' ' + arg.id + '(): All arguments (except the last one) must be immediately followed by a comma.'
					});
				});
			}
		});


		context.on ('IfStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			/**
			 * Ensure a single space between 'if' token and the opening parenthesis 'if (...)'
			 */
			var ifTokenLength = 'if'.length,
				nodeCode = sourceCode.getText (node).slice (ifTokenLength, ifTokenLength + 2);

			(nodeCode !== ' (') && context.report ({
				node: node,
				location: {
					column: sourceCode.getColumn (node) + ifTokenLength
				},
				message: 'There should be exactly a single space between the \'if\' token and the parenthetic block representing the conditional.'
			});
		});


		context.on ('WhileStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			/**
			 * Ensure a single space between 'while' token and the opening parenthesis 'while (...)'
			 */
			var whileTokenLength = 'while'.length,
				nodeCode = sourceCode.getText (node).slice (whileTokenLength, whileTokenLength + 2);

			(nodeCode !== ' (') && context.report ({
				node: node,
				location: {
					column: sourceCode.getColumn (node) + whileTokenLength
				},
				message: 'There should be exactly a single space between the \'while\' token and the parenthetic block representing the conditional.'
			});
		});


		context.on ('ForStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			/**
			 * Ensure a single space between 'for' token and the opening parenthesis 'for (...)'
			 */
			var forTokenLength = 'for'.length,
				nodeCode = sourceCode.getText (node).slice (forTokenLength, forTokenLength + 2);

			(nodeCode !== ' (') && context.report ({
				node: node,
				location: {
					column: sourceCode.getColumn (node) + forTokenLength
				},
				message: 'There should be exactly a single space between the \'for\' token and the parenthetic block representing the conditional.'
			});
		});


		/************************************************************************************************
		 * From here on, we're explicitly looking for semicolon whitespace errors
		 ************************************************************************************************/
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


		context.on ('VariableDeclarationTuple', function (emitted) {
			var node = emitted.node, declarations = node.declarations;

			function inspectVariableDeclaratorForWhitespace (vd) {
				var charAfterExpr = sourceCode.getNextChar (vd);

				(charAfterExpr !== ',') && context.report ({
					node: vd,
					location: {
						column: sourceCode.getEndingColumn (vd) + 1
					},
					message: '\'' + vd.id.name + '\': identifier should be immediately followed by a comma without any whitespace in between.'
				});
			}

			if (emitted.exit) {
				return;
			}

			declarations.slice (0, -1).forEach (inspectVariableDeclaratorForWhitespace);
		});

	}

};
