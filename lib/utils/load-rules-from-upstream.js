/**
 * @fileoverview Load specified rule definitions from the given rule repository.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var path = require ('path'),
	fs = require ('fs');

module.exports = function (upstream, SOLIUM_CORE_RULES_DIR, rulesToLoad) {
	var RULES_DIR, ruleDescriptions = {};

	// Only solium:all is supported for now. In future, we can expand to URLs and registries.
	switch (upstream) {
		case 'solium:all':
			RULES_DIR = SOLIUM_CORE_RULES_DIR;
			break;
		default:
			throw new Error ('\"' + upstream + '\": Unknown rule repository. Solium only supports \"solium:all\" for now.')
	}

	// If no rules were specified, load ALL rule definitions from the 
	if (Array.isArray (rulesToLoad)) {
		// Add .js extension to rule names to make file names.
		rulesToLoad = rulesToLoad.map (function (ruleName) {
			return ruleName + '.js';
		});
	} else {
		try {
			// Read rule definitions only from .js files
			rulesToLoad = fs.readdirSync (RULES_DIR).filter (function (filename) {
				return path.extname (filename) === '.js';
			});
		} catch (e) {
			throw new Error ('Unable to read ' + RULES_DIR + ':\n' + e.stack);
		}
	}

	rulesToLoad.forEach (function (filename) {
		var absoluteRuleFilePath = path.join (RULES_DIR, filename);

		try {
			ruleDescriptions [filename.slice (0, -'.js'.length)] = require (absoluteRuleFilePath);
		} catch (e) {
			throw new Error ('Unable to read ' + (absoluteRuleFilePath) + ':\n' + e.stack);
		}
	});

	return ruleDescriptions;
};