/**
 * @fileoverview Schema of the error object supplied rule-context to Solium via Solium.report() method.
 * NOTE: This is still not the final error message object sent to user.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Ajv = require("ajv"),
    astNode = require("./ast-node"),
    coreRule = require("./core-rule").Schema,
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
        ruleName: { type: "string", minLength: 1 },
        ruleMeta: coreRule.properties.meta,
        type: { type: "string", enum: ["error", "warning"] },

        location: {
            type: "object",
            properties: {
                line: { type: "integer", minimum: 1 },	// line starts from 1
                column: { type: "integer", minimum: 0 }	// column starts from 0
            },
            additionalProperties: false
        }

    },

    required: ["message", "node", "ruleName", "ruleMeta", "type"],
    additionalProperties: false

};


module.exports = {
    schema: Schema, validationFunc: SchemaValidator.compile(Schema)
};