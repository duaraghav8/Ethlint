/**
 * @fileoverview Main CLI object which makes use of the Linter's API to access functionality
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var cli = require ('commander'),
	fs = require ('fs'),
	path = require ('path'),
	chokidar = require ('chokidar'),
	traverse = require ('sol-digger'),
	solium = require ('./solium'),
	soliumRules = require ('../config/solium.json').rules,
	sum = require ('lodash/sum'),
	version = require ('../package.json').version;

var CWD = process.cwd (),
	SOLIUMRC_FILENAME = '.soliumrc.json',
	SOLIUMRC_FILENAME_ABSOLUTE = path.join (CWD, SOLIUMRC_FILENAME),
	SOLIUMIGNORE_FILENAME = '.soliumignore',
	SOLIUMIGNORE_FILENAME_ABSOLUTE = path.join (CWD, SOLIUMIGNORE_FILENAME),
	DEFAULT_SOLIUMIGNORE_PATH = __dirname + '/cli-utils/.default-solium-ignore';

var errorCodes = {
	ERRORS_FOUND: 1,
	NO_SOLIUMRC: 3,
	WRITE_FAILED: 4,
	INVALID_PARAMS: 5,
};

/**
 * Create default configuration files in the user's directory
 * @returns {void}
 */
function setupDefaultUserConfig () {
	createDefaultConfigJSON ();
	createDefaultSoliumIgnore ();
}

/**
 * Synchronously write the passed configuration to the file whose absolute path is SOLIUMRC_FILENAME_ABSOLUTE
 * @param {Object} config User Configuration object
 * @returns {void}
 */
function writeConfigFile (config) {
	try {
		fs.writeFileSync (
			SOLIUMRC_FILENAME_ABSOLUTE,
			JSON.stringify (config, null, 2)
		);
	} catch (e) {
		console.error (
			'An error occurred while writing to ' + SOLIUMRC_FILENAME_ABSOLUTE + ':\n' + e
		);
		process.exit (errorCodes.WRITE_FAILED);
	}
}

/**
 * Insert any rules that are present in SoliumRules.json but not in user's .soliumrc.json's rules
 * @param {Object} userConfig User Configuration object
 * @returns {void}
 */
function synchronizeWithSoliumRules (userConfig) {
	Object.keys (soliumRules).filter (function (rulename) {
		return soliumRules [rulename].enabled;
	}).forEach (function (rulename) {
		//only insert those rules that don't already exist. If a rule exists and is disabled, leave it untouched
		if (!userConfig.rules.hasOwnProperty (rulename)) {
			userConfig.rules [rulename] = true;
		}
	});

	writeConfigFile (userConfig);
}

/**
 * Copy data from cli-utils/.default-solium-ignore to (newly created) .soliumignore in user's root directory
 * @returns {void}
 */
function createDefaultSoliumIgnore () {
	try {
		fs.writeFileSync (
			SOLIUMIGNORE_FILENAME_ABSOLUTE,
			fs.readFileSync (DEFAULT_SOLIUMIGNORE_PATH)
		);
	} catch (e) {
		console.error (
			'An error occurred while writing to ' + SOLIUMIGNORE_FILENAME_ABSOLUTE + ':\n' + e
		);
		process.exit (errorCodes.WRITE_FAILED);
	}
}

/**
 * Create default solium configuration JSON in user's current working directory.
 * This file enables all the built-in lint rules
 */
function createDefaultConfigJSON () {
	var config = {
		'custom-rules-filename': null,
		rules: {}
	};

	Object.keys (soliumRules).filter (function (rulename) {
		return soliumRules [rulename].enabled;
	}).forEach (function (rulename) {
		config.rules [rulename] = true;
	});

	writeConfigFile (config);
}

/**
 * Lint a source code string based on user settings. If autofix is enabled, write the fixed code back to file.
 * @param {String} sourceCode The source code to be linted
 * @param {Object} userConfig User configuration
 * @param {Object} errorReporter The error reporter to use
 * @param {String} fileName (optional) File name to use when reporting errors
 */
function lintString (sourceCode, userConfig, errorReporter, fileName) {
		var lintErrors, fixesApplied;

		try {
			if (userConfig.options.autofix) {
				var result = solium.lintAndFix (sourceCode, userConfig);

				lintErrors = result.errorMessages;
				result.fixesApplied.length && fs.writeFileSync (fileName, result.fixedSourceCode);
				fixesApplied = result.fixesApplied;
			} else {
				lintErrors = solium.lint (sourceCode, userConfig);
			}
		} catch (e) {
			console.error (
				'An error occurred while running the linter on ' + fileName + ':\n' + e.stack
			);
			return;
		}

		//if any lint errors exist, report them
		lintErrors.length &&
			errorReporter.report (fileName || '[stdin]', sourceCode, lintErrors, fixesApplied);

		return lintErrors.length;
}

/**
 * Lint a file based on user settings
 * @param {String} fileName The path to the file to be linted
 * @param {Object} userConfig User configuration
 * @param {Object} errorReporter The error reporter to use
 */
function lintFile (fileName, userConfig, errorReporter) {
	var sourceCode = '';

	try {
		sourceCode = fs.readFileSync (fileName, 'utf8');
	} catch (e) {
		console.error (
			'[ERROR] Unable to read ' + fileName + ': ' + e
		);
	}

	return lintString (sourceCode, userConfig, errorReporter, fileName)
}

/**
 * Function that calls Solium object's linter based on user settings
 * @param {Object} userConfig User's configurations that contain information about which linting rules to apply
 * @param {String} filename (optional) The single file to be linted.
 * If not given, we lint the entire directory's (and sub-directories') solidity files
 */
function lint (userConfig, input, ignore, errorReporter) {
	var filesToLint, errorCount;

	//If filename is provided, lint it. Otherwise, lint over current directory & sub-directories
	if (input.file) {
		filesToLint = [input.file];
	} else if (input.dir) {
		filesToLint = traverse (input.dir, ignore);
	}

	if (filesToLint) {
		errorCount = sum (filesToLint.map (function (file) {
			return lintFile (file, userConfig, errorReporter);
		}));
	} else if (input.stdin) {
		var sourceCode = fs.readFileSync ('/dev/stdin', 'utf-8');
		errorCount = lintString (sourceCode, userConfig, errorReporter);
	} else {
		console.error(
			'ERROR! Must specify input for linter using --file, --dir or --stdin'
		);
		process.exit (errorCodes.INVALID_PARAMS);
	}

	errorReporter.finalize && errorReporter.finalize();

	return errorCount;
}

/**
 * Function responsible for defining all the available commandline options & version information
 * @param {Object} cliObject Commander Object handling the cli
 */
function createCliOptions (cliObject) {
	cliObject
		.version (version)
		.usage ('[options] <keyword>')

		.option ('-i, --init', 'Create default rule configuration')
		.option ('-f, --file [filename]', 'Specify a file whose code you wish to lint')
		.option ('-d, --dir [dirname]', 'Specify the directory to look for Solidity files in')
		.option ('-, --stdin', 'Read input file from stdin')
		.option ('--watch, --hot', 'Enable Hot Loading (Hot Swapping)')
		.option ('-s, --sync', 'Make sure that all Solium rules enabled by default are specified in your ' + SOLIUMRC_FILENAME)
		.option ('-R, --reporter <name>', 'Specify the format in which to report the issues found')
		.option ('--fix', 'Fix the errors where possible.');
}

/**
 * Function that takes a name and returns an error reporter
 * @param {String} name Name of the reporter
 */
function getErrorReporter (name) {
	if (name === 'pretty' || typeof name === 'undefined') {
		return require ('./reporters/pretty');
	} else if (name === 'gcc') {
		return require ('./reporters/gcc');
	}

	throw new Error (
		'Invalid reporter "' + name + '". Valid reporters are "gcc" or "pretty"'
	);
}

/**
 * Entry point to the CLI reponsible for initiating linting process based on command-line arguments
 * @param {Array} programArgs Commandline arguments
 */
function execute (programArgs) {

	var userConfig, ignore;

	createCliOptions (cli);
	cli.parse (programArgs);

	if (cli.init) {
		return setupDefaultUserConfig ();
	}

	try {
		var errorReporter = getErrorReporter (cli.reporter);
	} catch (e) {
		console.error ('ERROR! ' + e.message);
		process.exit (errorCodes.INVALID_PARAMS)
	}

	try {
		userConfig = require (SOLIUMRC_FILENAME_ABSOLUTE);
	} catch (e) {
		console.error (
			'ERROR! Couldn\'t find ' + SOLIUMRC_FILENAME + ' in the current directory.\nUse solium --init to create one.'
		);
		process.exit (errorCodes.NO_SOLIUMRC);
	}

	if (cli.sync) {
		synchronizeWithSoliumRules (userConfig);
		return writeConfigFile (userConfig);
	}

	//if custom rules' file is set, make sure we have its absolute path
	if (
		userConfig ['custom-rules-filename'] &&
		!path.isAbsolute (userConfig ['custom-rules-filename'])
	) {
		userConfig ['custom-rules-filename'] = path.join (
			CWD, userConfig ['custom-rules-filename']
		);
	}

	// Pass cli arguments that modify the behaviour of upstream functions.
	userConfig.options = { autofix: Boolean (cli.fix) };

	//get all files & folders to ignore from .soliumignore
	try {
		ignore = fs.readFileSync (SOLIUMIGNORE_FILENAME_ABSOLUTE, 'utf8').split ('\n');
	} catch (e) {
		console.error (
			'There was an error trying to read \'' + SOLIUMIGNORE_FILENAME_ABSOLUTE + '\':\n' + e
		);
	}

	if (cli.hot) {
		if (cli.stdin) {
			return console.error (
				'ERROR! Cannot watch files when reading from stdin'
			);
		}

		if (cli.fix) {
			return console.error (
				'ERROR! Autofixing is currently not supported in watch mode.'
			);
		}
	}

	var errorCount = lint (userConfig, { file: cli.file, dir: cli.dir, stdin: cli.stdin }, ignore, errorReporter);

	if (cli.hot) {

		var spy = chokidar.watch (CWD);

		spy.on ('change', function () {
			console.log('\x1Bc'); // clear the console
			console.log ('File change detected. Start linting.\n');
			lint (userConfig, { file: cli.file, dir: cli.dir }, ignore, errorReporter);	//lint on subsequent changes (hot)
			console.log ('Linting complete. Watching for file changes.\n');
		});

	} else {

		if (errorCount > 0) {
			process.exit(errorCodes.ERRORS_FOUND);
		}

	}
}

module.exports = {
	execute: execute
};