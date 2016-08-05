/**
 * @fileoverview The object responsible for reporting errors on commandline in a compact, readable fashion
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

function generateDashedLine (charCount) {
	return Array (charCount+1).join ('-');
}

module.exports = {

	report: function (filename, lintErrors) {
		console.log (
			generateDashedLine (filename.length + 30) + '\n' +
			'FILE:\t' + filename + '\n' +
			generateDashedLine (filename.length + 30) + '\n'
		);

		lintErrors.forEach (function (error) {
			console.log (
				'[' + error.type.toUpperCase () + '] ' +
				'At line: ' + error.line + ', column: ' + error.column + ' -> ' +
				error.message +
				'\n'
			);
		});

		console.log ('\n');
	}

};