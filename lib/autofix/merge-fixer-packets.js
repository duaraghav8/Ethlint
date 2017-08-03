/**
 * @fileoverview Given an array containing fixer packets, merge them all into a single packet that accounts for changes made by all the smaller packets.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';


module.exports = function (fixesArrayOrObject, sourceCode) {
	// If argument is already a single fixes packet, return.
	if (!Array.isArray (fixesArrayOrObject)) {
		return fixesArrayOrObject;
	}

	var fixes = fixesArrayOrObject;

	if (!fixes.length) {
		throw new Error ('Array doesn\'t contain any Fixer Objects.');
	}

	if (fixes.length === 1) {
		return fixesArrayOrObject [0];
	}

	fixes.sort (function (a, b) {
		return (a.range [0] - b.range [0]) || (a.range [1] - b.range [1]);
	});

	var start = fixes [0].range [0], end = fixes [fixes.length - 1].range [1];
	var text = '', cursor = Number.MIN_SAFE_INTEGER;

	fixes.forEach (function (fix) {
		if (cursor >= fix.range [0]) {
			throw new Error ('Fixer objects in a single Fixer Array cannot overlap.');
		}

		if (fix.range [0] >= 0) {
			text += sourceCode.slice (Math.max (0, start, cursor), fix.range [0]);
		}

		text += fix.text;
		cursor = fix.range [1];
	});

	text += sourceCode.slice (Math.max (0, start, cursor), end);

	return {
		range: [start, end],
		text: text
	};
};