/**
 * @fileoverview Utility functions to examine the state of a configuration object obtained from soliumrc.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Ajv = require("ajv"),
    currentConfigSchema = require("../../config/schemas/config"),
    deprecatedConfigSchema = require("../../config/schemas/deprecated/config-v0.5.5"),
    sharableConfigSchema = require("../../config/schemas/sharable-config");

let SchemaValidator = new Ajv({ allErrors: true }),
    validateCurrentConfig = SchemaValidator.compile(currentConfigSchema),
    validateDepConfig = SchemaValidator.compile(deprecatedConfigSchema),
    validateSharableConfig = SchemaValidator.compile(sharableConfigSchema);


module.exports = {

    /**
	 * Determine whether a valid configuration object was passed by user.
	 * @param {Object} config The config object to examine.
	 * @returns {Boolean} decision True if config is valid, false otherwise.
	 */
    isValid: function(config) {
        return (validateCurrentConfig(config) || validateDepConfig(config));
    },

    /**
	 * Determine whether the configuration object passed by user is a current one or a deprecated one.
	 * @param {Object} config The config object to examine.
	 * @returns {Boolean} decision True if config is deprecated, false otherwise.
	 */
    isFormatDeprecated: function(config) {
        // This function assumes that a VALID config object is passed, ie, the object has passed isValid() test above.
        return !validateCurrentConfig(config);
    },

    /**
	 * Determine whether the supplied config is a valid Sharable Config
	 * @param {Object} config The config object to examine.
	 * @returns {Boolean} decision True if config is valid, false otherwise.
	 */
    isAValidSharableConfig: validateSharableConfig

};
