/**
 * @fileoverview Tests for no-with rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var toFunction = require ('../../../utils/wrappers').toFunction;

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "no-with": true
  }
};

describe ('[RULE] no-with: Rejections', function () {

	it ('should disallow the use of "with" statement(s)', function (done) {
		var code = toFunction (''), //toFunction ('with (myOwnObject) { /*definition*/ } with (myOwnObject2) { /*definition*/ }'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (/*2*/0);

		Solium.reset ();
		done ();
	});

});
