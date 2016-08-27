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
		typeof possibleNode === 'object' &&	//must be data type object
		possibleNode.hasOwnProperty ('type') &&	//a 'type' key must exist in the node
		typeof possibleNode.type === 'string'	//node.type's value must be a string
	);

};

/**
 * Get the parent node of the specified node
 * @param {Object} node The AST Node to retrieve the parent of
 * @returns {Object} nodeParent Parent node of the given node
 */
exports.getParent = function (node) {
	if (!exports.isASTNode (node)) {
		throw new Error (JSON.stringify (node) + ' is not a valid AST node');
	}
	return node.parent;
};

/**
 * Retrieve the line number on which the code for provided node STARTS
 * @param {Object} node The AST Node to retrieve the line number of
 * @returns {Integer} lineNumber Line number of code of the specified node. (LINES BEGIN FROM 1)
 */
exports.getLine = function (node) {
	if (!exports.isASTNode (node)) {
		throw new Error (JSON.stringify (node) + ' is not a valid AST node');
	}

	var newLineCharsBefore = sourceCodeText
		.slice (0, node.start)
		.match (/\n/g);

	return (
		(newLineCharsBefore ? newLineCharsBefore.length : 0) + 1
	);
};

/**
 * Retrieve the column number of the first character of the given node
 * @param {Object} node The AST Node to retrieve the column number of
 * @returns {Integer} columnNumber Column number of code of the specified node (COLUMNS BEGIN FROM 0)
 */
exports.getColumn = function (node) {
	if (!exports.isASTNode (node)) {
		throw new Error (JSON.stringify (node) + ' is not a valid AST node');
	}

	//start looking from sourceCodeText [node.start] and stop upon encountering the first linebreak character
	for (var i = node.start; i >= 0; i--) {
		if (sourceCodeText [i] === '\n') {
			return node.start - i - 1;
		}
	}

	return node.start;
};

/**
 * Retrieve the line number on which the code for provided node ENDS
 * @param {Object} node The AST Node to retrieve the line number of
 * @returns {Integer} lineNumber Line number of code ending of the specified node. (LINES BEGIN FROM 1)
 */
exports.getEndingLine = function (node) {
	if (!exports.isASTNode (node)) {
		throw new Error (JSON.stringify (node) + ' is not a valid AST node');
	}

	var newLineCharsBefore = sourceCodeText
		.slice (0, node.end)
		.trim ()
		.match (/\n/g);

	return (
		(newLineCharsBefore ? newLineCharsBefore.length : 0) + 1
	);
}

/**
 * Retrieve the column number of the last character that is part of the given node
 * @param {Object} node The AST Node to retrieve the ending column number of
 * @returns {Integer} columnNumber Column number of last char of the specified node (COLUMNS BEGIN FROM 0)
 */
exports.getEndingColumn = function (node) {
	if (!exports.isASTNode (node)) {
		throw new Error (JSON.stringify (node) + ' is not a valid AST node');
	}

	//start looking from 1 character before node.start and stop upon encountering the first linebreak character
	for (var i = node.end - 1; i >= 0; i--) {
		if (sourceCodeText [i] === '\n') {
			return node.end - i - 2;
		}
	}

	return node.end - 1;
};