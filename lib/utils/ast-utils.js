/**
 * @fileoverview Utility functions to help efficiently explore the Abstract Syntax Tree
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Ajv = require("ajv"),
    util = require("util"),
    astNodeSchema = require("../../config/schemas/ast-node");

let nodeSchemaValidator = new Ajv({ allErrors: true }), sourceCodeText = "";


// For internal use. Throws if is passed an invalid AST node, else does nothing.
function throwIfInvalidNode(node, functionName) {
    if (!exports.isASTNode(node)) {
        throw new Error(functionName + "(): " + util.inspect(node) + " is not a valid AST node.");
    }
}


/**
 * Initialization method - provide all the necessary information astUtils functions could require in order to work
 * @param {String} sourceCodeText The source code being linted
 */
exports.init = function(sourceCode) {
    sourceCodeText = sourceCode;
};

/**
 * Check if given argument is an AST Node
 * @param {Object} possibleObject Argument to check for validity
 * @returns {Boolean} isAValidASTNode true if given argument is an AST node, false otherwise
 */
exports.isASTNode = nodeSchemaValidator.compile(astNodeSchema);

/**
 * @param {Object} node The node to check
 * @param {String} type The type of the node
 * @returns {Boolean} true if the given node is the right type
 */
function isNodeType(node, name) {
    throwIfInvalidNode(node, "isNodeType");
    return node["type"] === name;
}

/**
  * @param {Object} node The node to check
  * @returns {Boolean} true if the given node is an BlockStatement
  */
exports.isBlockStatement = function(node) {
    return isNodeType(node, "BlockStatement");
};

/**
 * @param {Object} node The node to check
 * @returns {Boolean} true if the given node is an BreakStatement
 */
exports.isBreakStatement = function(node) {
    return isNodeType(node, "BreakStatement");
};

/**
 * @param {Object} node The node to check
 * @returns {Boolean} true if the given node is an ExpressionStatement
 */
exports.isExpression = function(node) {
    return isNodeType(node, "ExpressionStatement");
};

/**
 * @param {Object} node The node to check
 * @returns {Boolean} true if the given node is an AssignmentStatement
 */
exports.isAssignment = function(node) {
    return isNodeType(node, "AssignmentExpression");
};

/**
 * @param {Object} node The node to check
 * @returns {Boolean} true if the given node is an UpdateExpression
 */
exports.isUpdate = function(node) {
    return isNodeType(node, "UpdateExpression");
};

/**
 * @param {Object} node The node to check
 * @returns {Boolean} true if the given node is an MemberExpression
 */
exports.isMember = function(node) {
    return isNodeType(node, "MemberExpression");
};

/**
 * @param {Object} node The node to check
 * @returns {Boolean} true if the given node is an IfStatement
 */
exports.isIfStatement = function(node) {
    return isNodeType(node, "IfStatement");
};

/**
 * @param {Object} node The node to check
 * @returns {Boolean} true if the given node is a type of loop statement
 */
exports.isLoopStatement = function(node) {
    return ["ForStatement", "WhileStatement", "DoWhileStatement"].indexOf(node["type"]) >= 0;
};

/**
 * Get the parent node of the specified node
 * @param {Object} node The AST Node to retrieve the parent of
 * @returns {Object} nodeParent Parent node of the given node
 */
exports.getParent = function(node) {
    throwIfInvalidNode(node, "getParent");
    return node.parent;
};

/**
 * Retrieve the line number on which the code for provided node STARTS
 * @param {Object} node The AST Node to retrieve the line number of
 * @returns {Integer} lineNumber Line number of code of the specified node. (LINES BEGIN FROM 1)
 */
exports.getLine = function(node) {
    throwIfInvalidNode(node, "getLine");

    let newLineCharsBefore = sourceCodeText
        .slice(0, node.start)
        .match(/\n/g);

    return (
        (newLineCharsBefore ? newLineCharsBefore.length : 0) + 1
    );
};

/**
 * Retrieve the column number of the first character of the given node
 * @param {Object} node The AST Node to retrieve the column number of
 * @returns {Integer} columnNumber Column number of code of the specified node (COLUMNS BEGIN FROM 0)
 */
exports.getColumn = function(node) {
    throwIfInvalidNode(node, "getColumn");

    //start looking from sourceCodeText [node.start] and stop upon encountering the first linebreak character
    for (let i = node.start; i >= 0; i--) {
        if (sourceCodeText [i] === "\n") {
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
exports.getEndingLine = function(node) {
    throwIfInvalidNode(node, "getEndingLine");

    let newLineCharsBefore = sourceCodeText
        .slice(0, node.end)
        .match(/\n/g);

    return (
        (newLineCharsBefore ? newLineCharsBefore.length : 0) + 1
    );
};

/**
 * Retrieve the column number of the last character that is part of the given node
 * @param {Object} node The AST Node to retrieve the ending column number of
 * @returns {Integer} columnNumber Column number of last char of the specified node (COLUMNS BEGIN FROM 0)
 */
exports.getEndingColumn = function(node) {
    throwIfInvalidNode(node, "getEndingColumn");

    //start looking from 1 character before node.start and stop upon encountering the first linebreak character
    for (let i = node.end - 1; i >= 0; i--) {
        if (sourceCodeText [i] === "\n") {
            return node.end - i - 2;
        }
    }

    return node.end - 1;
};
