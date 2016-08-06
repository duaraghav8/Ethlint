/**
 * @fileoverview Ensure that all imports are on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

/**
 * If ImportStatement node is a direct child of Program node 'parent',
 * then it is an element of parent.body array.
 * The node should preceed any other type of node in the array.
 */
function isOnTop (node, parent) {

	var body = parent.body;

	for (var i = 0; i < body.length; i++) {
		if (body [i].type !== 'ImportStatement') {
			return false;
		}

		if (node.start === body [i].start) {
			return true;
		}
	}

}

module.exports = {

	verify: function (context) {

		context.on ('ImportStatement', function (emitted) {
			
			var node = emitted.node,
				sourceCode = context.getSourceCode (),
				parent = sourceCode.getParent (node);

			function report () {
				context.report ({
					node: node,
					message: 'Import statement must be at the top of the file.'
				});
			}

			if (emitted.exit) {
				return;
			}

			if (parent.type !== 'Program') {
				/**
				 * If immediate parent of ImportStatement node is not Program node, 
				 * it means the node is not top-level (i.e., probably inside BlockStatement or some other node)
				 * This is a clear violation of the rule
				 */
				report ();
			} else if (!isOnTop (node, parent)) {
				report ();
			}

		});

	}

};