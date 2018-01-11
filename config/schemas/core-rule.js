/**
 * @fileoverview Schema of the latest Solium core rule object.
 * Since this schema must also validate the type of 'create' to be a function,
 * we add a special rule "shouldBeOfTypeFunction" and export the SchemaValidator too.
 *
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

// A fully qualified object for this Schema is:
/*
{
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
*/

let Ajv = require("ajv"),
    SchemaValidator = new Ajv({ allErrors: true });

// If this constraint is set to true on any attribute, then that attribute MUST be of type function. If set to false, attr MUST NOT be a function.
SchemaValidator.addKeyword("shouldBeOfTypeFunction", {
    validate: function(isSet, attr) {
        return isSet === (typeof attr === "function");
    }
});


let Schema = {
    type: "object",

    properties: {

        meta: {
            type: "object",
            properties: {

                docs: {
                    type: "object",
                    properties: {
                        recommended: { type: "boolean" },
                        type: { type: "string", enum: ["error", "warning", "off"] },
                        description: { type: "string", minLength: 1 },

                        replacedBy: {
                            type: "array",
                            minItems: 1,
                            items: { type: "string", minLength: 1 }
                        }
                    },
                    required: ["recommended", "type", "description"]
                },

                schema: { type: "array", items: { type: "object" } },

                fixable: {
                    type: "string", enum: ["code", "whitespace"]
                },

                deprecated: { type: "boolean" }

            },
            required: ["docs", "schema"]
        },

        create: {
            shouldBeOfTypeFunction: true
        }

    },

    required: ["meta", "create"],

    additionalProperties: false
};


module.exports = { Schema: Schema, SchemaValidator: SchemaValidator };