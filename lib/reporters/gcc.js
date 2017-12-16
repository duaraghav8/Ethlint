/**
 * @fileoverview The object responsible for reporting errors on commandline in a compact, readable fashion
 * @author Federico Bond <federicobond@gmail.com>
 */

"use strict";

module.exports = {

    reportFatal: function(message) {
        console.log("[Fatal Error] " + message);
    },

    reportInternal: function(message) {
        console.log("[Warning] " + message);
    },

    report: function(filename, sourceCode, lintErrors, fixesApplied) {
        let internalIssuesExist = false;

        // Examine internal issues first
        lintErrors.forEach(function(issue, index) {
            if (!issue.internal) {
                return;
            }

            console.log(issue.message);

            delete lintErrors [index];
            internalIssuesExist = true;
        });

        internalIssuesExist && console.log("\n");

        lintErrors.forEach(function(error) {

            console.log(
                filename + ":" + error.line + ":" + error.column + ": "
				+ error.type + ": " + error.message
            );

        });

        Array.isArray(fixesApplied) && console.log("\nNumber of fixes applied: " + fixesApplied.length);
    }

};