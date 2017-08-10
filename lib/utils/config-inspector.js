/**
 *
 */

'use strict';

var jsUtils = require ('./js-utils');

module.exports = {

	isValid: function (config) {
		return (jsUtils.isStrictlyObject (config) &&
			(jsUtils.isStrictlyObject (config.rules)) || (typeof config.extends === 'string'));
	},

	isFormatDeprecated: function (config) {
		var key = Object.keys (config.rules) [0];
		return typeof config.rules [key] === 'boolean';
	}

};