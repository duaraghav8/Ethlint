/**
 * @fileoverview Schema of the latest Solium core rule object.
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

		verify: true

	},

	required: ['meta', 'verify'],

	additionalProperties: false
};


module.exports = Schema;