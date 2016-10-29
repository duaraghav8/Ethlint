/**
 * @fileoverview The object responsible for reporting errors on commandline in a compact, readable fashion
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var colors = require ('colors'),
	fs = require ('fs');

function repeat (str, count) {
	return Array (count+1).join (str);
}

function color (type) {
	if (type == 'warning') {
			return 'yellow';
	}
	return 'red';
}

module.exports = {

	report: function (filename, lintErrors) {
		var lines = fs.readFileSync (filename, 'utf-8').split ('\n');
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
		});

		console.log ('\n');
	}

};
