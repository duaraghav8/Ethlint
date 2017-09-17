/**
 * @fileoverview Load specified rule definitions from the given rule repository.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var path = require ('path');

var constants = {
	SOLIUM_RULESET_ALL: 'solium:all',
	SOLIUM_CORE_RULES_DIRNAME: 'rules',
	SOLIUM_PLUGIN_PREFIX: 'solium-plugin-'
};

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
	//////////////////////////////////////////////////////////////
	// Logic for enabling sharable configs goes here.
	//////////////////////////////////////////////////////////////
	throw new Error ('"' + upstream + '" is not a valid dependancy. "extends" only accepts "solium:all" for now.');
}

/**
 * Load rule definitions (rule objects) from Solium's core rule directory & from pre-installed linter plugins.
 * @parm {Array} listOfRules List of string that representing rule file names in the rule dir.
 * @returns {Object} ruleDefs Object of key: rule name & value: rule object exported by corresponding Solium rule definition.
 */
function load (listOfRules) {
	var ruleDefs = {};

	listOfRules.forEach (function (name) {
		// If the rule is part of a plugin, first load the plugin assuming that it has already been installed
		// in the same scope as Solium (global/project). Then return the appropriate rule from that plugin.
		if (name.indexOf ('/') > -1) {
			var parts = name.split ('/'),
				pluginName = constants.SOLIUM_PLUGIN_PREFIX + parts [0], ruleName = parts [1], plugin;

			try {
				plugin = require (pluginName);
			} catch (e) {
				throw new Error ('Unable to load Plugin "' + pluginName + '".');
			}

			// No need to verify whether this rule's implementation exists & is valid or not.
			// That is done at a later stage in solium.js itself using rule-inspector.
			// TODO: Examine "peerDependencies" of the plugin to ensure its compatible with current version of Solium.
			return ruleDefs [name] = plugin.rules [ruleName];
		}

		// If we're here, it means the rule is just a regular core rule :)
		var ruleFile = path.join (constants.SOLIUM_CORE_RULES_DIRPATH, name);

		try {
			ruleDefs [name] = require (ruleFile);
		} catch (e) {
			throw new Error ('Unable to read ' + ruleFile);
		}
	});

	return ruleDefs;
}


module.exports = {
	load: load,
	constants: constants,
	resolveUpstream: resolveUpstream
};