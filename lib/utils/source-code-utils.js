/**
 * @fileoverview Utility functions to help analyze the Source Code
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var astUtils = require ('./ast-utils');
var INHERITABLE_METHODS = [
		'getLine',
		'getColumn',
		'getParent'
	];

/**
 * SourceCode object constructor - provides the source code text along with functions to operate on the code easily
 * @param {String} sourceCodeText source code being linted
 */
function SourceCode (sourceCodeText) {
	this.text = sourceCodeText;
}

SourceCode.prototype = {

	constructor: SourceCode,

	/**
	 * Function to retrieve the source code text being linted. Returns the complete source code if no node specified
	 * @param {Object} node The AST node whose source code (specifically) is needed
	 * @param {Integer} beforeCount Include beforeCount number of characters prior to the node's code
	 * @param {Integer} afterCount Include afterCount number of characters following the node's code
	 * @returns {String} source code of the specified node plus extra characters specified by beforeCount & afterCount
	 */
	getText: function (node, beforeCount, afterCount) {
		var sourceCodeText = this.text; console.log (node);

		if (node) {
			if (astUtils.isASTNode (node)) {

				return sourceCodeText.slice (
					Math.max (0, node.start - (beforeCount || 0)),
					node.end + (afterCount || 0)
				);

			} else {
				throw new Error ('Invalid Node object');
			}
		}

		return sourceCodeText;
	}

};

INHERITABLE_METHODS.forEach (function (methodName) {
	SourceCode.prototype [methodName] = astUtils [methodName];
});


module.exports = SourceCode;