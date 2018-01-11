/**
 * @fileoverview Schema of Solium v1 Sharable Config.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

// A fully qualified object for this Schema is:
/*
{
	"rules": {
		"pragma-on-top": [1],
		"quotes": ["error", "double"],
		"indentation": [2, "tab"]
	}
}
*/

"use strict";

let rulesSchema = require("./config").properties.rules;


let Schema = {

    type: "object",

    properties: {
        rules: rulesSchema
    },

    required: ["rules"],
    additionalProperties: false

};


module.exports = Schema;