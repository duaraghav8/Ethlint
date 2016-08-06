/**
 * @fileoverview A pipeline to provide the main linter with rule definitions
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var fs = require ('fs'),
	path = require ('path'),
	soliumRules = require ('../config/solium').rules,	//list of all rules available inside solium
	rules = {};

const RULES_DIR = path.join (__dirname, 'rules'),
	JS_EXT = '.js';

module.exports = {

	/**
	 * load the user-specified rules from the rules/ directory and custom rules from specified file
	 * @param {Object} userRules object whose keys specify the rule name and boolean values specify whether to include it
	 * @param {String} customRulesFilePath The file from where definitions of user-defined rules are loaded
	 * @returns {Object} Definitions of all user-requested rules. Throws error if a rule in userRules is not amongst available rules
	 */
	load: function (userRules, customRulesFilePath) {
		var ruleFiles = fs.readdirSync (RULES_DIR),
			idCounter = 1,
			customRules = customRulesFilePath ? require (customRulesFilePath) : {};

		rules = {};	//clear rules before populating them

		ruleFiles.forEach (function (filename) {
			var ruleName = filename.slice (0, -JS_EXT.length);

			if (path.extname (filename) === JS_EXT && userRules [ruleName]) {
				rules [ruleName] = require (path.join (RULES_DIR, ruleName));
			}
		});

		Object.keys (userRules).forEach (function (key) {

			if (!userRules [key]) {
				delete userRules [key];
			} else {
				if (!soliumRules [key]) {
					throw new Error ('Specified rule \'' + key + '\' doesn\'t exist');
				} else {
					userRules [key] = soliumRules [key];

					Object.assign (userRules [key], {
						id: idCounter++,
						custom: false
					});
				} 
			}

		});

		Object.keys (customRules).forEach (function (ruleName) {

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
				type: 'CUSTOM-ERROR',
				id: userRules [ruleName] ? userRules [ruleName].id : idCounter++
			}

		});

		return userRules;
	},

	/**
	 * context object Constructor to set read-only properties and provide additional functionality to the rules using it
	 * @returns {Object} Rule object containing function to execute rule, exported by the rule's file
	 */
	get: function (name) {
		return rules [name];
	}

};