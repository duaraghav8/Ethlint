/**
 * @fileoverview Ensure that all non-abstract function declarations, if and else clauses, for, while and with statements are followed by an opening curly brace.
 * This starting brace must be on the same line as the statement.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCode = context.getSourceCode ();

		context.on ('IfStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			//rules for consequents of if/else if/else				
			var ifConsequentType = node.consequent.type,
				nodeStartingLine = sourceCode.getLine (node);
			var consequentStartingLine = sourceCode.getLine (node.consequent),
				consequentEndingLine = sourceCode.getEndingLine (node.consequent);

			if (ifConsequentType === 'EmptyStatement') {

				context.report ({
					node: node.consequent,
					message: 'Clause is followed by an empty statement.'
				});

			} else if (ifConsequentType === 'BlockStatement') {

				//if the complete test lies on the same line as the 'if' token but the brace doesn't, report
				if (nodeStartingLine === sourceCode.getEndingLine (node.test)) {
					if (sourceCode.getLine (node.consequent) !== nodeStartingLine) {

						context.report ({
							node: node.consequent,
							message: 'Opening brace must be on the same line as the \'if\' token.'
						});

					} else {

						//if the brace IS on the same line, ensure that only a single space exists between it and test
						(!/^[^\s\/] $/.test (sourceCode.getPrevChars (node.consequent, 2))) && context.report ({
							node: node.consequent,
							message: 'There should be only a single space and no comments between condition and opening brace.'
						});

					}
				}

			} else {
				/**
				 * If consequent is a single item:
				 *     1. It should be on the line immediately after the test
				 *     2. It should completely reside on a single line
				 */
				if (consequentStartingLine !== sourceCode.getEndingLine (node.test) + 1) {
					context.report ({
						node: node.consequent,
						message: 'Consequent should exist exactly on the line after condition.'
					});
				} else if (consequentEndingLine !== consequentStartingLine) {
					context.report ({
						node: node.consequent,
						message: 'When not inside block \'{..}\', the consequent must reside on a single line only.'
					});
				}
			}

			var alternate = node.alternate;

			if (!alternate) {
				return;
			}

			var alternateLine = sourceCode.getLine (alternate);

			/**
			 * If consequent is a BlockStatement, then alternate & 'else' must begin on the same line as ending brace of consequent
			 * Otherwise, 'else' must exist on the line immediately after the finishing line of the consequent
			 */
			if (ifConsequentType === 'BlockStatement') {
				if (
					(alternate.type === 'BlockStatement' || alternate.type === 'IfStatement') &&
					alternateLine !== consequentEndingLine
				) {
					return context.report ({
						node: alternate,
						message: 'Alternate \'else\'.. must begin on the same line as the if\'s closing brace.'
					});
				}
			} else {
				var nextLineText;

				try {
					nextLineText = sourceCode.getTextOnLine (consequentEndingLine + 1);
				} catch (e) {
					//if next line doesn't exist, i.e., consequentEndingLine is the last line in the program
					nextLineText = '';
				}

				//ensure that consequent is followed by 'else' token on the next line
				if (!/^\s*else/.test (nextLineText)) {
					return context.report ({
						node: node.consequent,
						location: {
							line: consequentEndingLine
						},
						message: 'if consequent should be followed by \'else ...\' token on the next line.'
					});
				}
			}

			//if alternate is another 'if' statement (,i.e., else if (..) {..}), below rules don't apply
			if (alternate.type === 'IfStatement') {
				return;
			}

			if (alternate.type === 'EmptyStatement') {
				return context.report ({
					node: alternate,
					message: '\'else\' token is followed by an empty statement.'
				});
			}

			if (alternate.type === 'BlockStatement') {
				if (alternateLine !== consequentEndingLine) {

					context.report ({
						node: alternate,
						message: 'Opening brace must be on the same line as \'else\' token.'
					});

				} else if (!/^[^\s\/] $/.test (sourceCode.getPrevChars (alternate, 2))) {

					//if the brace IS on the same line, ensure that only a single space exists between it and test
					context.report ({
						node: alternate,
						message: 'There should be only a single space and no comments between \'else\' token and opening brace.'
					});

				}

				return;
			}

			//ensure that 'else' token is followed by statement on the next line (when statement is neither EmptyStatement nor inside a block)
			if (sourceCode.getLine (alternate) !== consequentEndingLine + 2) {
				return context.report ({
					node: alternate,
					message: 'Alternate clause should exist exactly 2 lines after if consequent (1 line after \'else\' token).'
				});
			}

			//if alternate is a single statement (not inside block), it must completely reside on a single line
			(sourceCode.getLine (alternate) !== sourceCode.getEndingLine (alternate)) && context.report ({
				node: alternate,
				message: 'When not inside block \'{..}\', the statement inside else clause must reside on a single line only.'
			});
		});


		context.on ('ForStatement', function (emitted) {
			var node = emitted.node,
				lastNodeOnStartingLine = node.update || node.test || node.init;
			var startingLine = sourceCode.getLine (node);

			if (emitted.exit) {
				return;
			}

			/**
			 * If no BlockStatement found, report. Otherwise:
			 * Check the last non-null node amongst 'init', 'test' and 'update'
			 * If such a node doesn't exist and '{' is on diff line, report.
			 * If such a node exists and it exists on the same line as 'for' and '{' is on diff line, report
			 */
			if (node.body.type !== 'BlockStatement') {
				return context.report ({
					node: node,
					message: 'Expected \'{\' after for statement.'
				});
			}

			if (
				(
					!lastNodeOnStartingLine ||
					startingLine === sourceCode.getEndingLine (lastNodeOnStartingLine)
				) &&
				startingLine !== sourceCode.getLine (node.body)
			) {
				return context.report ({
					node: node.body,
					message: 'Opening brace \'{\' must be on the same line as the for (...) statement.'
				});
			}

			if (!/^[^\s\/] $/.test (sourceCode.getPrevChars (node.body, 2))) {
				context.report ({
					node: node.body,
					message: 'There should be only a single space and no comments between while () declaration and opening brace.'
				});
			}
		});


		context.on ('WhileStatement', function (emitted) {
			var node = emitted.node,
				startingLine = sourceCode.getLine (node);

			if (emitted.exit) {
				return;
			}

			/**
			 * If no BlockStatement found, report. Otherwise:
			 * If 'while' and node.test exist on same line and '{' is on diff line, report
			 */
			if (node.body.type !== 'BlockStatement') {
				return context.report ({
					node: node,
					message: 'Expected \'{\' after while statement.'
				});
			}

			if (
				startingLine === sourceCode.getEndingLine (node.test) &&
				startingLine !== sourceCode.getLine (node.body)
			) {
				return context.report ({
					node: node.body,
					message: 'Opening brace \'{\' must be on the same line as the while (...) statement.'
				});
			}

			if (!/^[^\s\/] $/.test (sourceCode.getPrevChars (node.body, 2))) {
				context.report ({
					node: node.body,
					message: 'There should be only a single space and no comments between while () declaration and opening brace.'
				});
			}
		});


		context.on ('DoWhileStatement', function (emitted) {
			var node = emitted.node,
				startingLine = sourceCode.getLine (node);

			if (emitted.exit) {
				return;
			}

			/**
			 * If no BlockStatement found, report. Otherwise:
			 * If 'while' and node.test exist on same line and '{' is on diff line, report
			 */
			if (node.body.type !== 'BlockStatement') {
				return context.report ({
					node: node,
					message: 'Expected \'{\' after do token.'
				});
			}

			if (
				startingLine === sourceCode.getEndingLine (node.test) &&
				startingLine !== sourceCode.getLine (node.body)
			) {
				return context.report ({
					node: node.body,
					message: 'Opening brace \'{\' must be on the same line as the while (...) statement.'
				});
			}

			if (!/^[^\s\/] $/.test (sourceCode.getPrevChars (node.body, 2))) {
				context.report ({
					node: node.body,
					message: 'There should be only a single space and no comments between \'do\' token and opening brace.'
				});
			}
		});


		/**
		 * Ideally with() shouldn't be be used in code and there's even a rule to disallow it.
		 * But if it must absolutely be used, it must be used responsibly
		 */
		context.on ('WithStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (node.body.type !== 'BlockStatement') {
				return context.report ({
					node: node,
					message: 'Expected \'{\' after with statement'
				});
			} 

			if (sourceCode.getLine (node) !== sourceCode.getLine (node.body)) {
				return context.report ({
					node: node.body,
					message: 'Opening brace \'{\' must be on the same line as the with (...) statement.'
				});
			}

			if (!/^[^\s\/] $/.test (sourceCode.getPrevChars (node.body, 2))) {
				context.report ({
					node: node.body,
					message: 'There should be only a single space and no comments between with () declaration and opening brace.'
				});
			}
		});


		context.on ('StructDeclaration', function (emitted) {
			var node = emitted.node,
				code = sourceCode.getText (node).replace ('struct ' + node.name, '');

			if (emitted.exit) {
				return;
			}

			(code.slice (0, 2) !== ' {') && context.report ({
				node: node,
				message: '\'' + node.name + '\': ' + 'There should be only a single space and no comments between struct declaration and opening brace.'
			});
		});


		context.on ('ContractStatement', function (emitted) {
			var node = emitted.node,
				code = sourceCode.getTextOnLine (sourceCode.getLine (node));

			if (emitted.exit) {
				return;
			}

			(!/[^\s\/] {/.test (code)) && context.report ({
				node: node,
				message: '\'' + node.name + '\': ' + 'There should be only a single space and no comments or line break between contract declaration and opening brace.'
			});
		});


		context.on ('LibraryStatement', function (emitted) {
			var node = emitted.node,
				code = sourceCode.getTextOnLine (sourceCode.getLine (node));

			if (emitted.exit) {
				return;
			}

			(!/[^\s\/] {/.test (code)) && context.report ({
				node: node,
				message: '\'' + node.name + '\': ' + 'There should be only a single space and no comments or line break between library declaration and opening brace.'
			});
		});


		context.on ('FunctionDeclaration', function (emitted) {
			var node = emitted.node;

			if (emitted.exit || node.is_abstract) {
				return;
			}

			/**
			 * If entire (non-abstract) function's signature is on single line, then the opening brace of its body must be on the same line too.
			 * If signature is on multiple line:
			 *     If sign contains only params (each on its own line), then brace must be on the same line as last param's ending line
			 *     If sign contains modifiers (each on its own line), then brace must be on the line immediately after ending line of last modifier
			 */
			var declarationEndingLine,
				declarationStartingLine = sourceCode.getLine (node),
				bodyStartingLine = sourceCode.getLine (node.body);

			//If the node just before function's body is on the start line itself, then the opening brace must too be on the start line
			if (node.returnParams) {
				declarationEndingLine = sourceCode.getEndingLine (node.returnParams.slice (-1) [0]);
			} else if (node.modifiers) {
				//if modifiers is non-null (,i.e., array), compare bodyStartingLine with ending line of the last modifier declaration (last array element)
				declarationEndingLine = sourceCode.getEndingLine (node.modifiers.slice (-1) [0]);
			} else if (node.params) {
				//if params is non-null (,i.e., array), compare bodyStartingLine with ending line of the last param declaration (last array element)
				declarationEndingLine = sourceCode.getEndingLine (node.params.slice (-1) [0]);
			} else {
				//if none of the above is present, then opening brace must surely begin on the same line
				declarationEndingLine = sourceCode.getLine (node);
			}

			var charsBeforeLBrace = sourceCode.getPrevChars (node.body, 2);

			if (declarationEndingLine === declarationStartingLine) {
				
				if (bodyStartingLine !== declarationEndingLine) {
					context.report ({
						node: node.body,
						message: 'Opening brace of function \'' + node.name + '\' must be on the same line as its declarations.'
					});
				} else {
					(!/[^\s\/] /.test (charsBeforeLBrace)) && context.report ({
						node: node.body,
						message: 'Function \'' + node.name + '\': Opening brace must be preceded by only a single space.'
					});
				}

				return;

			}

			if (node.returnParams) {
				var lastNodeBeforeBody = node.returnParams.slice (-1) [0];

				if (sourceCode.getLine (node.body) !== sourceCode.getEndingLine (lastNodeBeforeBody) + 1) {
					context.report ({
						node: node.body,
						message: 'Function \'' + node.name + '\': Opening brace must be on a new line immediately after the last modifier.'
					});
				}

				return;
			}

			//stringBetwLastModifAndLBrace should start with \n, followed by any no. of spaces or tabs, then end.
			if (node.modifiers) {
				//Take string between last modifier and the opening brace (both exclusive)
				var stringBetwLastModifAndLBrace,
				    modifierNode = node.modifiers.slice (-1) [0];

				//Catch case where modifier has no brackets and alter node's location end appropriately
				if (modifierNode.params !== null && modifierNode.params.length === 0){
				    modifierNode.end = modifierNode.start + modifierNode.name.length;
				}

				stringBetwLastModifAndLBrace = sourceCode.getStringBetweenNodes (
				    modifierNode, node.body
				);

				(!/^[ \t]*\n[ \t]*$/.test (stringBetwLastModifAndLBrace)) && context.report ({
					node: node.body,
					message: 'Function \'' + node.name + '\': Opening brace must be on a new line immediately after the last modifier.'
				});

				return;
			}

			//stringBetwLastModifAndLBrace should start with \n, followed by any no. of spaces or tabs, then end.
			(!/[^\s\/] /.test (charsBeforeLBrace)) && context.report ({
				node: node.body,
				message: 'Function \'' + node.name + '\': Opening brace must be preceded by only a single space.'
			});

			
		});
		
	}

};
