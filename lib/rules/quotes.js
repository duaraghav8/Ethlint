/**
 * @fileoverview Ensure that all strings use only 1 style - either double quotes or single quotes. Defaults to double quotes.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var jsStringEscape = require ('js-string-escape');

/**
 * Determine whether the provided literal is in Hex Notation
 * @param {String} literal The literal to test for Hex Notation
 * @returns {Boolean}
 */
function isHex (literal) {
	var reg = /^[0-9a-f]+$/i;

	//test for '0x' separately because hex notation should not be a part of the standard RegExp
	if (literal.slice (0, 2) !== '0x') {
		return false;
	}

	return reg.test (literal.slice (2));
}

module.exports = {

	meta: {

		docs: {
			recommended: true,
			type: 'error',
			description: 'Ensure that all strings use only 1 style - either double quotes or single quotes.'
		},

		fixable: 'code',
		schema: [
			{ type: 'string', enum: ['double', 'single'] }
		]

	},

	create: function (context) {
		var quote = '"',
			quoteStyle = 'double', sourceCode = context.getSourceCode ();

		if (context.options && context.options [0] === 'single') {
			quote = '\'';
			quoteStyle = 'single';
		}

		var selectedQuoteStyleLiteralRegExp = new RegExp ('^\\' + quote + '.*\\' + quote + '$');



		function inspectLiteral (emitted) {
			var node = emitted.node, nodeText = sourceCode.getText (node);

			if (
				emitted.exit || typeof node.value !== 'string' ||
				(nodeText [0] !== '\'' && nodeText [0] !== '\"' && isHex (node.value))
			) {
				return;
			}

			if (!selectedQuoteStyleLiteralRegExp.test (nodeText)) {
				var fixedString = quote + jsStringEscape (node.value) + quote;

				context.report ({
					fix: function (fixer) {
						return fixer.replaceText (node, fixedString);
					},
					node: node,
					message: '\'' + node.value + '\': String Literals must be quoted with ' + quoteStyle + ' quotes only.'
				});
			}
		}



		function inspectImportStatement (emitted) {
			const {node} = emitted,
				nodeText = sourceCode.getText (node), expectedString = `${quote}${node.from}${quote}`;

			// If using the expected quote style, exit now.
			if (emitted.exit || nodeText.indexOf (expectedString) > -1) {
				return;
			}

			context.report ({
				node,
				fix (fixer) {
					// TODO: escape string having quotes inside them, ie, use jsStringEscape()

					const start = nodeText.indexOf (node.from) - 1, // index of opening quote
						end = start + 1 + node.from.length; // index of closing quote
					let f = `${nodeText.slice (0, start)}${quote}${node.from}${quote}${nodeText.slice(end+1)}`;

					return fixer.replaceText (node, f);
				},
				location: {
					column: sourceCode.getColumn (node) + nodeText.indexOf (node.from) - 1
				},
				message: `"${node.from}": Import statements must use ${quoteStyle} quotes only.`
			});

		}



		return {
			Literal: inspectLiteral,
			ImportStatement: inspectImportStatement
		};
	}

};
