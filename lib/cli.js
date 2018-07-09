/**
 * @fileoverview Main CLI object which makes use of the Linter's API to access functionality
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let cli = require("commander"),
    fs = require("fs"),
    fsUtils = require("./utils/fs-utils"),
    path = require("path"),
    { EOL } = require("os"),
    chokidar = require("chokidar"),
    traverse = require("sol-digger"),
    solium = require("./solium"),
    sum = require("lodash/sum"),
    version = require("../package.json").version;

let CWD = process.cwd(),
    SOLIUMRC_FILENAME = ".soliumrc.json",
    SOLIUMRC_FILENAME_ABSOLUTE = path.join(CWD, SOLIUMRC_FILENAME),
    SOLIUMIGNORE_FILENAME = ".soliumignore",
    SOLIUMIGNORE_FILENAME_ABSOLUTE = path.join(CWD, SOLIUMIGNORE_FILENAME),
    DEFAULT_SOLIUMIGNORE_PATH = `${__dirname}/cli-utils/.default-solium-ignore`,
    DEFAULT_SOLIUMRC_PATH = `${__dirname}/cli-utils/.default-soliumrc.json`;

let errorCodes = { ERRORS_FOUND: 1, NO_SOLIUMRC: 3, WRITE_FAILED: 4, INVALID_PARAMS: 5, FILE_NOT_FOUND: 6 };

/**
 * Create default configuration files in the user's directory
 * @returns {void}
 */
function setupDefaultUserConfig() {
    createDefaultConfigJSON();
    createDefaultSoliumIgnore();
}

/**
 * Synchronously write the passed configuration to the file whose absolute path is SOLIUMRC_FILENAME_ABSOLUTE
 * @param {Object} config User Configuration object
 * @returns {void}
 */
function writeConfigFile(config) {
    try {
        fs.writeFileSync(
            SOLIUMRC_FILENAME_ABSOLUTE,
            JSON.stringify(config, null, 2)
        );
    } catch (e) {
        errorReporter.reportFatal(
            `An error occurred while writing to ${SOLIUMRC_FILENAME_ABSOLUTE}:${EOL}${e.message}`);
        process.exit(errorCodes.WRITE_FAILED);
    }
}

/**
 * Copy data from cli-utils/.default-solium-ignore to (newly created) .soliumignore in user's root directory
 * @returns {void}
 */
function createDefaultSoliumIgnore() {
    try {
        fs.writeFileSync(
            SOLIUMIGNORE_FILENAME_ABSOLUTE,
            fs.readFileSync(DEFAULT_SOLIUMIGNORE_PATH)
        );
    } catch (e) {
        errorReporter.reportFatal(
            `An error occurred while writing to ${SOLIUMIGNORE_FILENAME_ABSOLUTE}:${EOL}${e.message}`);
        process.exit(errorCodes.WRITE_FAILED);
    }
}

/**
 * Create default solium configuration JSON in user's current working directory.
 * This file enables all the built-in lint rules
 */
function createDefaultConfigJSON() {
    writeConfigFile(require(DEFAULT_SOLIUMRC_PATH));
}

/**
 * Lint a source code string based on user settings. If autofix is enabled, write the fixed code back to file.
 * @param {String} sourceCode The source code to be linted
 * @param {Object} userConfig User configuration
 * @param {Object} errorReporter The error reporter to use
 * @param {String} fileName (optional) File name to use when reporting errors
 * @returns {Integer} numOfErrors Number of Lint ERRORS that occured.
 */
function lintString(sourceCode, userConfig, errorReporter, fileName) {
    let lintErrors, fixesApplied;

    try {
        if (userConfig.options.autofix) {
            let result = solium.lintAndFix(sourceCode, userConfig);

            lintErrors = result.errorMessages;
            result.fixesApplied.length && fs.writeFileSync(fileName, result.fixedSourceCode);
            fixesApplied = result.fixesApplied;
        } else {
            lintErrors = solium.lint(sourceCode, userConfig);
        }
    } catch (e) {
        // Don't abort in case of a parse error, just report it as a normal lint issue.
        if (e.name !== "SyntaxError") {
            if (userConfig.options.debug) {
                errorReporter.reportFatal(e.stack);
            } else {
                errorReporter.reportFatal(`An error occurred while linting over ${fileName}: ${e.message}`);
            }
            process.exit(errorCodes.ERRORS_FOUND);
        }

        lintErrors = [{
            ruleName: "",
            type: "error",
            message: `Syntax error: unexpected token ${e.found}`,
            line: e.location.start.line,
            column: e.location.start.column
        }];
    }

    // If any lint/internal errors/warnings exist, report them
    lintErrors.length &&
        errorReporter.report(fileName, sourceCode, lintErrors, fixesApplied);

    return lintErrors.reduce(function(numOfErrors, err) {
        return err.type === "error" ? numOfErrors+1 : numOfErrors;
    }, 0);
}

/**
 * Lint a file based on user settings
 * @param {String} fileName The path to the file to be linted
 * @param {Object} userConfig User configuration
 * @param {Object} errorReporter The error reporter to use
 * @returns {Integer} numOfErrors Number of Lint ERRORS that occured (the result returned by lintString())
 */
function lintFile(fileName, userConfig, errorReporter) {
    let sourceCode;

    try {
        sourceCode = fs.readFileSync(fileName, "utf8");
    } catch (e) {
        errorReporter.reportFatal("Unable to read " + fileName + ": " + e.message);
        process.exit(errorCodes.FILE_NOT_FOUND);
    }

    return lintString(sourceCode, userConfig, errorReporter, fileName);
}

/**
 * Function that calls Solium object's linter based on user settings.
 * If not given, we lint the entire directory's (and sub-directories') solidity files.
 * @param {Object} userConfig User's configurations that contain information about which linting rules to apply
 * @param {String} filename (optional) The single file to be linted.
 * @returns {Integer} totalNumOfErrors Total no. of errors found throughout the codebase (directory) linted.
 */
function lint(userConfig, input, ignore, errorReporter) {
    let filesToLint, errorCount;

    //If filename is provided, lint it. Otherwise, lint over current directory & sub-directories
    if (input.file) {

        if (!fsUtils.isFile(input.file)) {
            errorReporter.reportFatal(`${input.file} is not a valid file`);
            process.exit(errorCodes.INVALID_PARAMS);
        }

        filesToLint = [input.file];

    } else if (input.dir) {

        if (!fsUtils.isDirectory(input.dir)) {
            errorReporter.reportFatal(`${input.dir} is not a valid directory`);
            process.exit(errorCodes.INVALID_PARAMS);
        }

        filesToLint = traverse(input.dir, ignore);
    }

    if (filesToLint) {
        errorCount = sum(filesToLint.map(function(file, index) {
            userConfig.options.returnInternalIssues = (index === 0);
            return lintFile(file, userConfig, errorReporter);
        }));
    } else if (input.stdin) {
        // This only works on *nix. Need to fix to enable stdin input in windows.
        let sourceCode = fs.readFileSync("/dev/stdin", "utf-8");

        userConfig.options.returnInternalIssues = true;
        errorCount = lintString(sourceCode, userConfig, errorReporter, "[stdin]");
    } else {
        errorReporter.reportFatal("Must specify input for linter using --file, --dir or --stdin");
        process.exit(errorCodes.INVALID_PARAMS);
    }

    errorReporter.finalize && errorReporter.finalize();
    return errorCount;
}

/**
 * Function responsible for defining all the available commandline options & version information
 * @param {Object} cliObject Commander Object handling the cli
 */
function createCliOptions(cliObject) {
    function collect(val, memo) {
        memo.push(val);
        return memo;
    }

    cliObject
        .version(`Solium version ${version}`)
        .description("Linter to find & fix style and security issues in Solidity smart contracts.")
        .usage("[options] <keyword>")

        .option("-i, --init", "Create default rule configuration files")
        .option("-f, --file [filepath::String]", "Solidity file to lint")
        .option("-d, --dir [dirpath::String]", "Directory containing Solidity files to lint")
        .option("-R, --reporter [name::String]", "Format to report lint issues in (pretty | gcc)")
        .option("-c, --config [filepath::String]", "Path to the .soliumrc configuration file")
        .option("-, --stdin", "Read input file from stdin")
        .option("--fix", "Fix Lint issues where possible")
        .option("--debug", "Display debug information")
        .option("--watch", "Watch for file changes")
        .option("--hot", "(Deprecated) Same as --watch")
        .option("--no-soliumignore", "Do not look for .soliumignore file")
        .option("--no-soliumrc", "Do not look for soliumrc configuration file")
        .option(
            "--rule [rule]",
            "Rule to execute. This overrides the specified rule's configuration in soliumrc if present",
            collect,
            []
        )
        .option(
            "--plugin [plugin]",
            "Plugin to execute. This overrides the specified plugin's configuration in soliumrc if present",
            collect,
            []
        );
}

/**
 * Takes a name and returns an error reporter
 * @param {String} name Name of the reporter
 * @returns {Object} reporter The reporter whose name was supplied.
 */
function getErrorReporter(name) {
    name = name || "pretty";

    try {
        return require("./reporters/" + name);
    } catch (e) {
        throw new Error(
            `Invalid reporter "${name}". Valid reporters are "gcc" and "pretty"`
        );
    }
}

/**
 * Entry point to the CLI reponsible for initiating linting process based on command-line arguments
 * @param {Array} programArgs Commandline arguments
 */
function execute(programArgs) {

    let userConfig = {}, ignore, errorReporter;

    createCliOptions(cli);
    programArgs.length === 2 ? cli.help() : cli.parse(programArgs);

    if (cli.init) {
        return setupDefaultUserConfig();
    }

    try {
        errorReporter = getErrorReporter(cli.reporter);
    } catch (e) {
        console.error(`[Fatal error] ${e.message}`);
        process.exit(errorCodes.INVALID_PARAMS);
    }

    if (cli.soliumrc) {
        /**
         * If cli.config option is NOT specified, then resort to .soliumrc in current dir.
         * Else,
         *   If path is absolute, assign as-it-is.
         *   Else (relative pathing) join path with current dir.
         */
        const soliumrcAbsPath = cli.config ?
            (path.isAbsolute(cli.config) ? cli.config : path.join(CWD, cli.config)) :
            SOLIUMRC_FILENAME_ABSOLUTE;

        try {
            userConfig = require(soliumrcAbsPath);
        } catch (e) {
            // Check if soliumrc file exists. If yes, then the file is in an invalid format.
            if (fs.existsSync(soliumrcAbsPath)) {
                errorReporter.reportFatal(`An invalid ${SOLIUMRC_FILENAME} was provided. ${e.message}`);
            } else {
                if (cli.config) {
                    errorReporter.reportFatal(`${soliumrcAbsPath} does not exist.`);
                } else {
                    errorReporter.reportFatal(`Couldn't find ${SOLIUMRC_FILENAME} in the current directory.`);
                }
            }

            process.exit(errorCodes.NO_SOLIUMRC);
        }
    }

    //if custom rules' file is set, make sure we have its absolute path
    if (
        userConfig ["custom-rules-filename"] &&
        !path.isAbsolute(userConfig ["custom-rules-filename"])
    ) {
        userConfig ["custom-rules-filename"] = path.join(
            CWD, userConfig ["custom-rules-filename"]
        );
    }

    // Pass cli arguments that modify the behaviour of upstream functions.
    userConfig.options = {
        autofix: Boolean(cli.fix),
        debug: Boolean(cli.debug)
    };

    userConfig.plugins = userConfig.plugins || [];
    userConfig.rules = userConfig.rules || {};

    for (const plugin of cli.plugin) {
        userConfig.plugins.push(plugin);
    }

    for (const rule of cli.rule) {
        // If no ":" was found, it means only the rule's name was specified.
        // Treat it as an error and adopt its default configuration options.
        if (!rule.includes(":")) {
            userConfig.rules[rule] = "error";
            continue;
        }

        let [key, value] = rule.split(":").map(i => i.trim());
        try {
            value = JSON.parse(value);
        } catch (e) {
            errorReporter.reportFatal(`There was an error trying to parse '${rule}': ${e.message}`);
            process.exit(errorCodes.INVALID_PARAMS);
        }
        userConfig.rules[key] = value;
    }

    //get all files & folders to ignore from .soliumignore
    if (cli.soliumignore) {
        try {
            ignore = fs.readFileSync(SOLIUMIGNORE_FILENAME_ABSOLUTE, "utf8").split("\n");
        } catch (e) {
            errorReporter.reportInternal(
                `There was an error trying to read '${SOLIUMIGNORE_FILENAME_ABSOLUTE}': ${e.message}`);
        }
    }

    if (cli.hot) {
        // --hot is equivalent to --watch in functionality, is a legacy option
        cli.watch = true;
    }

    if (cli.watch) {
        if (cli.stdin) {
            return errorReporter.reportFatal("Cannot watch files when reading from stdin");
        }

        if (cli.fix) {
            return errorReporter.reportFatal("Automatic code formatting is not supported in watch mode.");
        }
    }

    let errorCount = lint(userConfig, { file: cli.file, dir: cli.dir, stdin: cli.stdin }, ignore, errorReporter);

    if (cli.watch) {

        let spy = chokidar.watch(CWD);

        spy.on("change", function() {
            console.log("\x1Bc"); // clear the console
            console.log(`File change detected. Start linting.${EOL}`);
            lint(userConfig, { file: cli.file, dir: cli.dir }, ignore, errorReporter);	//lint on subsequent changes (hot)
            console.log(`Linting complete. Watching for file changes.${EOL}`);
        });

    } else if (errorCount > 0) {
        process.exit(errorCodes.ERRORS_FOUND);
    }
}

module.exports = {
    execute: execute
};
