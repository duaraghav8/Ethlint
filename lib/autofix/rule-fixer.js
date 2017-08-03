/**
 * @fileoverview Methods exposed to rule developers to define the fixes to be applied over a range in code or an AST Node.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var astUtils = require ('../utils/ast-utils');


function insertTextAt (index, text) {
	return {
		range: [index, index],
		text: text
	};
}

function validateArgs (node, text) {
	if (!astUtils.isASTNode (node)) {
		throw new Error ('A valid AST node was not provided.');
	}

	if (!(text && typeof text === 'string')) {
		throw new Error ('A valid string was not provided.');
	}
}


var ruleFixerAPI = {

	insertTextAfter (node, text) {
		validateArgs (node, text);
		return this.insertTextAfterRange ([node.start, node.end], text);
	},

	insertTextBefore (node, text) {
		validateArgs (node, text);
		return this.insertTextBeforeRange ([node.start, node.end], text);
	},

	remove (node) {
		return this.removeRange ([node.start, node.end]);
	},

	replaceText (node, text) {
		validateArgs (node, text);
		return this.replaceTextRange ([node.start, node.end], text);
	},

	insertTextAfterRange (range, text) {
		return insertTextAt (range [1], text);
	},

	insertTextBeforeRange (range, text) {
		return insertTextAt (range [0], text);
	},

	removeRange (range) {
		return this.replaceTextRange (range, '');
	},

	replaceTextRange (range, text) {
		return {
			range: range,
			text: text
		};
	}

};


function RuleFixer (fixType) {
	Object.assign (this, ruleFixerAPI);
}


RuleFixer.prototype = {
	constructor: RuleFixer
};


module.exports = RuleFixer;