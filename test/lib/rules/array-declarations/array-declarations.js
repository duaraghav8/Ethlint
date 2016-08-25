/**
 * @fileoverview Tests for array-declarations.js rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var Solium = require ('../../../../lib/solium');
var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "array-declarations": true,
  }
};

describe ('[RULE] array-declarations: Acceptances', function () {

	it ('should accept "uint[] x;"', function (done) {
		var code = 'uint[] x;',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept "uint[10] x;"', function (done) {
		var code = 'uint[10] x;',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});

describe ('[RULE] array-declarations: Rejections', function () {

	it ('should reject "uint[ ] x;"', function (done) {
		var code = 'uint[ ] x;',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no space between square brackets. Use [] instead.');

		Solium.reset ();
		done ();
	});

	it ('should reject "uint[	] x;" (\\t)', function (done) {
		var code = 'uint[	] x;',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no space between square brackets. Use [] instead.');

		Solium.reset ();
		done ();
	});

	it ('should reject "uint[\n] x;"', function (done) {
		var code = 'uint[\n] x;',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no space between square brackets. Use [] instead.');

		Solium.reset ();
		done ();
	});

	it ('should reject "uint[  ] x;" (2 spaces)', function (done) {
		var code = 'uint[  ] x;',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors [0].message.should.equal ('There should be no space between square brackets. Use [] instead.');

		Solium.reset ();
		done ();
	});

});