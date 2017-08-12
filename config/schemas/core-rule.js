/**
 * @fileoverview Schema of the latest Solium core rule object.
 * Since this schema must also validate the type of 'verify' to be a function,
 * we add a special rule "shouldBeOfTypeFunction" and export the SchemaValidator too.
 *
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

// A fully qualified object for this Schema is:
/*
{
	"meta": {
		"docs": {
			"recommended": true,
			"type": "error",
			"description": "This is a rule"
		},

		"schema": [],

		"fixable": "code"
	},

	"verify": function (context) {}
}
*/

var Ajv = require ('ajv'),
	SchemaValidator = new Ajv ({ allErrors: true });

// If this constraint is set to true on any attribute, then that attribute MUST be of type function. If set to false, attr MUST NOT be a function.
SchemaValidator.addKeyword ('shouldBeOfTypeFunction', {
	validate: function (isSet, attr) {
		return isSet === (typeof attr === 'function');
	}
});


var Schema = {
	type: 'object',

	properties: {

		meta: {
			type: 'object',
			properties: {

				docs: {
					type: 'object',
					properties: {
						recommended: { type: 'boolean' },
						type: { type: 'string', enum: ['error', 'warning'] },
						description: { type: 'string', minLength: 1 }
					},
					required: ['recommended', 'type', 'description']
				},

				schema: { type: 'array' },

				fixable: {
					type: 'string', enum: ['code', 'whitespace']
				}

			},
			required: ['docs', 'schema']
		},

		verify: {
			shouldBeOfTypeFunction: true
		}

	},

	required: ['meta', 'verify'],

	additionalProperties: false
};


module.exports = { Schema: Schema, SchemaValidator: SchemaValidator };