/**
 * @fileoverview Prohibit the use of selfdestruct or suicide.
 * @author Brandon Witt <brandon.witt95@gmail.com>
 */

'use strict';


function isSuicide (node) {
	return node.type === 'Identifier' && node.name === 'suicide';
}

function isSelfDestruct (node) {
	return node.type === 'Identifier' && node.name === 'selfdestruct';
}

module.exports = {

	meta: {

		docs: {
			recommended: true,
			type: 'warning',
			description: 'Suggest removing dangerous functions \'suicide\' and \'selfdestruct\''
		},

		schema: [],

	},

	create: function (context) {
		function inspectCallExpression (emittedObject) {
			if (!emittedObject.exit) {
				return;
			}

			var callee = emittedObject.node.callee;

			if (isSuicide (callee)) {

				context.report ({
					node: emittedObject.node,
					message: 'Use of \'suicide\' is dangerous and should be avoided.'
				});

			}

      if (isSelfDestruct (callee)) {

        context.report ({
          node: emittedObject.node,
          message: 'Use of \'selfdestruct\' is dangerous and should be avoided.'
        });

      }
		}

		return {
			CallExpression: inspectCallExpression
		};
	}

};
