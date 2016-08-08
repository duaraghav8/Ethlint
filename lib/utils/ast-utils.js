/**
 * @fileoverview Utility functions to help efficiently explore the Abstract Syntax Tree
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var sourceCodeText = '';

/**
 * Initialization method - provide all the necessary information astUtils functions could require in order to work
 * @param {String} sourceCodeText The source code being linted
 */
exports.init = function (sourceCode) {
	sourceCodeText = sourceCode;
};

/**
 * Check if given argument is an AST Node
 * @param {Object} possibleObject Argument to check for validity
 * @returns {Boolean} isAValidASTNode true if given argument is an AST node, false otherwise
 */
exports.isASTNode = function (possibleNode) {

	return (
		possibleNode !== null &&	//node shouldn't be null
		typeof (possibleNode) === 'object' &&	//must be data type object
		possibleNode.hasOwnProperty ('type') &&	//a 'type' key must exist in the node
		typeof (possibleNode.type) === 'string'	//node.type's value must be a string
	);

};

/**
 * Get the parent node of the specified node
 * @param {Object} node The AST Node to retrieve the parent of
 * @returns {Object} nodeParent Parent node of the given node
 */
exports.getParent = function (node) {
	return node.parent;
}

/**
 * Retrieve the line number on which the code for provided node exists inside the source code
 * @param {Object} node The AST Node to retrieve the line number of
 * @returns {Integer} lineNumber Line number of code of the specified node. (LINES BEGIN FROM 1)
 */
exports.getLine = function (node) {
	var newLineCharsBefore = sourceCodeText
		.slice (0, node.start)
		.match (/\n/g);

	return (
		(newLineCharsBefore ? newLineCharsBefore.length : 0) + 1
	);
};

/**
 * Retrieve the column number on which the code for provided node exists inside the source code
 * @param {Object} node The AST Node to retrieve the column number of
 * @returns {Integer} columnNumber Column number of code of the specified node (COLUMNS BEGIN FROM 0)
 */
exports.getColumn = function (node) {
	//start looking from 1 character before node.start and stop upon encounter the first linebreak character
	for (var i = node.start - 1; i >= 0; i--) {
		if (sourceCodeText [i] === '\n') {
			return node.start - i - 1;
		}
	}
	return 0;
};