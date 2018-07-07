/**
 * @fileoverview The object responsible for reporting errors on commandline in a compact, readable fashion
 * @author Federico Bond <federicobond@gmail.com>
 */

"use strict";

const path = require("path"),
    sort = require("lodash/sortBy"), Table = require("text-table");
require("colors");

let counts = {};


function color(type) {
    return type === "warning" ? "yellow" : "red";
}

function colorInternalIssue(type) {
    return type === "warning" ? "blue" : "red";
}


module.exports = {

    // Convenience method when only a message needs to be passed as part of an internal issue
    reportInternal(message) {
        process.stdout.write((`[Warning] ${message}\n`)[colorInternalIssue("warning")]);
    },

    reportFatal(message) {
        process.stderr.write((`\u2716 [Fatal error] ${message}\n`)[colorInternalIssue("error")]);
    },

    report(filename, sourceCode, lintErrors, fixesApplied) {
        // Remove internal issue, so only rule errors reach the next loop
        lintErrors.forEach((issue, index) => {
            if (!issue.internal) {
                return;
            }

            const {message, type} = issue;
            process.stdout.write(`${message[colorInternalIssue(type)]}\n`);

            delete lintErrors[index];
        });

        // Print the file name
        process.stdout.write(
            (`\n${filename.replace(path.join(process.cwd(), "/"), "")}\n`).underline);

        const errorEntries = [];

        lintErrors.forEach(error => {
            const { line, column, type, message, ruleName } = error;

            // Collect the file's errors as rows to feed to text-table
            errorEntries.push([(`  ${line}:${column}  `).bold,
                (`${type}  `)[color(type)], `${message}  `, (ruleName).grey]);

            // When the first issue of its type is encountered, create its attribute inside counts object & init to 0
            if (!counts[error.type]) {
                counts[error.type] = 0;
            }

            counts[error.type] += 1;
        });

        // Generate & print the aligned table of errors
        process.stdout.write(Table(errorEntries) + "\n");

        if (Array.isArray(fixesApplied)) {
            counts.fixes = (counts.fixes || 0) + fixesApplied.length;
        }
    },


    finalize() {

        process.stdout.write("\n");

        if (typeof counts.fixes !== "undefined") {
            if (counts.fixes === 1) {
                process.stdout.write(("\u2714").green + " 1 fix was");
            } else {
                process.stdout.write(
                    (counts.fixes === 0 ? "No" : ((("\u2714 ").green) + counts.fixes)) + " fixes were");
            }

            process.stdout.write(" applied.\n");
        }

        delete counts.fixes;
        const errorTypes = sort(Object.keys(counts));

        if (errorTypes.length === 0) {
            process.stdout.write(("No issues found.\n\n").green);
        } else {

            process.stdout.write(("\u2716 ").red);

            errorTypes.forEach((type, i) => {
                const sep = (i === 0) ? "" : ", ";
                const plural = (counts[type] !== 1) ? "s" : "";

                process.stdout.write((sep + (counts[type] + " " + type + plural)).red);
            });

            process.stdout.write((" found.\n\n").red);
        }

        counts = {};

    }

};