/**
 * @fileoverview Main Solium object definition
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var solidityParser = require ('solparse'),
	solExplore = require ('sol-explore'),
	util = require ('util'),

	EventEmitter = require ('events').EventEmitter,
	EventGenerator = require ('./utils/node-event-generator'),
	RuleContext = require ('./rule-context'),
	SourceCode = require ('./utils/source-code-utils'),

	RuleFixer = require ('./autofix/rule-fixer'),
	SourceCodeFixer = require ('./autofix/source-code-fixer'),

	rules = require ('./rules'),
	astUtils = require ('./utils/ast-utils'),
	jsUtils = require ('./utils/js-utils'),
	configInspector = require ('./utils/config-inspector'),
	ruleInspector = require ('./utils/rule-inspector'),

	isErrObjectValid = require ('../config/schemas/error-supplied-to-solium').validationFunc,
	isValidFixerPacket = require ('../config/schemas/fixer-packet').validationFunc;

module.exports = (function () {

	var Solium = Object.create (new EventEmitter ()),
		messages = [], sourceCodeText = '', currentConfig = null;

	/**
	 * Initialize all global variables: ensure nothing from the previous lint() gets carried to the next lint()
	 * @returns {void}
	 */
	Solium.reset = function reset () {
		Solium.removeAllListeners ();
		messages = [];
		sourceCodeText = '';
		currentConfig = {};
	};

	/**
	 * Function called for linting the code by external application(s) using the Solium object
	 * @param {(String|Buffer)} sourceCode The Source Code to lint
	 * @param {Object} config An object that specifies the rules to use and path of file containing custom rule definitions
	 * @returns {Array} errorObjects Array of objects, each containing lint error messages and supporting info, empty if no errors
	 */
	Solium.lint = function lint (sourceCode, config, noReset) {
		var nodeEventGenerator = new EventGenerator (Solium), AST = {}, errorObjects;

		if (typeof sourceCode === 'object' && sourceCode.constructor.name === 'Buffer') {
			sourceCode = sourceCode.toString ();
		}

		if (!(sourceCode && typeof sourceCode === 'string')) {
			throw new Error ('A valid source code string was not provided.');
		}

		if (!configInspector.isValid (config)) {
			throw new Error (
				'A valid configuration object was not passed.' +
				' Please see http://solium.readthedocs.io/en/latest/user-guide.html#configuring-the-linter' + 
				' for a valid config format.'
			);
		}

		!noReset && Solium.reset ();

		sourceCodeText = sourceCode;
		astUtils.init (sourceCodeText);
		currentConfig = JSON.parse (JSON.stringify (config));	// deep copy config object
		currentConfig.options = currentConfig.options || {};	// ensure "options" attr always exists in config

		//load meta information of rules
		if (configInspector.isFormatDeprecated (currentConfig)) {
			var crf = currentConfig ['custom-rules-filename'];

			Solium.reportInternal ({
				type: 'warning',
				message: '[DEPRECATED] You are using a deprecated soliumrc configuration format. ' +
					'Please see http://solium.readthedocs.io/en/latest/user-guide.html#migrating-to-v1-0-0' +
					' to migrate from Solium v0 to v1.'
			});

			crf && Solium.reportInternal ({
				type: 'warning',
				message: '[DEPRECATED] Attribute "custom-rules-filename" is now deprecated. ' +
					'Rules from ' + crf + ' were not loaded. Plugins are supported v1 onward. Please see ' +
					'http://solium.readthedocs.io/en/latest/user-guide.html#custom-rule-injection-is-now-deprecated'
			});

			currentConfig.rules = rules.loadUsingDeprecatedConfigFormat (currentConfig.rules, crf);
		} else {
			currentConfig.rules = rules.load (currentConfig);
		}

		Object.keys (currentConfig.rules).forEach (function (name) {
			var rule = rules.get (name), currentRuleConfig = currentConfig.rules [name];

			// Check for validity of exposed rule object
			if (!ruleInspector.isAValidRuleObject (rule)) {
				throw new Error ('A valid definition for rule "'
					+ name + '" was not provided. AJV message:\n' + util.inspect (ruleInspector.isAValidRuleObject.errors));
			}

			// Check for validity of options passed to the rule via soliumrc (if options were passed)
			if (currentRuleConfig.options && !ruleInspector.areValidOptionsPassed (currentRuleConfig.options, rule.meta.schema)) {
				throw new Error ('Invalid options were passed to rule "' + name + '".');
			}

			// If rule contains deprecated tag & is set to true, display deprecation notice.
			if (rule.meta.deprecated) {
				var message = '[DEPRECATED] Rule "' + name + '" is deprecated.';

				if (rule.meta.docs.replacedBy) {
					message += ' Please use ' + rule.meta.docs.replacedBy.map (function (rn) {
						return '"' + rn + '"';
					}).join (', ') + ' instead.';
				}

				Solium.reportInternal ({ type: 'warning', message: message });
			}

			// Call rule implementation's create() to retrieve the node names to listen for & their handlers
			// and subscribe them to the event emitter.
			var ruleNodeListeners = rule.create (new RuleContext (name, currentRuleConfig, rule.meta, Solium));

			if (!ruleInspector.isAValidRuleResponseObject (ruleNodeListeners)) {
				throw new Error (
					'A rule implementation\'s response must be an object whose keys are AST Nodes to listen for and values their corresponding handler functions. AJV message:\n'
					+ util.inspect (ruleInspector.isAValidRuleResponseObject.errors)
				);
			}

			Object.keys (ruleNodeListeners).forEach (function (node) {
				Solium.on (node, ruleNodeListeners [node]);
			});
		});

		try {
			AST = solidityParser.parse (sourceCode);	
		} catch (e) {
			throw new Error ('An error occured while parsing the source code: ' + e.message);
		}

		/**
		 * Perform depth-first traversal of the AST and notify rules upon entering & leaving nodes
		 * Each node has a type property which serves as the Event's name.
		 * This allows rules to listen to the type of node they wish to test.
		 */
		solExplore.traverse (AST, {
			enter: function (node, parent) {
				node.parent = parent;	//allow the rules to access immediate parent of current node
				nodeEventGenerator.enterNode (node);
				delete node.parent;
			},

			leave: function (node) {
				nodeEventGenerator.leaveNode (node);
			}
		});

		// Remove all internal issues if user didn't ask for them.
		if (!currentConfig.options.returnInternalIssues) {
			messages = messages.filter (function (msg) {
				return !msg.internal;
			});
		}

		//sort errors by line (column if line is same)
		messages.sort (function (a, b) {
			var lineDiff = a.line - b.line;
			return (
				lineDiff ? lineDiff : (a.column - b.column)
			);
		});
		
		errorObjects = messages;
		messages = [];	//reset messages array to avoid carry-forward of error objects to other files

		return errorObjects;

	};

	/**
	 * Lints, then applies fixes specified by rules and returns fixed code.
	 * @param {(String|Buffer)} sourceCode The Source Code to lint.
	 * @param {Object} config An object that specifies the rules to use and path of file containing custom rule definitions.
	 * @returns {Object} result Returns lint errors, errors that were fixed and final fixed code. 
	 */
	Solium.lintAndFix = function lintAndFix (sourceCode, config, noReset) {
		if (typeof sourceCode === 'object' && sourceCode.constructor.name === 'Buffer') {
			sourceCode = sourceCode.toString ();
		}

		var errorObjects = Solium.lint (sourceCode, config, noReset);
		var fixed = SourceCodeFixer.applyFixes (sourceCode, errorObjects);

		return {
			originalSourceCode: sourceCode,
			fixesApplied: fixed.fixesApplied,
			fixedSourceCode: fixed.fixedSourceCode,
			errorMessages: fixed.remainingErrorMessages
		};
	};

	/**
	 * Function called by any rule that wishes to send error message upon violation in source code
	 * @param {Object} error An object that contains sufficient information to describe the lint error
	 */
	Solium.report = function report (error) {
		if (!isErrObjectValid (error)) {
			throw new Error (util.inspect (error) +
				' is not a valid error object. AJV message:\n' + util.inspect (isErrObjectValid.errors));
		}

		error.location = error.location || {};

		var message = {

			ruleName: error.ruleName,
			type: error.type,	// either 'error' or 'warning'
			node: error.node,
			message: error.message,
			line: error.location.line || astUtils.getLine (error.node),
			column: (error.location.column === 0) ? 0 : (error.location.column || astUtils.getColumn (error.node))

		};

		// If rule supplies a fix, it can be added to the message reported after validation.
		if (error.fix) {
			if (!error.ruleMeta.fixable) {
				Solium.reportInternal ({
					type: 'warning', message: '[WARNING] The fixes supplied by rule "' +
						error.ruleName + '" will be ignored since its "meta" doesn\'t contain the "fixable" property.'
				});
			} else {
				if (typeof error.fix !== 'function') {
					throw new Error ('Rule "' + error.ruleName +
						'": Attribute "fix" (reported as part of the error "' + error.message + '") must be a function.');
				}

				message.fix = error.fix (new RuleFixer (error.ruleMeta.fixable));

				if (message.fix === null) {
					// The rule's fix() was called but doesn't want to apply any fixes in this instance
					delete message.fix;
				} else if (!isValidFixerPacket (message.fix)) {
					// Validate return value of the rule's error's fix() function
					throw new Error ('Rule "' + error.ruleName +
						'": the fix() method for rule error "' + error.message + '" returns an invalid value.');
				}
			}
		}

		messages.push (message);
	};

	/**
	 * Convenience wrapper for Solium modules to report internal issues. It adds the "internal: true" attr to error.
	 * @param {Object} issue Internal issue
	 */
	Solium.reportInternal = function reportInternal (issue) {
		if (!jsUtils.isStrictlyObject (issue)) {
			throw new Error ('Invalid error object');
		}

		// Assign line & column = -1 so messages.sort() brings the internal issues on top
		messages.push (Object.assign (issue, { internal: true, line: -1, column: -1 }));
	};

	/**
	 * Provides the user with program source code wrapped inside a utility object that also provides functions to operate on the code
	 * @returns {Object} sourceCodeObject The SourceCode Object that provides source text & functionality
	 */
	Solium.getSourceCode = function getSourceCode () {
		return new SourceCode (sourceCodeText);
	};

	return Solium;

}) ();
