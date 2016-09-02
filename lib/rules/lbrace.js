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
			var node = emitted.node,
				testConditionsCode = sourceCode.getText (node.test);
			var startingLine = sourceCode.getLine (node),
				consequentStartingLine = sourceCode.getLine (node.consequent),
				testEndingLine = sourceCode.getEndingLine (node.test);

			if (emitted.exit) {
				return;
			}

			if (node.consequent.type === 'EmptyStatement') {
				context.report ({
					node: node.consequent,
					message: 'Clause is followed by an empty statement.'
				});
			}

			//if this node is an alternate ('else if (..) {..}'), make sure its on its own line
			if (
				node.parent.type === 'IfStatement' &&
				startingLine !== sourceCode.getEndingLine (node.parent.consequent) + 1
			) {
				context.report ({
					node: node,
					message: 'Clause must be on its own line immediately after the previous one.'
				});
			}

			/**
			 * If consequent is not block and its not the case that:
			 *     consequent is on the next line and only resides on a single line, then
			 * report
			 */
			if (node.consequent.type !== 'BlockStatement') {
				if (
					!(
						consequentStartingLine === testEndingLine + 1 &&
						consequentStartingLine === sourceCode.getEndingLine (node.consequent)
					)
				) {
					context.report ({
						node: node,
						message: 'Expected \'{\' after if clause'
					});
				}
			} else if (
				startingLine === testEndingLine &&
				consequentStartingLine !== startingLine
			) {
				//'{' is not on the same line as the if statement AND the test isn't spread over multiple lines
				context.report ({
					node: node,
					message: 'Opening brace must be on the same line as the if() statement.'
				});
			}

			if (node.alternate) {
				//enforse 'else' clause to be on its own line
				/*if (sourceCode.getLine (node.alternate) !== sourceCode.getEndingLine (node.consequent) + 1) {
					context.report ({
						node: node.alternate,
						message: node.alternate.type + ' must be on its own line, immediately after the previous clause\'s body ends.'
					});
				}*/

				if (node.alternate.type === 'EmptyStatement') {
					
					context.report ({
						node: node.alternate,
						message: 'Clause is followed by an empty statement.'
					});

				} else if (node.alternate.type === 'BlockStatement') {
					
					//an else statement with block {...}
					var elseClauseRegExp = /^\s*else\s*{/,
						elseClauseText = sourceCode.getTextOnLine (sourceCode.getLine (node.alternate));

					if (!elseClauseRegExp.test (elseClauseText)) {
						context.report ({
							node: node.alternate,
							message: 'Opening brace must be on the same line as the else keyword and comments should only appear after all code.'
						});
					}

				} else if (node.alternate.type !== 'IfStatement') {
					
					//node.alternate is neither an else {...}, nor an else if (..) {...}
					var alternateClauseText = sourceCode.getTextOnLine (sourceCode.getLine (node.alternate) - 1);

					//finally, of ts not even a single-line alternative 'else <statement>;'
					if (
						!/\s*else\s*/.test (alternateClauseText) ||
						sourceCode.getLine (node.alternate) !== sourceCode.getEndingLine (node.alternate)
					) {
						context.report ({
							node: node.alternate,
							message: 'Expected \'{\' after else clause'
						});
					}

				}
			}
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

			(sourceCode.getLine (node) === sourceCode.getLine (node.body)) &&
			!/[^\s\/] /.test (sourceCode.getPrevChars (node.body, 2)) &&
			context.report ({
				node: node.body,
				message: 'Function \'' + node.name + '\': Opening brace must be preceeded by a single space.'
			});
		});
		
	}

};
