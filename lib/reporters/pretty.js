/**
 * @fileoverview The object responsible for reporting errors on commandline in a compact, readable fashion
 * @author Federico Bond <federicobond@gmail.com>
 */

"use strict";

const path = require("path"), jsdiff = require("diff"),
    sort = require("lodash/sortBy"), Table = require("text-table"), { EOL } = require("os");
require("colors");

let counts = {};


function color(type) {
    return type === "warning" ? "yellow" : "red";
}

function colorInternalIssue(type) {
    return type === "warning" ? "blue" : "red";
}

function getDiffLine(diffPart) {
    if (diffPart.startsWith("+")) {
        return diffPart.green;
    } else if (diffPart.startsWith("-")) {
        return diffPart.red;
    }

    return diffPart;
}


module.exports = {

    // Convenience method when only a message needs to be passed as part of an internal issue
    reportInternal(message) {
        process.stdout.write((`[Warning] ${message}${EOL}`)[colorInternalIssue("warning")]);
    },

    reportFatal(message) {
        process.stderr.write((`\u2716 [Fatal error] ${message}${EOL}`)[colorInternalIssue("error")]);
    },

    report(filename, sourceCode, lintErrors, fixesApplied) {
        // Remove internal issue, so only rule errors reach the next loop
        lintErrors.forEach((issue, index) => {
            if (!issue.internal) {
                return;
            }

            const { message, type } = issue;
            process.stdout.write(`${message[colorInternalIssue(type)]}${EOL}`);

            delete lintErrors[index];
        });

        // Print the file name
        process.stdout.write(
            (`${EOL}${filename.replace(path.join(process.cwd(), "/"), "")}${EOL}`).underline);

        const errorEntries = [];

        lintErrors.forEach(error => {
            const { line, column, type, message, ruleName } = error;

            // Collect the file's errors as rows to feed to text-table
            errorEntries.push([(`  ${line}:${column}  `).bold,
                (`${type}  `)[color(type)], `${message}  `, (ruleName).italic]);

            // When the first issue of its type is encountered, create its attribute inside counts object & init to 0
            if (!counts[error.type]) {
                counts[error.type] = 0;
            }

            counts[error.type] += 1;
        });

        // Generate & print the aligned table of errors
        process.stdout.write(Table(errorEntries) + EOL);

        if (Array.isArray(fixesApplied)) {
            counts.fixes = (counts.fixes || 0) + fixesApplied.length;
        }
    },

    reportDiff(fileName, sourceCode, fixedSourceCode, issuesFixed) {
        let diff = jsdiff.structuredPatch(fileName,
            fileName, sourceCode, fixedSourceCode, "old-header", "new-header");

        if (diff.hunks.length == 0) {
            return;
        }

        process.stdout.write((`Diff for: ${fileName}${EOL}`).cyan);
        diff.hunks.forEach(function(hunk){
            process.stdout.write(`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@${EOL}`.cyan);
            hunk.lines.forEach(line => { process.stdout.write(getDiffLine(line) + EOL); });
        });
        process.stdout.write(`${EOL}${issuesFixed} lint issue(s) can be fixed.${EOL}`.green);
    },


    finalize() {

        process.stdout.write(EOL);

        if (typeof counts.fixes !== "undefined") {
            if (counts.fixes === 1) {
                process.stdout.write(("\u2714").green + " 1 fix was");
            } else {
                process.stdout.write(
                    (counts.fixes === 0 ? "No" : ((("\u2714 ").green) + counts.fixes)) + " fixes were");
            }

            process.stdout.write(` applied.${EOL}`);
        }

        delete counts.fixes;
        const errorTypes = sort(Object.keys(counts));

        if (errorTypes.length === 0) {
            process.stdout.write((`No issues found.${EOL.repeat(2)}`).green);
        } else {

            process.stdout.write(("\u2716 ").red);

            errorTypes.forEach((type, i) => {
                const sep = (i === 0) ? "" : ", ";
                const plural = (counts[type] !== 1) ? "s" : "";

                process.stdout.write((sep + (counts[type] + " " + type + plural)).red);
            });

            process.stdout.write((` found.${EOL.repeat(2)}`).red);
        }

        counts = {};

    }

};