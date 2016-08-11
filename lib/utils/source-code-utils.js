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
	 * @returns {String} sourceCodeText source code of the specified node plus extra characters specified by beforeCount & afterCount
	 */
	getText: function (node, beforeCount, afterCount) {
		var sourceCodeText = this.text;

		if (node) {
			if (astUtils.isASTNode (node)) {

				return this.text.slice (
					Math.max (0, node.start - (Math.abs (beforeCount) || 0)),
					node.end + (Math.abs (afterCount) || 0)
				);

			} else {
				throw new Error ('Invalid Node object');
			}
		}

		return sourceCodeText;
	},

	getNextChar: function (node) {
		if (node && astUtils.isASTNode (node)) {
			return this.text [node.end];
		} else {
			throw new Error ('Invalid Node object');
		}
	},

	getPrevChar: function (node) {
		if (node && astUtils.isASTNode (node)) {
			return this.text [node.start - 1];
		} else {
			throw new Error ('Invalid Node object');
		}
	},

	getNextChars: function (node, charCount) {
		if (node && astUtils.isASTNode (node)) {
			return this.text.slice (
				node.end, node.end + charCount
			);
		} else {
			throw new Error ('Invalid Node object');
		}
	},

	getPrevChars: function (node, charCount) {
		if (node && astUtils.isASTNode (node)) {
			return this.text.slice (
				node.start - charCount, node.start
			);
		} else {
			throw new Error ('Invalid Node object');
		}
	}

};

INHERITABLE_METHODS.forEach (function (methodName) {
	SourceCode.prototype [methodName] = astUtils [methodName];
});


module.exports = SourceCode;