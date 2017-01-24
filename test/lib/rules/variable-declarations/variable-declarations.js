/**
 * @fileoverview Tests for no-unused-vars rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var wrappers = require ('../../../utils/wrappers');
var toFunction = wrappers.toFunction;

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "variable-declarations": true
  }
};

describe ('[RULE] variable-declarations: Rejections', function () {

	it ('should reject all variables having names "l", "o" or "I"', function (done) {
		var code = [
			'var l; var O; var I;',
			'uint l; uint O; uint I;',
			'string l; string O; string I;',
			'bytes32 l; bytes32 O; bytes32 I;',
			'mapping (uint => string) l; mapping (uint => string) O, mapping (uint => string) I;',
		];
		var errors;

		code = code.map(function(item){return toFunction(item)});
		
		errors = Solium.lint (code [0], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (3);

		errors = Solium.lint (code [1], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (3);

		errors = Solium.lint (code [2], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (3);

		errors = Solium.lint (code [3], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (3);

		errors = Solium.lint (code [4], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (3);

		Solium.reset ();
		done ();
	});

});
