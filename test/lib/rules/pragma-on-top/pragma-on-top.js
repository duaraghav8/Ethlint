/**
 * @fileoverview Tests for pragma-on-top rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "pragma-on-top": true
  }
};


describe ('[RULE] pragma-on-top: Acceptances', function () {

	it ('should accept if program has only 1 pragma statement at the top of the file', function (done) {
		var code = 'pragma solidity ^4.4.0;\nimport {foo} from "bar";',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = '\n\/*Foo Bar*\/\n\npragma solidity 4.4.0;';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});


describe ('[RULE] pragma-on-top: Rejections', function () {

	it ('should reject a non-empty program that doesn\'t have a pragma statement on top', function (done) {
		var code = '\/*Hello world*\/\nimport {foo} from "bar";',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = '\/*Hello world*\/\nimport {foo} from "bar";\npragma solidity ^4.4.0;';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		Solium.reset ();
		done ();
	});

	it ('should reject program that has more than 1 pragma statement', function (done) {
		var code = 'pragma solidity ^4.4.0;\npragma solidity ^4.4.0;',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'pragma solidity ^4.4.0;\ncontract Foo {}\npragma solidity ^4.4.0;';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

});
