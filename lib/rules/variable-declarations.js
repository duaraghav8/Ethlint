/**
 * @fileoverview Ensure that names 'l', 'O' & 'I' are not used for variables
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var disallowedNames = ['l', 'O', 'I'];

		context.on ('VariableDeclarator', function (emitted) {
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
		});

		context.on ('DeclarativeExpression', function (emitted) {
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
		});

	}

};