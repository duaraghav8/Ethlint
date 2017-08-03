/**
 * @fileoverview Apply fixes described by the received fix packets to the given source code and return the 'fixed' code.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';


var mergeFixes = require ('./merge-fixer-packets');


function compareMessagesByLocation (a, b) {
	return (a.line - b.line) || (a.column - b.column);
}

function compareMessagesByFixRange (a, b) {
	return (a.fix.range [0] - b.fix.range [0]) || (a.fix.range [1] - b.fix.range [1]);
}


module.exports = {

	applyFixes: function (sourceCode, errorMessages) {
		var fixedSourceCode = '', fixes = [], fixesApplied = [], remainingMessages = [];
		var cursor = Number.NEGATIVE_INFINITY;

		function attemptFix (fix) {
			var start = fix.range [0], end = fix.range [1];

			// If this fix overlaps with the previous one or has negaive range, return.
			if (cursor >= start || start > end) {
				return false;
			}

			fixedSourceCode += sourceCode.slice (Math.max (0, cursor), Math.max (0, start));
			fixedSourceCode += fix.text;
			cursor = end;
			return true;
		}


		errorMessages.forEach (function (msg) {
			if (msg.fix) {
				// If msg.fix is an Array of fix packets, merge them into a single fix packet.
				msg.fix = mergeFixes (msg.fix, sourceCode);
				return fixes.push (msg);
			}

			remainingMessages.push (msg);
		});

		fixes.sort (compareMessagesByFixRange).forEach (function (msg) {
			if (attemptFix (msg.fix)) {
				return fixesApplied.push (msg);
			}

			remainingMessages.push (msg);
		});

		fixedSourceCode += sourceCode.slice (Math.max (0, cursor));
		remainingMessages.sort (compareMessagesByLocation);

		return {
			fixesApplied: fixesApplied,
			fixedSourceCode: fixedSourceCode,
			remainingErrorMessages: remainingMessages
		};
	}

};