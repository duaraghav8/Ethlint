/**
 * @fileoverview Suggest replacing deprecated suicide for selfdestruct
 * @author Federico Bond <federicobond@gmail.com>
 */

'use strict';


function isSuicide (node) {
	return node.type === 'Identifier' && node.name === 'suicide';
}

module.exports = {
	verify: function (context) {

		context.on ('CallExpression', function (emittedObject) {

			if (!emittedObject.exit) {
				return;
			}

			var callee = emittedObject.node.callee;

			if (isSuicide (callee)) {

				context.report ({
					node: emittedObject.node,
					message: "'suicide' is deprecated. Use 'selfdestruct' instead",
				});

			}

		});

	}
}
