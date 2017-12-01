/**
 * @fileoverview Utility functions for examining a rule object
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let coreRuleSchema = require("../../config/schemas/core-rule"),
    coreRuleResponseSchema = require("../../config/schemas/core-rule-response");

let SchemaValidator = coreRuleSchema.SchemaValidator,
    validateCoreRule = SchemaValidator.compile(coreRuleSchema.Schema),
    validateCoreRuleResponse = SchemaValidator.compile(coreRuleResponseSchema.Schema);

module.exports = {

    /**
	 * Determine whether the supplied argument qualifies as a core rule object
	 * @param {Object} ruleObject The object to validate
	 * @returns {Boolean} isValid True if object is a valid core solium rule, false otherwise.
	 */
    isAValidRuleObject: validateCoreRule,

    /**
	 * Determine whether the response given by a rule's create() method is a set of valid
	 * node names (event listeners) with their corresponding handler functions.
	 * @param {Object} ruleResponseObject Object to validate
	 * @returns {Boolean} isValid True if object is a valid rule response, false otherwise.
	 */
    isAValidRuleResponseObject: validateCoreRuleResponse,

    /**
	 * Determine whether the options object supplied is valid according to the schema passed.
	 * @param {Array} options List of options
	 * @param {Array} listItemsSchema A list of schema objects defining schema for every item in the options list.
	 * @returns {Boolean} isValid True if options list is valid, false otherwise.
	 */
    areValidOptionsPassed: function(options, listItemsSchema) {
        let validateOptionsList = SchemaValidator.compile({
            type: "array",
            minItems: listItemsSchema.length,
            additionalItems: false,
            items: listItemsSchema
        });

        return validateOptionsList(options);
    }

};