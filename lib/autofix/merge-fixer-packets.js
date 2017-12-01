/**
 * @fileoverview Given an array containing fixer packets, merge them all into a single packet that accounts for changes made by all the smaller packets.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


/**
 * Merge all fixer packets into 1 packet and return it.
 * @params {(Array|Object)} fixesArrayOrObject Fixer packet(s) to be merged into a single fixer packet.
 * @params {String} sourceCode Source code.
 */
module.exports = function(fixesArrayOrObject, sourceCode) {
    // If argument is already a single fixes packet, return.
    if (!Array.isArray(fixesArrayOrObject)) {
        return fixesArrayOrObject;
    }

    let fixes = fixesArrayOrObject;

    if (fixes.length === 1) {
        return fixesArrayOrObject [0];
    }

    // Sort fixer packets in top-down approach
    fixes.sort(function(a, b) {
        return (a.range [0] - b.range [0]) || (a.range [1] - b.range [1]);
    });

    // Take start of first fix and end of last fix to merge them all into 1 big fixer packet,
    // combining all the code in between.
    let start = fixes [0].range [0], end = fixes [fixes.length - 1].range [1];
    let text = "", cursor = Number.MIN_SAFE_INTEGER;

    fixes.forEach(function(fix) {
        /**
		 * Condition below is '>' instead of '>=' on purpose.
		 * Say we have 2 packets- {range: [12, 20]} & {range: [20, 28], text: 'world'}.
		 * These should NOT conflict. After 1st packet (which actually makes changes to only 12 to 19 index),
		 * cursor is set to 20. At start of 2nd packet, the slice (20, 20) returns empty string and hence,
		 * there is no damage.
		 */
        if (cursor > fix.range [0]) {
            throw new Error("2 or more fix objects in the Fixer Array must not overlap.");
        }

        if (fix.range [0] >= 0) {
            text += sourceCode.slice(Math.max(0, start, cursor), fix.range [0]);
        }

        text += fix.text;
        cursor = fix.range [1];
    });

    text += sourceCode.slice(Math.max(0, start, cursor), end);

    return {
        range: [start, end],
        text: text
    };
};