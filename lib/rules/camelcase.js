/**
 * @fileoverview Ensure that all constants (and only constants) contain only upper case letters and underscore
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var camelCaseRegEx = /^[A-Z][a-z]+[a-zA-Z]*[a-z]$/;

		var eventsToWatch = [
			'ContractStatement',
			'LibraryStatement',
			'ModifierName',
			'ModifierDeclaration',
			'StructDeclaration'
		];

		eventsToWatch.forEach (function (event) {
			context.on (event, function (emitted) {
				var node = emitted.node;

				if (emitted.exit) {
					return;
				}

				if (!camelCaseRegEx.test (node.name)) {
					context.report ({
						node: node,
						message: 'Identifier name doesn\'t follow the CamelCase notation'
					});
				}
			});
		});

	}

};