/**
 * @fileoverview Ensure that contract, library, modifier and struct names follow CamelCase notation
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var camelCaseRegEx = /^[A-Z][a-z]+[a-zA-Z]*[a-z]$/,
			sourceCode = context.getSourceCode ();

		var eventsToWatch = {
			'ContractStatement': 'contract',
			'LibraryStatement': 'library',
			'ModifierDeclaration': 'modifier',
			'StructDeclaration': 'struct'
		};

		Object.keys (eventsToWatch).forEach (function (event) {
			context.on (event, function (emitted) {
				var node = emitted.node,
					code = sourceCode.getText (node);

				if (emitted.exit) {
					return;
				}

				if (!camelCaseRegEx.test (node.name)) {
					var err = {
						node: node,
						message: '\'' + node.name + '\' doesn\'t follow the CamelCase notation',
						location: {
							column: code.indexOf (
								node.name, eventsToWatch [node.type].length
							)
						}
					};

					context.report (err);
				}
			});
		});

		/**
		 * A few Modifier Names (like 'returns' in 'function foo () returns (uint bar) {}') are exceptions
		 * to CamelCase notation.
		 * They shouldn't be flagged by the linter.
		 */
		context.on ('ModifierName', function (emitted) {
			var node = emitted.node,
				code = sourceCode.getText (node),
				exceptionsToCamelCase = ['returns'];

			function isExempted (name) {
				return exceptionsToCamelCase.indexOf (name) > -1;
			}

			if (emitted.exit || isExempted (node.name)) {
				return;
			}

			if (!camelCaseRegEx.test (node.name)) {
				var err = {
					node: node,
					message: '\'' + node.name + '\' doesn\'t follow the CamelCase notation',
					location: {
						column: code.indexOf (node.name)
					}
				};

				context.report (err);
			}

		});

	}

};