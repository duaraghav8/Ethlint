/**
 * @fileoverview Ensure that all if and else clauses, for, while and with statements are followed by an opening curly brace.
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
			var startingLine = sourceCode.getLine (node);

			if (emitted.exit) {
				return;
			}

			if (node.consequent.type !== 'BlockStatement') {
				context.report ({
					node: node,
					message: 'Expected \'{\' after if clause'
				});
			} else if (
				startingLine === sourceCode.getEndingLine (node.test) &&
				startingLine !== sourceCode.getLine (node.consequent)
			) {
				//'{' is not on the same line as the if statement AND the test isn't spread over multiple lines
				context.report ({
					node: node,
					message: 'Opening brace must be on the same line as the if() statement.'
				});
			}

			if (node.alternate) {
				if (node.alternate.type === 'BlockStatement') {
					//an else statement with {...}
					var prevChar = '', prevCount = 1;

					/**
					 * Start going backward from '{' to find the ending 'e' of 'else'
					 * If a \n is encountered beofore 'e', it means there's a lin gap between 'else' and '{'
					 */
					while (prevChar !== 'e') {
						prevChar = sourceCode.getPrevChars (node.alternate, prevCount++) [0];
						if (prevChar === '\n') {
							context.report ({
								node: node,
								message: 'Opening brace must be on the same line as the else keyword.'
							});
							prevChar = 'e';	//error has been found, now stop the loop
						}
					}

				} else if (node.alternate.type !== 'IfStatement') {
					//node.alternate is neither an else {...}, nor an else if (..) {...}
					context.report ({
						node: node,
						message: 'Expected \'{\' after else clause'
					});
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
				context.report ({
					node: node,
					message: 'Expected \'{\' after for statement'
				});
			} else if (
				(
					!lastNodeOnStartingLine ||
					startingLine === sourceCode.getEndingLine (lastNodeOnStartingLine)
				) &&
				startingLine !== sourceCode.getLine (node.body)
			) {
				context.report ({
					node: node,
					message: 'Opening brace \'{\' must be on the same line as the for (...) statement.'
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
				context.report ({
					node: node,
					message: 'Expected \'{\' after while statement'
				});
			} else if (
				startingLine === sourceCode.getEndingLine (node.test) &&
				startingLine !== sourceCode.getLine (node.body)
			) {
				context.report ({
					node: node,
					message: 'Opening brace \'{\' must be on the same line as the while (...) statement.'
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
				context.report ({
					node: node,
					message: 'Expected \'{\' after with statement'
				});
			} else if (sourceCode.getLine (node) !== sourceCode.getLine (node.body)){
				context.report ({
					node: node,
					message: 'Opening brace \'{\' must be on the same line as the with (...) statement.'
				});
			}
		});
		
	}

};
