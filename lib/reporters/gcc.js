/**
 * @fileoverview The object responsible for reporting errors on commandline in a compact, readable fashion
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	report: function (filename, lintErrors) {

		lintErrors.forEach (function (error) {

			console.log(
				filename + ':' + error.line + ':' + error.column + ': '
				+ error.type + ': ' + error.message
			);

		});
	}

};
