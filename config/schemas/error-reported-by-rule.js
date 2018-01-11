/**
 * @fileoverview Schema of the error object supplied by a rule to rule-context via report() method.
 * NOTE: This is NOT the final error object supplied to solium & then to user.
 *
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

// A fully qualified object for this Schema is:
/*
{
	"message": "Hello World",
	"node": {
		"type": "Literal",
		"start": 0,
		"end": 90
	},
	"location": {
		"line": 3,
		"column": 90
	},
	"fix": function (fixer) {
		// ...
	}
}
*/

let Ajv = require("ajv"),
    astNode = require("./ast-node"),
    SchemaValidator = new Ajv({ allErrors: true });


SchemaValidator.addKeyword("shouldBeOfTypeFunction", {
    validate: function(isSet, attr) {
        return isSet === (typeof attr === "function");
    }
});

let Schema = {

    type: "object",
    properties: {

        message: { type: "string", minLength: 1 },
        node: astNode,
        fix: { shouldBeOfTypeFunction: true },
        location: {
            type: "object",
            properties: {
                line: { type: "integer", minimum: 1 },	// line starts from 1
                column: { type: "integer", minimum: 0 }	// column starts from 0
            },
            additionalProperties: false
        }

    },

    required: ["message", "node"],
    additionalProperties: false

};


module.exports = {
    schema: Schema, validationFunc: SchemaValidator.compile(Schema)
};