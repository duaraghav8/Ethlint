/**
 * @fileoverview Utility functions to examine the state of a configuration object obtained from soliumrc.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Ajv = require ('ajv'),
	jsUtils = require ('./js-utils'),
	currentConfigSchema = require ('../../config/schemas/config'),
	deprecatedConfigSchema = require ('../../config/schemas/deprecated/config-v0.5.5');

var SchemaValidator = new Ajv ({ allErrors: true }),
	validateCurrentConfig = SchemaValidator.compile (currentConfigSchema),
	validateDepConfig = SchemaValidator.compile (deprecatedConfigSchema);

module.exports = {

	/**
	 * Determine whether a valid configuration object was passed by user.
	 * @param {Object} config The config object to examine.
	 * @returns {Boolean} decision True if config is valid, false otherwise.
	 */
	isValid: function (config) {
		return (Boolean (validateCurrentConfig (config)) || Boolean (validateDepConfig (config)));
	},

	/**
	 * Determine whether the configuration object passed by user is a current one or a deprecated one.
	 * @param {Object} config The config object to examine.
	 * @returns {Boolean} decision Truue if config is deprecated, false otherwise.
	 */
	isFormatDeprecated: function (config) {
		// This function assumes that a VALID config object is passed, ie, the object has passed isValid() test above.
		return !validateCurrentConfig (config);
	}

};