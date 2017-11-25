/**
 * @fileoverview Ensure that all imports are on top of the file
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';


module.exports = {

	meta: {

		docs: {
			recommended: true,
			type: 'error',
			description: 'Ensure that all import statements are on top of the file'
		},

		schema: []

	},

	create: function (context) {

		/**
		 * If ImportStatement node is a direct child of Program node 'parent',
		 * then it is an element of parent.body array.
		 * The node should precede any other type of node in the array except for the pragma & pragma experimental directives
		 * and other import statements.
		 */
		function inspectImportStatement (emitted) {
			if (emitted.exit) {
				return;
			}

			const {node} = emitted,
				programNode = context.getSourceCode ().getParent (node),
				nodesAllowedAbove = ['ExperimentalPragmaStatement', 'PragmaStatement', 'ImportStatement'];

			for (let childNode of programNode.body) {
				// If we've reached this import while traversing body, it means its position is fine.
				if (node.start === childNode.start) {
					return;
				}

				// The moment we find 1 node not allowed above import, report and exit.
				// TODO: write fix() for this issue:
				//   - Remove import from current position
				//   - Place it right before childNode.start
				if (nodesAllowedAbove.indexOf (childNode.type) < 0) {
					return context.report ({
						node,
						message: 'Import Statement must precede everything except pragma directives.'
					});
				}
			}
		}

		return {
			ImportStatement: inspectImportStatement
		};

	}

};
