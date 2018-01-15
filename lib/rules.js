/**
 * @fileoverview A pipeline to provide the main linter with rule definitions
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let fs = require("fs"),
    path = require("path"),
    util = require("util"),
    jsUtils = require("./utils/js-utils"),
    ruleLoader = require("./utils/rule-loader"),
    soliumRules = require("../config/solium").rules,	//list of all rules available inside solium
    rules = {};

let RULES_DIR = path.join(__dirname, ruleLoader.constants.SOLIUM_CORE_RULES_DIRNAME),
    JS_EXT = ".js";

// Utilities for getRuleSeverity()
let configSchema = require("../config/schemas/config"),
    SchemaValidator = new require("ajv")({ allErrors: true }),
    severityValueSchemas = configSchema.properties.rules.patternProperties ["^.+$"].oneOf;

let isValidSeverityString = SchemaValidator.compile(severityValueSchemas [0]),
    isValidSeverityInt = SchemaValidator.compile(severityValueSchemas [1]),
    isValidSeverityArray = SchemaValidator.compile(severityValueSchemas [2]),
    isAValidPlugin = require("../config/schemas/plugin").validationFunc;

module.exports = {

    /**
	 * Reset state so previous lint's configuration doesn't interfere with the next one
	 * @returns {void}
	 */
    reset: function() {
        rules = {};	//clear rule cache before populating them
    },

    /**
	 * load the user-specified rules from the rules/ directory and custom rules from specified file
	 * This function loads rule information from a DEPRECATED config format.
	 * @param {Object} userRules object whose keys specify the rule name and boolean values specify whether to include it
	 * @param {String} customRulesFilePath The file from where definitions of user-defined rules are loaded
	 * @returns {Object} userRules Definitions of all user-requested rules. Throws error if a rule in userRules is not amongst available rules
	 */
    loadUsingDeprecatedConfigFormat: function(userRules, customRulesFilePath, noReset) {
        let ruleFiles, idCounter = 1;

        if (!jsUtils.isStrictlyObject(userRules)) {
            throw new Error("Invalid rules object");
        }

        try {
            ruleFiles = fs.readdirSync(RULES_DIR);
        } catch (e) {
            throw new Error("Unable to read " + RULES_DIR + ": " + e.message);
        }

        !noReset && this.reset();

        ruleFiles.forEach(function(filename) {
            let ruleName = filename.slice(0, -JS_EXT.length),
                absoluteRuleFilePath = path.join(RULES_DIR, filename);

            if (path.extname(filename) === JS_EXT && userRules [ruleName]) {
                try {
                    rules [ruleName] = require(absoluteRuleFilePath);
                } catch (e) {
                    throw new Error("Unable to read " + absoluteRuleFilePath + ": " + e.message);
                }
            }
        });

        Object.keys(userRules).forEach(function(key) {

            /**
			 * If a rule is set to false, remove it from config object.
			 * Otherwise, include its definition if its the name of a built-in rule
			 */
            if (!userRules [key]) {
                delete userRules [key];
            } else if (soliumRules [key] && soliumRules [key].enabled) {

                userRules [key] = soliumRules [key];
                Object.assign(userRules [key], {
                    id: idCounter++,
                    custom: false
                });

            }

        });

        //if there is still a rule set to true and not yet expanded, its an invalid rule (neither built-in nor custom)
        Object.keys(userRules).forEach(function(ruleName) {
            if (typeof userRules [ruleName] !== "object") {
                throw new Error("Rule " + ruleName + " was not found");
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
    load: function(config, noReset) {
        let ruleDescriptions = {}, ruleConfigs = {}, getRuleSeverity = this.getRuleSeverity;

        !noReset && this.reset();

        // If plugins are passed, ensure all of them are installed in the same scope as Solium.
        // If not, provide appropriate error messages, instructions & doc links.
        if (config.plugins && config.plugins.length) {
            // eslint-disable-next-line no-inner-declarations
            function validatePlugin(pName) {
                // User must only provide the plugin name, not the solium plugin prefix string
                let plugin, pNameWithoutPrefix = pName;
                pName = ruleLoader.constants.SOLIUM_PLUGIN_PREFIX + pName;

                try {
                    plugin = require(pName);
                } catch (e) {
                    if (e.code === "MODULE_NOT_FOUND") {
                        // Plugin is not installed in Solium's scope
                        throw new Error(
                            "Oops! The Plugin \"" + pName + "\" was not found." +
							"\n\nPlease make sure that it is installed globally by running \"npm install -g " + pName + "\""
                        );
                    }

                    // Some other error
                    throw new Error(
                        "Oops! An error occured while trying to load the plugin \"" +
						pName + "\"." + e.message +
						"\n\nPlease see http://solium.readthedocs.io/en/latest/user-guide.html#plugins for plugin usage."
                    );
                }

                // If plugin was loaded successfully, validate it using schema.
                if (!isAValidPlugin(plugin)) {
                    throw new Error(
                        "\"" + pName + "\" is not a valid plugin." +
						"\nPlease see http://solium.readthedocs.io/en/latest/developer-guide.html#developing-a-plugin" + 
						" for plugin development. AJV Message:\n" +	util.inspect(isAValidPlugin.errors)
                    );
                }

                // Finally, load plugin's default rule configuration into ruleConfigs
                Object.assign(ruleConfigs, ruleLoader.resolvePluginConfig(pNameWithoutPrefix, plugin));
            }

            config.plugins.forEach(validatePlugin);
        }

        if (config.extends) {
            try {
                Object.assign(ruleConfigs, ruleLoader.resolveUpstream(config.extends));
            } catch (e) {
                throw new Error(
                    "An error occured while trying to resolve dependancy \"" + config.extends + "\": " + e.message);
            }
        }

        // If both extends & rules attributes exist, the rules imported from "rules" attr will override any rules
        // imported from "extends" in case of a name clash.
        if (config.rules && Object.keys(config.rules).length) {
            Object.assign(ruleConfigs, config.rules);
        }

        // Remove all rules that are disabled.
        Object.keys(ruleConfigs).forEach(function(name) {
            getRuleSeverity(ruleConfigs [name]) < 1 && delete ruleConfigs [name];
        });


        // Load all enabled rules.
        try {
            Object.assign(rules, ruleLoader.load(Object.keys(ruleConfigs)));
        } catch (e) {
            throw new Error("An error occured while trying to load rules: " + e.message);
        }

        // Use rule definitions & configs to generate ruleDescriptions
        Object.keys(rules).forEach(function(name) {
            if (rules [name] === undefined) {
                // If undefined, it means we didn't require() any rule by this name, ie, none exists
                throw new Error(`"${name}" - No such rule exists.`);
            }

            let desc = {
                description: rules [name].meta.docs.description,
                recommended: rules [name].meta.docs.recommended,
                type: (getRuleSeverity(ruleConfigs [name]) === 1) ? "warning" : "error"
            };

            // Only set "options" attribute if the rule config is an array of length is at least 2.
            if (Array.isArray(ruleConfigs [name]) && ruleConfigs [name].length > 1) {
                desc.options = ruleConfigs [name].slice(1);
            }

            ruleDescriptions [name] = desc;
        });

        return ruleDescriptions;
    },

    /**
	 * context object Constructor to set read-only properties and provide additional functionality to the rules using it
	 * @returns {Object} rule Rule object containing function to execute rule, exported by the rule's file
	 */
    get: function(name) {
        if (name && typeof name === "string") {
            return rules [name];
        } else {
            throw new Error(name + " is an invalid argument");
        }
    },

    /**
	 * Get severity value for a rule from its given configuration description.
	 * @param {Integer|String|Array} ruleConfig configuration for the rule (picked up from soliumrc)
	 * @returns {Integer} severity Either 0 (rule turned off), 1 (warning) or 2 (error).
	 */
    getRuleSeverity: function getRuleSeverity(ruleConfig) {
        if (isValidSeverityInt(ruleConfig)) {
            return ruleConfig;
        }

        if (isValidSeverityString(ruleConfig)) {
            return ({
                "off": 0, "warning": 1, "error": 2
            }) [ruleConfig];
        }

        if (isValidSeverityArray(ruleConfig)) {
            return getRuleSeverity(ruleConfig [0]);
        }

        throw new Error("Invalid configuration value for rule.");
    }

};