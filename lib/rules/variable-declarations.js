/**
 * @fileoverview Ensure that names 'l', 'O' & 'I' are not used for variables
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var disallowedNames = ['l', 'O', 'I'];

		function inspectVariableDeclarator (emitted) {
			var node = emitted.node,
				variableName = node.id.name;

			if (emitted.exit) {
				return;
			}

			disallowedNames.forEach (function (disallowedName) {
				if (variableName === disallowedName) {
					context.report ({
						node: node,
						message: 'Using \'' + variableName + '\' for a variable name should be avoided.'
					});
				}
			});
		}

		function inspectDeclarativeExpression (emitted) {
			var node = emitted.node,
				variableName = node.name;

			if (emitted.exit) {
				return;
			}

			disallowedNames.forEach (function (disallowedName) {
				if (variableName === disallowedName) {
					context.report ({
						node: node,
						message: 'Using \'' + variableName + '\' for a variable name should be avoided.'
					});
				}
			});
		}

		context.on ('VariableDeclarator', inspectVariableDeclarator);
		context.on ('DeclarativeExpression', inspectDeclarativeExpression);

	}

};