/**
 * @fileoverview A pipeline to provide the main linter with rule definitions
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var fs = require ('fs'),
	path = require ('path'),
	jsUtils = require ('./utils/js-utils'),
	loadRulesFromUpstream = require ('./utils/load-rules-from-upstream'),
	soliumRules = require ('../config/solium').rules,	//list of all rules available inside solium
	rules = {};

var RULES_DIR = path.join (__dirname, 'rules'),
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
		/**
		 * Priority: rules object <- extended rules
		 * So if we extend a set of rules, but define a particular rule to be "off" in `rules` object, the rule gets turned off.
		 */
		var getRuleSeverity = this.getRuleSeverity;

		/**
		 * ruleConfigs is optional.
		 * But when passed, it should be guranteed that a key in defs has a corresponding key in ruleConfigs.
		 */
		function getRuleDescsFromDefs (defs, ruleConfigs) {
			var descs = {};

			Object.keys (defs).forEach (function (ruleName) {
				// If a rule doesn't export meta and meta.docs object, fall back to empty objects.
				defs [ruleName].meta = defs [ruleName].meta || { docs: {} };
				defs [ruleName].meta.docs = defs [ruleName].meta.docs || {};

				// Prepare basic object from ruleDef.meta
				var recom = defs [ruleName].meta.docs.recommended;
				var desc = {
					description: defs [ruleName].meta.docs.description || '',
					recommended: (typeof recom === 'undefined' ? true : Boolean (recom))
				};

				// Read rule severity from config.rules. If not provided, fall back to rule.meta. If not provided, default to "error".
				desc.type = (ruleConfigs && ruleConfigs [ruleName] &&
					getRuleSeverity (ruleConfigs [ruleName]) === 1 ? 'warning' : 'error') || defs [ruleName].meta.docs.type || 'error';

				// If user config for a rule is an array, all items after the first are treated as rule params (options).
				if (ruleConfigs && Array.isArray (ruleConfigs [ruleName]) && ruleConfigs [ruleName].length > 1) {
					desc.options = ruleConfigs [ruleName].slice (1);
				}

				descs [ruleName] = desc;
			});

			return descs;
		}


		var ruleDescriptions = {};

		!noReset && this.reset ();

		if (config.extends) {
			Object.assign (rules, loadRulesFromUpstream (config.extends, RULES_DIR));
			Object.assign (ruleDescriptions, getRuleDescsFromDefs (rules));
		}

		// Only proceed if config.rules exists AND has at least 1 entry in it.
		if (config.rules && Object.keys (config.rules).length) {
			// If config.extends exists, it means we're applying a modification on top of the inherited ruleset.
			// If it doesn't, we import the rules turned on in config.rules from "solium:all" ruleset.
			if (config.extends) {
				// If user mentions any rule names that don't exist in the upstream, throw.
				Object.keys (config.rules).forEach (function (ruleName) {
					if (!rules [ruleName]) {
						throw new Error ('\"' + ruleName + '\": No such rule exists in ' + config.extends);
					}

					// If any rules are disabled, delete them from rule definitions & descriptions.
					if (getRuleSeverity (config.rules [ruleName]) === 0) {
						delete rules [ruleName];
						delete ruleDescriptions [ruleName];
						delete config.rules [ruleName];
					}
				});
			} else {
				// Delete all rules which have been turned off.
				Object.keys (config.rules).forEach (function (ruleName) {
					getRuleSeverity (config.rules [ruleName]) < 1 && delete config.rules [ruleName];
				});

				// Load only those rules which exist in config.rules and have severity > 0.
				Object.assign (rules, loadRulesFromUpstream ('solium:all', RULES_DIR, Object.keys (config.rules)));
			}

			Object.assign (ruleDescriptions, getRuleDescsFromDefs (rules, config.rules));
		}

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