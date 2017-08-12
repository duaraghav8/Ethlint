/**
 * @fileoverview Utility functions for examining a rule object
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Ajv = require ('ajv'),
	coreRuleSchema = require ('../../config/schemas/core-rule');

var SchemaValidator = coreRuleSchema.SchemaValidator,
	validateCoreRule = SchemaValidator.compile (coreRuleSchema.Schema);

module.exports = {

	/**
	 * Determine whether the supplied argument qualifies as a core rule object
	 * @param {Object} ruleObject The object to validate
	 * @returns {Boolean} isValid True if object is a valid core solium rule, false otherwise.
	 */
	isAValidRuleObject: validateCoreRule

};