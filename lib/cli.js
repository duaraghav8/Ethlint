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
	errorReporter = require ('./cli-utils/error-reporter'),
	soliumRules = require ('../config/solium.json').rules,
	version = require ('../package.json').version;

var CWD = process.cwd (),
	CONFIG_FILENAME = '.soliumrc.json';

var errorCodes = {
	NO_SOLIUMRC: 1,
	INIT_FAILED: 3
};

/**
 * Create default solium configuration JSON in user's current working directory.
 * This file enables all the built-in lint rules
 */
function createDefaultConfigJSON () {
	var config = {
		'custom-rules-filename': null,
		rules: {}
	};

	Object.keys (soliumRules).forEach (function (rulename) {
		config.rules [rulename] = true;
	});

	try {
		fs.writeFileSync (
			path.join (CWD, CONFIG_FILENAME),
			JSON.stringify (config, null, 2)
		);
	} catch (e) {
		console.log (
			'An error occured while creating ' + CONFIG_FILENAME + ':\n' + e
		);
		process.exit (errCodes.INIT_FAILED);
	}
}

/**
 * Function that calls Solium object's linter based on user settings
 * @param {Object} userConfig User's configurations that contain information about which linting rules to apply
 * @param {String} filename (optional) The single file to be linted. If not given, we lint the entire directory's (and sub-directories') solidity files
 */
function lint (userConfig, fileOrDir, ignore) {
	var filesToLint, itemsToIgnore;

	//If filename is provided, lint it. Otherwise, lint over current directory & sub-directories
	if (fileOrDir.file) {
		filesToLint = [fileOrDir.file];
	} else {
		filesToLint = traverse (fileOrDir.dir || CWD, ignore);
	}

	filesToLint.forEach (function (codeFileName) {

		var sourceCode = '', lintErrors;

		try {
			sourceCode = fs.readFileSync (
				codeFileName, 'utf8'
			);
		} catch (e) {
			console.log (
				'[ERROR] Unable to read ' + codeFileName + ': ' + e
			);
		}

		try {
			lintErrors = solium.lint (sourceCode, userConfig);
		} catch (e) {
			console.log (
				'An error occured while running the linter:\n' + e
			);
			return;
		}

		errorReporter.report (codeFileName, lintErrors);

	});
}

module.exports = {

	execute: function execute (programArgs) {

		cli
			.version (version)
			.usage ('[options] <keyword>')

			.option ('-i, --init', 'Create default rule configuration')
			.option ('-f, --file [filename]', 'Specify a file whose code you wish to lint')
			.option ('-d, --dir [dirname]', 'Specify the directory to look for Solidity files in')
			.option ('--hot', 'Enable Hot Loading (Hot Swapping)')
			.option ('--ignore [filename]', 'Specifiy the file that contains a list of files and folders to ignore during linting')
			.option ('--ignorefile [filename]', 'Specifiy the solidity file to ignore while linting')

			.parse (programArgs);

		if (cli.init) {
			createDefaultConfigJSON ();
		} else {
			var userConfig, ignore;

			try {
				userConfig = require (
					path.join (CWD, CONFIG_FILENAME)
				);
			} catch (e) {
				console.log (
					'ERROR! Couldn\'t find ' + CONFIG_FILENAME + ' in the current directory.\nUse solium --init to create one.'
				);
				process.exit (errorCodes.NO_SOLIUMRC);
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

			if (cli.ignore) {

				if (!path.isAbsolute (cli.ignore)) {
					cli.ignore = path.join (CWD, cli.ignore);
				}

				try {
					ignore = fs.readFileSync (cli.ignore, 'utf8').split ('\n');
				} catch (e) {
					console.log (
						'There was an error trying to read \'' + cli.ignore + '\':\n' + e
					);
				}

			} else if (cli.ignorefile) {
				ignore = cli.ignorefile;
			}

			lint (userConfig, { file: cli.file, dir: cli.dir}, ignore);

			if (cli.hot) {

				var spy = chokidar.watch (CWD);

				spy.on ('change', function () {
					lint (userConfig, { file: cli.file, dir: cli.dir}, ignore);	//lint on subsequent changes (hot)
					console.log (Array (50).join ('X') + '\n');
				});

			}

		}

	}

};