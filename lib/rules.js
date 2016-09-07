/**
 * @fileoverview A pipeline to provide the main linter with rule definitions
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var fs = require ('fs'),
	path = require ('path'),
	jsUtils = require ('./utils/js-utils'),
	soliumRules = require ('../config/solium').rules,	//list of all rules available inside solium
	rules = {};

var RULES_DIR = path.join (__dirname, 'rules'),
	CWD = process.cwd (),
	JS_EXT = '.js';

module.exports = {

	/**
	 * Reset state so previous lint's configuration doesn't interfere with the next one
	 * @returns {void}
	 */
	reset: function () {
		rules = {};	//clear rule cache before populating them
	},

	/**
	 * load the user-specified rules from the rules/ directory and custom rules from specified file
	 * @param {Object} userRules object whose keys specify the rule name and boolean values specify whether to include it
	 * @param {String} customRulesFilePath The file from where definitions of user-defined rules are loaded
	 * @returns {Object} userRules Definitions of all user-requested rules. Throws error if a rule in userRules is not amongst available rules
	 */
	load: function (userRules, customRulesFilePath, noReset) {
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
	 * context object Constructor to set read-only properties and provide additional functionality to the rules using it
	 * @returns {Object} rule Rule object containing function to execute rule, exported by the rule's file
	 */
	get: function (name) {
		if (name && typeof name === 'string') {
			return rules [name];
		} else {
			throw new Error (name + ' is an invalid argument');
		}
	}

};