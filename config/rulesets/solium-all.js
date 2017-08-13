/**
 * @fileoverview core ruleset solium:all which describes the default severity of all rules but doesn't pass any arguments.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	rules: {
		'imports-on-top': 'error',
		'variable-declarations': 'error',
		'array-declarations': 'error',
		'operator-whitespace': 'error',
		'lbrace': 'error',
		'mixedcase': 'warning',
		'camelcase': 'warning',
		'uppercase': 'warning',
		'no-with': 'warning',
		'no-empty-blocks': 'warning',
		'no-unused-vars': 'error',
		'double-quotes': 'error',
		'blank-lines': 'warning',
		'indentation': 'warning',
		'whitespace': 'warning',
		'deprecated-suicide': 'warning',
		'pragma-on-top': 'warning'
	}

};