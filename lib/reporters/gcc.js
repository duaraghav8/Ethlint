/**
 * @fileoverview The object responsible for reporting errors on commandline in a compact, readable fashion
 * @author Federico Bond <federicobond@gmail.com>
 */

"use strict";

module.exports = {

    reportFatal(message) {
        process.stderr.write(`[Fatal error] ${message}\n`);
    },

    reportInternal(message) {
        process.stdout.write(`[Warning] ${message}\n`);
    },

    report(filename, sourceCode, lintErrors, fixesApplied) {
        let internalIssuesExist = false;

        // Examine internal issues first
        lintErrors.forEach((issue, index) => {
            if (!issue.internal) {
                return;
            }

            process.stdout.write(`${issue.message}\n`);

            delete lintErrors [index];
            internalIssuesExist = true;
        });

        internalIssuesExist && process.stdout.write("\n");

        lintErrors.forEach(error => {
            const { line, column, type, message, ruleName } = error;
            process.stdout.write(`${filename}:${line}:${column}: ${type}: ${message} [${ruleName}]\n`);
        });

        Array.isArray(fixesApplied) && process.stdout.write(`\nNumber of fixes applied: ${fixesApplied.length}\n`);
    }

};