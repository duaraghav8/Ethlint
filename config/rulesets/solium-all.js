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
		'blank-lines': 'warning',
		'indentation': 'warning',
		'overflow-indentation': 'warning',
		'whitespace': 'warning',
		'function-whitespace': 'error',
		'semicolon-whitespace': 'error',
		'comma-whitespace': 'error',
		'conditionals-whitespace': 'error',
		'operator-whitespace': 'error',
		'deprecated-suicide': 'warning',
		'pragma-on-top': 'warning',
		'quotes': 'error',

		// Turn OFF all deprecated rules
		'double-quotes': 'off'
	}

};