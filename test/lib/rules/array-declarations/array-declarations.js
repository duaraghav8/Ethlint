/**
 * @fileoverview Tests for array-declarations.js rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var wrappers = require ('../../../utils/wrappers');
var toContract = wrappers.toContract;
var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "array-declarations": true
  }
};

describe ('[RULE] array-declarations: Acceptances', function () {

	it ('should accept "uint[] x;"', function (done) {
		var code = 'uint[] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept "uint[10] x;"', function (done) {
		var code = 'uint[10] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});

describe ('[RULE] array-declarations: Rejections', function () {

	it ('should reject "uint[ ] x;"', function (done) {
		var code = 'uint[ ] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no whitespace between square brackets. Use [] instead.');

		Solium.reset ();
		done ();
	});

	it ('should reject "uint[	] x;" (\\t)', function (done) {
		var code = 'uint[	] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no whitespace between square brackets. Use [] instead.');

		Solium.reset ();
		done ();
	});

	it ('should reject "uint[\n] x;"', function (done) {
		var code = 'uint[\n] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no whitespace between square brackets. Use [] instead.');

		Solium.reset ();
		done ();
	});

	it ('should reject "uint[  ] x;" (2 spaces)', function (done) {
		var code = 'uint[  ] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no whitespace between square brackets. Use [] instead.');

		Solium.reset ();
		done ();
	});

	it ('should reject "uint [] x;" (space between literal and opening brackets', function (done) {
		var code = 'uint [] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no whitespace between literal uint and \'[]\'');

		Solium.reset ();
		done ();
	});

	it ('should reject "string\n[] x;" (linebreak between literal and opening brackets', function (done) {
		var code = 'string\n[] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no whitespace between literal string and \'[]\'');

		Solium.reset ();
		done ();
	});

	it ('should reject "bytes32\t[] x;" (tab between literal and opening brackets', function (done) {
		var code = 'bytes32\t[] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no whitespace between literal bytes32 and \'[]\'');

		Solium.reset ();
		done ();
	});

	it ('should reject "uint  [  ] x;"', function (done) {
		var code = 'uint  [  ] x;',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		Solium.reset ();
		done ();
	});

});
