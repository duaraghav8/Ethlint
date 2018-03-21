/**
 * @fileoverview Utility functions to help analyze the Source Code
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const { EOL } = require("os"), astUtils = require("./ast-utils");
const INHERITABLE_METHODS = [
    "isASTNode",
    "getParent",
    "getColumn",
    "getEndingColumn",
    "getLine",
    "getEndingLine",
    "isAChildOf",
    "isBlockStatement",
    "isBreakStatement",
    "isExpression",
    "isAssignment",
    "isUpdate",
    "isMember",
    "isIfStatement",
    "isLoopStatement"
];

/**
 * SourceCode object constructor - provides the source code text along with functions to operate on the code easily
 * @param {String} sourceCodeText source code being linted
 */
function SourceCode(sourceCodeText) {
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
    getText: function(node, beforeCount, afterCount) {
        let sourceCodeText = this.text;

        if (node) {
            if (astUtils.isASTNode(node)) {

                return this.text.slice(
                    Math.max(0, node.start - (Math.abs(beforeCount) || 0)),
                    node.end + (Math.abs(afterCount) || 0)
                );

            }
			
            throw new Error("Invalid Node object");
        }

        return sourceCodeText;
    },

    getNextChar: function(node) {
        if (node && astUtils.isASTNode(node)) {
            //return null if node is the last node,i.e., no characters after this node's code
            return this.text [node.end] || null;
        }
		
        throw new Error("Invalid Node object");
    },

    getPrevChar: function(node) {
        if (node && astUtils.isASTNode(node)) {
            //return null if node.start is 0, i.e., node's code is the first thing in the source code text
            return this.text [node.start - 1] || null;
        }

        throw new Error("Invalid Node object");
    },

    getNextChars: function(node, charCount) {
        if (node && astUtils.isASTNode(node)) {
            return this.text.slice(
                node.end, node.end + (Math.abs(charCount) || 0)
            );
        }
		
        throw new Error("Invalid Node object");
    },

    getPrevChars: function(node, charCount) {
        if (node && astUtils.isASTNode(node)) {
            return this.text.slice(
                Math.max(0, node.start - (Math.abs(charCount) || 0)),
                node.start
            );
        }
		
        throw new Error("Invalid Node object");
    },

    /**
	 * Get the entire string between 2 nodes - ranging from prevNode.end to currentNode.start (exclusive)
	 * @param {ASTNode} prevNode The 1st AST Node
	 * @param {ASTNode} currentNode The 2nd AST Node
	 * @returns {String} charsBetweenNodes The entire string netween the 2 nodes
	 */
    getStringBetweenNodes: function(prevNode, currentNode) {
        if (
            prevNode && astUtils.isASTNode(prevNode) &&
			currentNode && astUtils.isASTNode(currentNode) &&
			prevNode.start <= currentNode.start
        ) {
            return this.text.slice(prevNode.end, currentNode.start);
        }

        throw new Error("Invalid argument for one or both nodes");
    },

    /**
	 * Get the complete text on line lineNumber (excluding the EOL)
	 * @param {Integer} lineNumber Line number whose text to get
	 * @returns {String} code Source code text on the specified line
	 */
    getTextOnLine: function(lineNumber) {
        //establish a cache the first time this function is called, so subsequent calls don't have to split the text again
        if (!this.sourceCodeTextLines) {
            this.sourceCodeTextLines = this.text.split(EOL);
        }

        if (
            lineNumber && typeof lineNumber === "number" &&
			parseInt(lineNumber) === lineNumber &&	//ensure that argument is an INTEGER
			lineNumber >= 1 && lineNumber <= this.sourceCodeTextLines.length
        ) {
            return this.sourceCodeTextLines [lineNumber - 1];
        }

        throw new Error("Line number " + lineNumber + " invalid or out of bounds.");
    }

};

INHERITABLE_METHODS.forEach(function(methodName) {
    SourceCode.prototype [methodName] = astUtils [methodName];
});


module.exports = SourceCode;
