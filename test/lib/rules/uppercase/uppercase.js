/**
 * @fileoverview Tests for uppercase rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "uppercase": true
  }
};

describe ('[RULE] uppercase: Acceptances', function () {

	it ('should accept all constants that are uppercase', function (done) {
		var code = [
			'uint constant HE = 100;',
			'address constant HELLO_WORLD = 0x0;',
			'bytes32 constant HELLOWORLD = "dd";',
			'string constant HELLO = "dd";'
		];
		var errors;

		errors = Solium.lint (code [0], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [1], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [2], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [3], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});


describe ('[RULE] uppercase: Rejections', function () {

	it ('should reject all constants which are not uppercase', function (done) {
		var code = [
			'uint constant he = 100;',
			'address constant hello_world = 0x0;',
			'bytes32 constant helloworld= "dd";',
			'string constant HellO = "dd";',
			'string constant HeO = "dd";',
			'string constant H2O = "dd";'
		];
		var errors;

		errors = Solium.lint (code [0], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [1], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [2], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [3], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [4], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [5], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

});
