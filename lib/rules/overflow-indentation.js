/**
 * @fileoverview In the case of 4+ elements in the same line require they are instead put on a single line each
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

function getIndentString (indentStyle, level) {
	return Array (level + 1).join (indentStyle);
}

module.exports = {

	verify: function (context) {

        var MAX_IN_SINGLE_LINE = 3;

		var sourceCode = context.getSourceCode ();

        context.on ('ArrayExpression', function (emitted) {
			var node = emitted.node, elements = node.elements;
			var endingLineNum = sourceCode.getEndingLine (node);

			if (emitted.exit) {
				return;
			}

			if (sourceCode.getLine (node) === endingLineNum) {
				if (elements.length > MAX_IN_SINGLE_LINE) {
					context.report ({
						node: node,
						message: 'In case of more than 3 elements, array expression needs to be spread over multiple lines with 1 element per line.'
					});
				}
				return;
			}
		});

        context.on ('StructDeclaration', function (emitted) {
			var node = emitted.node,
				body = node.body || [],
				endingLineNum = sourceCode.getEndingLine (node);

			if (emitted.exit) {
				return;
			}

			//raise an error and stop linting if more than 3 attributes exist & declaration is on single line
			if (sourceCode.getLine (node) === endingLineNum) {
				if (body.length > MAX_IN_SINGLE_LINE) {
					context.report ({
						node: node,
						message: '\'' + node.name + '\': In case of more than 3 properties, struct declaration needs to be spread over multiple lines with 1 property per line.'
					});
				}
				return;
			}
        });

        //function params (if on multiple lines)
		context.on ('FunctionDeclaration', function (emitted) {
			var node = emitted.node, params = node.params || [];

			var startLine = sourceCode.getLine (node),
				lastArgLine = params.length ? sourceCode.getEndingLine (params.slice (-1) [0]) : startLine;

			if (emitted.exit) {
				return;
			}

			if (startLine === lastArgLine) {
				if (params.length > MAX_IN_SINGLE_LINE) {
					context.report ({
						node: node,
						message: 'Function \'' + node.name + '\': in case of more than 3 parameters, drop each into its own line.'
					});
				}
				return;
			}
        });
        
		context.on ('CallExpression', function (emitted) {

			var node = emitted.node;
			var endingLineNum = sourceCode.getEndingLine (node);

			if (emitted.exit) {
				return;
			}

			if (sourceCode.getLine (node) === endingLineNum) {
				if (node.arguments.length > MAX_IN_SINGLE_LINE) {
					context.report ({
						node: node,
						message: 'Function \'' + node.callee.name + '\': in case of more than 3 arguments, drop each into its own line.'
					});
				}
				return;
			}
		});
    }
}