/**
 * @fileoverview Schema of the fixer packet OR array of packets that SHOULD be returned by fix()
 * method inside an error object (reported by a rule).
 *
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

// A fully qualified object for this Schema is:
/*
[
	{range: [0, 0], text: 'hello'},
	{range: [19, 30], text: ''}
]
*/

let Ajv = require("ajv"), validator = new Ajv({ allErrors: true });

let singleFixerPacket = {
    type: "object",

    properties: {

        range: {
            type: "array",
            minItems: 2,
            maxItems: 2,
            items: {
                type: "integer", minimum: 0
            }
        },

        text: {
            type: "string"
        }

    },

    required: ["range", "text"],
    additionalProperties: false
};

let Schema = {
    oneOf: [
        {
            type: "array",
            minItems: 1,
            items: singleFixerPacket
        },

        singleFixerPacket
    ]
};


module.exports = {
    Schema: Schema,
    validationFunc: validator.compile(Schema)
};
