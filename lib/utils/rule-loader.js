/**
 * @fileoverview Load specified rule definitions from the given rule repository.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var path = require ('path');

var constants = { SOLIUM_RULESET_ALL: 'solium:all',	SOLIUM_CORE_RULES_DIRNAME: 'rules' };
constants.SOLIUM_CORE_RULES_DIRPATH = '../' + constants.SOLIUM_CORE_RULES_DIRNAME;


/**
 * Given a ruleset name, determine whether its a core set or a sharable config and load the rule config accordingly.
 * @parm {String} upstream The ruleset to resolve
 * @returns {Object} ruleConfigs Set of rule configs exported by the upstream ruleset.
 */
function resolveUpstream (upstream) {
	var coreRulesetRegExp = /^solium:[a-z_]+$/;

	// Determine whether upstream is a solium core ruleset or a sharable config.
	if (coreRulesetRegExp.test (upstream)) {
		try {
			return require ('../../config/rulesets/solium-' + upstream.split (':') [1]).rules;
		} catch (e) {
			throw new Error ('"' + upstream + '" is not a core ruleset.');
		}
	}

	// If flow reaches here, it means upstream is a sharable config.
	// If upstream has not already been downloaded into devDependencies, download it. Then return its exported rule configuration.
}

/**
 * Load rule definitions (rule objects) from Solium's core rule directory
 * @parm {Array} listOfRules List of string that representing rule file names in the rule dir.
 * @returns {Object} ruleDefs Object of key: rule name & value: rule object exported by corresponding Solium rule definition.
 */
function load (listOfRules) {
	var ruleDefs = {};

	listOfRules.forEach (function (name) {
		var ruleFile = path.join (constants.SOLIUM_CORE_RULES_DIRPATH, name);

		try {
			ruleDefs [name] = require (ruleFile);
		} catch (e) {
			throw new Error ('Unable to read ' + ruleFile);
		}
	});

	return ruleDefs;
}


module.exports = { constants: constants, load: load, resolveUpstream: resolveUpstream };