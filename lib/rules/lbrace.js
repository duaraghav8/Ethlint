/**
 * @fileoverview Ensure that all if and else clauses, for, while and with statements 
 * are followed by an opening curly brace
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		context.on ('IfStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (node.consequent.type !== 'BlockStatement') {
				context.report ({
					node: node,
					message: 'Expected \'{\' after if clause'
				});
			}

			if (node.alternate && node.alternate.type !== 'BlockStatement') {
				context.report ({
					node: node,
					message: 'Expected \'{\' after else clause'
				});
			}
		});

		context.on ('ForStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (node.body.type !== 'BlockStatement') {
				context.report ({
					node: node,
					message: 'Expected \'{\' after for statement'
				});
			}
		});

		context.on ('WhileStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (node.body.type !== 'BlockStatement') {
				context.report ({
					node: node,
					message: 'Expected \'{\' after while statement'
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
			}
		});
		
	}

};
