/**
 * @fileoverview A pipeline to provide the main linter with rule definitions
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var fs = require ('fs'),
	path = require ('path'),
	jsUtils = require ('./utils/js-utils'),
	ruleLoader = require ('./utils/rule-loader'),
	soliumRules = require ('../config/solium').rules,	//list of all rules available inside solium
	rules = {};

var loadRulesFromUpstream = ruleLoader.loadRulesFromUpstream;

var RULES_DIR = path.join (__dirname, ruleLoader.constants.SOLIUM_CORE_RULES_DIRNAME),
	CWD = process.cwd (),
	JS_EXT = '.js';

// Utilities for getRuleSeverity()
var configSchema = require ('../config/schemas/config'),
	SchemaValidator = new require ('ajv') ({ allErrors: true }),
	severityValueSchemas = configSchema.properties.rules.patternProperties ['^.+$'].oneOf;

var isValidSeverityString = SchemaValidator.compile (severityValueSchemas [0]),
	isValidSeverityInt = SchemaValidator.compile (severityValueSchemas [1]),
	isValidSeverityArray = SchemaValidator.compile (severityValueSchemas [2]);

module.exports = {

	/**
	 * Reset state so previous lint's configuration doesn't interfere with the next one
	 * @returns {void}
	 */
	reset: function () {
		rules = {};	//clear rule cache before populating them
	},

	/**
	 * [DEPRECATED]
	 * load the user-specified rules from the rules/ directory and custom rules from specified file
	 * This function loads rule information from a DEPRECATED config format.
	 * @param {Object} userRules object whose keys specify the rule name and boolean values specify whether to include it
	 * @param {String} customRulesFilePath The file from where definitions of user-defined rules are loaded
	 * @returns {Object} userRules Definitions of all user-requested rules. Throws error if a rule in userRules is not amongst available rules
	 */
	loadUsingDeprecatedConfigFormat: function (userRules, customRulesFilePath, noReset) {
		var ruleFiles, idCounter = 1, customRules = {};

		if (!jsUtils.isStrictlyObject (userRules)) {
			throw new Error ('Invalid rules object');
		}

		try {
			ruleFiles = fs.readdirSync (RULES_DIR);
		} catch (e) {
			throw new Error ('Unable to read ' + RULES_DIR + ':\n' + e.stack);
		}

		if (customRulesFilePath && typeof customRulesFilePath === 'string') {
			if (!path.isAbsolute (customRulesFilePath)) {
				customRulesFilePath = path.join (CWD, customRulesFilePath);
			}

			try {
				customRules = require (customRulesFilePath);
			} catch (e) {
				throw new Error ('Unable to read ' + customRulesFilePath + ':\n' + e);
			}
		}

		!noReset && this.reset ();

		ruleFiles.forEach (function (filename) {
			var ruleName = filename.slice (0, -JS_EXT.length),
				absoluteRuleFilePath = path.join (RULES_DIR, filename);

			if (path.extname (filename) === JS_EXT && userRules [ruleName]) {
				try {
					rules [ruleName] = require (absoluteRuleFilePath);
				} catch (e) {
					throw new Error ('Unable to read ' + absoluteRuleFilePath + ':\n' + e);
				}
			}
		});

		Object.keys (userRules).forEach (function (key) {

			/**
			 * If a rule is set to false, remove it from config object.
			 * Otherwise, include its definition if its the name of a built-in rule
			 */
			if (!userRules [key]) {
				delete userRules [key];
			} else if (soliumRules [key] && soliumRules [key].enabled) {

				userRules [key] = soliumRules [key];
				Object.assign (userRules [key], {
					id: idCounter++,
					custom: false
				});

			}

		});

		Object.keys (customRules).forEach (function (ruleName) {

			//skip if user has not enabled custom rule ruleName
			if (!userRules [ruleName]) {
				return;
			}

			if (rules [ruleName]) {
				/**
				 * Gets executed when a pre-defined and a custom rule have a name clash.
				 * The custom rule over-writes the pre-defined one.
				 */
			}

			rules [ruleName] = {
				verify: customRules [ruleName]
			};

			//in case of rule name clash, assign the custom rule the same id as the pre-defined rule with the same name
			userRules [ruleName] = {
				enabled: true,
				custom: true,
				type: 'custom-error',
				id: (
					userRules [ruleName] && userRules [ruleName].id ?
					userRules [ruleName].id : idCounter++
				)
			};

		});

		//if there is still a rule set to true and not yet expanded, its an invalid rule (neither built-in nor custom)
		Object.keys (userRules).forEach (function (ruleName) {
			if (typeof userRules [ruleName] !== 'object') {
				throw new Error ('Rule ' + ruleName + ' was not found');
			}
		});

		return userRules;
	},

	/**
	 * Load Solium rules as described in the configuration object provided.
	 * @param {Object} config The configuration object (read from soliumrc) that describes what rules the user wishes to apply.
	 * @param {Boolean} noReset Determines whether to re-initilize internal variables or not. If this param has a false-equivalent value, data is reset.
	 * @returns {Object} userRules Definitions of all user-requested rules. Throws error if a rule in userRules is not amongst available rules
	 */
	load: function (config, noReset) {
		var ruleDescriptions = {}, ruleConfigs = {}, getRuleSeverity = this.getRuleSeverity;

		!noReset && this.reset ();

		if (config.extends) {
			try {
				Object.assign (ruleConfigs, ruleLoader.resolveUpstream (config.extends));
			} catch (e) {
				throw new Error (
					'An error occured while trying to resolve dependancy "' + config.extends + '": ' + e.stack);
			}
		}

		// If both extends & rules attributes exist, the rules imported from "rules" attr will override any rules
		// imported from "extends" in case of a name clash.
		if (config.rules && Object.keys (config.rules).length) {
			Object.assign (ruleConfigs, config.rules);
		}

		// Remove all rules that are disabled.
		Object.keys (ruleConfigs).forEach (function (name) {
			getRuleSeverity (ruleConfigs [name]) < 1 && delete ruleConfigs [name];
		});

		// Load all enabled rules.
		try {
			Object.assign (rules, ruleLoader.load (Object.keys (ruleConfigs)));
		} catch (e) {
			throw new Error ('An error occured while trying to load rules: ' + e.stack);
		}

		// Use rule definitions & configs to generate ruleDescriptions
		Object.keys (rules).forEach (function (name) {
			var desc = {
				description: rules [name].meta.docs.description,
				recommended: rules [name].meta.docs.recommended,
				type: (getRuleSeverity (ruleConfigs [name]) === 1) ? 'warning' : 'error'
			};

			// Only set "options" attribute if the rule config is an array of length is at least 2.
			if (Array.isArray (ruleConfigs [name] && ruleConfigs [name].length > 1)) {
				desc.options = ruleConfigs [name].slice (1);
			}

			ruleDescriptions [name] = desc;
		});

		return ruleDescriptions;
	},

	/**
	 * context object Constructor to set read-only properties and provide additional functionality to the rules using it
	 * @returns {Object} rule Rule object containing function to execute rule, exported by the rule's file
	 */
	get: function (name) {
		if (name && typeof name === 'string') {
			return rules [name];
		} else {
			throw new Error (name + ' is an invalid argument');
		}
	},

	/**
	 * Get severity value for a rule from its given configuration description.
	 * @param {Integer|String|Array} ruleConfig configuration for the rule (picked up from soliumrc)
	 * @returns {Integer} severity Either 0 (rule turned off), 1 (warning) or 2 (error).
	 */
	getRuleSeverity: function getRuleSeverity (ruleConfig) {
		if (isValidSeverityInt (ruleConfig)) {
			return ruleConfig;
		}

		if (isValidSeverityString (ruleConfig)) {
			return ({
				'off': 0, 'warning': 1, 'error': 2
			}) [ruleConfig];
		}

		if (isValidSeverityArray (ruleConfig)) {
			return getRuleSeverity (ruleConfig [0]);
		}

		throw new Error ('Invalid configuration value for rule.');
	}

};