/**
 * @fileoverview The object responsible for reporting errors on commandline in a compact, readable fashion
 * @author Federico Bond <federicobond@gmail.com>
 */

'use strict';

var colors = require ('colors'),
	fs = require ('fs'),
	sort = require('lodash/sortBy');

function repeat (str, count) {
	return Array (count+1).join (str);
}

function color (type) {
	if (type == 'warning') {
			return 'yellow';
	}
	return 'red';
}

var counts = {};

module.exports = {

	report: function (filename, sourceCode, lintErrors) {
		var lines = sourceCode.split ('\n');
		var errorLine, line, tabCount;

		lintErrors.forEach (function (error) {
			if (error.line != errorLine) {
				console.log(('\nIn ' + filename + ', line ' + error.line + ':').bold);

				line = lines[error.line - 1];

				// NOTE: Tabs are counted as one column but usually expand to many in
				// terminal. Replicate the same amount of tabs to indent error message.
				// This solution is not perfect but appears robust enough in practice
				tabCount = line.substring (0, error.column).split ('\t').length - 1;

				console.log(line);
			}

			errorLine = error.line;

			console.log(
				repeat('\t', tabCount) + repeat(' ', error.column - tabCount)
				+ ('^-- ' + error.type.toUpperCase() + ': ' + error.message)[color(error.type)]
			);

			if (!counts[error.type]) {
				counts[error.type] = 0;
			}

			counts[error.type] += 1;
		});

		console.log ('\n');
	},

	finalize: function () {

		var errorTypes = sort (Object.keys (counts))

		if (errorTypes.length === 0) {

			console.log ('No issues found.\n')

		} else {

			errorTypes.forEach (function (type, i) {
				var sep = (i === 0) ? '' : ', ';
				var plural = (counts[type] !== 1) ? 's' : ''
				process.stdout.write (sep + (counts[type] + ' ' + type + plural))
			})

			console.log (' found.\n');
		}

	}

};
