/**
 * @fileoverview Tests for deprecated-suicide rule
 * @author Federico Bond <federicobond@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var wrappers = require ('../../../utils/wrappers');
var toContract = wrappers.toContract;
var userConfig = {
	"custom-rules-filename": null,
	"rules": {
		"deprecated-suicide": true
	}
};

describe ('[RULE] deprecated-suicide', function () {

	it ('should reject contracts using suicide', function (done) {
		var code = toContract('function foo () { suicide(0x0); }'),

		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

});
