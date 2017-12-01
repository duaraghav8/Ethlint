/**
 * @fileoverview Apply fixes described by the received fix packets to the given source code and return the 'fixed' code.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


let mergeFixes = require("./merge-fixer-packets");


function compareMessagesByLocation(a, b) {
    return (a.line - b.line) || (a.column - b.column);
}

function compareMessagesByFixRange(a, b) {
    return (a.fix.range [0] - b.fix.range [0]) || (a.fix.range [1] - b.fix.range [1]);
}


module.exports = {

    /**
	 * Apply fixes to source code depending on whichever errors can be fixed.
	 * @param {String} sourceCode Code to fix
	 * @param {Array} errorMessages Error objects that describe the error and possibly how to fix it.
	 * @returns {Object} fixed Contains fixed code and information about fixes applied & remaining un-fixed errors.
	 */
    applyFixes: function(sourceCode, errorMessages) {
        let fixedSourceCode = "", fixes = [], fixesApplied = [], remainingMessages = [];
        let cursor = Number.NEGATIVE_INFINITY;

        function attemptFix(fix) {
            let start = fix.range [0], end = fix.range [1];

            // If this fix overlaps with the previous one or has negaive range, return.
            // Note that when cursor === start, its NOT an overlap since when source code in range
            // [i, j] is being edited, the code covered is actually from i to j-1.
            if (cursor > start || start > end) {
                return false;
            }

            fixedSourceCode += sourceCode.slice(Math.max(0, cursor), Math.max(0, start));
            fixedSourceCode += fix.text;
            cursor = end;
            return true;
        }

        // Segregate errors that can be fixed from those that can't for sure.
        errorMessages.forEach(function(msg) {
            if (msg.fix) {
                // If msg.fix is an Array of fix packets, merge them into a single fix packet.
                try {
                    msg.fix = mergeFixes(msg.fix, sourceCode);
                } catch (e) {
                    throw new Error("An error occured while applying fix of rule \""
						+ msg.ruleName + "\" for error \"" + msg.message + "\": " + e.message);
                }

                return fixes.push(msg);
            }

            remainingMessages.push(msg);
        });

        // Fixes will be applied in top-down approach. The fix that arrives first (line-wise, followed by column-wise)
        // gets applied first. But if current fix is applied successfully & the next one overlaps the current one,
        // then the next one is simply skipped. Hence, it is NOT guranteed that all fixes will be applied.
        fixes.sort(compareMessagesByFixRange).forEach(function(msg) {
            if (attemptFix(msg.fix)) {
                return fixesApplied.push(msg);
            }

            remainingMessages.push(msg);
        });

        fixedSourceCode += sourceCode.slice(Math.max(0, cursor));
        remainingMessages.sort(compareMessagesByLocation);

        return {
            fixesApplied: fixesApplied,
            fixedSourceCode: fixedSourceCode,
            remainingErrorMessages: remainingMessages
        };
    }

};