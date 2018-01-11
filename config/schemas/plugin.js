/**
 * @fileoverview Schema of latest Solium Plugin.
 * Uses core-rule schema since the structure for core rules & plugins rules is same.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

// A fully qualified object for this Schema is:
/*
{
	"rules": {

		"sample-rule-1": {
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": "This is a rule",
					"replacedBy": ["new-rule"]
				},

				"schema": [],
				"fixable": "code",
				"deprecated": true
			},

			"create": function (context) {}
		}

	},

	"meta": {
		"description": "This is my badass plugin"
	}
}
*/

let coreRule = require("./core-rule"), SchemaValidator = coreRule.SchemaValidator;


let Schema = {

    type: "object",

    properties: {

        rules: {
            type: "object",
            patternProperties: { "^.+$": coreRule.Schema },
            additionalProperties: false
        },

        meta: {
            type: "object",
            properties: {
                description: { type: "string", minLength: 1	}
            },
            required: ["description"],
            additionalProperties: false
        }

    },

    required: ["rules", "meta"],
    additionalProperties: false

};


module.exports = { Schema: Schema, validationFunc: SchemaValidator.compile(Schema) };