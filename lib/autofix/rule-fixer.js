/**
 * @fileoverview Methods exposed to rule developers to define the fixes to be applied over a range in code or an AST Node.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let astUtils = require("../utils/ast-utils");

function validateArgs(args) {
    if (args.hasOwnProperty("node")) {
        if (!astUtils.isASTNode(args.node)) {
            throw new Error("A valid AST node was not provided.");
        }
    }

    if (args.hasOwnProperty("text")) {
        let text = args.text;

        // There are no restriction on string length
        if (typeof text !== "string") {
            throw new Error("A valid string was not provided.");
        }
    }

    if (args.hasOwnProperty("range")) {
        let range = args.range;

        if (!(Array.isArray(range) && range.length === 2 && Number.isInteger(range [0]) &&
			Number.isInteger(range [1]) && range [0] >= 0 && range [1] >= 0)) {
            throw new Error(
                "A valid range object was not provided. Should be an Array of 2 unsigned Integers.");
        }
    }

    if (args.hasOwnProperty("index")) {
        let index = args.index;

        if (!(Number.isInteger(index) && index >= 0)) {
            throw new Error("A valid index was not provided. Must be an unsigned Integer.");
        }
    }

    if (args.hasOwnProperty("char")) {
        let char = args.char;

        if (!(typeof char === "string" && char.length === 1)) {
            throw new Error("A valid character was not provided. Must be a string with length of 1.");
        }
    }
}


function insertTextAt(index, text) {
    validateArgs({index, text});

    return {
        range: [index, index],
        text: text
    };
}


let ruleFixerAPI = {

    insertTextAt,

    insertTextAfter(node, text) {
        validateArgs({node: node, text: text});
        return this.insertTextAfterRange([node.start, node.end], text);
    },

    insertTextBefore(node, text) {
        validateArgs({node: node, text: text});
        return this.insertTextBeforeRange([node.start, node.end], text);
    },

    remove(node) {
        return this.removeRange([node.start, node.end]);
    },

    replaceText(node, text) {
        validateArgs({node: node, text: text});
        return this.replaceTextRange([node.start, node.end], text);
    },

    insertTextAfterRange(range, text) {
        validateArgs({range: range, text: text});
        return insertTextAt(range [1], text);
    },

    insertTextBeforeRange(range, text) {
        validateArgs({range: range, text: text});
        return insertTextAt(range [0], text);
    },

    removeRange(range) {
        validateArgs({range: range});
        return this.replaceTextRange(range, "");
    },

    replaceChar(index, newChar) {
        validateArgs({index: index, char: newChar});
        return this.replaceTextRange([index, index + 1], newChar);
    },

    replaceTextRange(range, text) {
        validateArgs({range: range, text: text});
        return {
            range: range,
            text: text
        };
    }

};


// eslint-disable-next-line no-unused-vars
function RuleFixer(fixType) {
    Object.assign(this, ruleFixerAPI);
}


RuleFixer.prototype = {
    constructor: RuleFixer
};


module.exports = RuleFixer;
