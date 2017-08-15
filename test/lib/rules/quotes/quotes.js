/**
 * @fileoverview Tests for quotes rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium'),
	path = require ('path'), fs = require ('fs');
var toContract = require ('../../../utils/wrappers').toContract;

var userConfigSingle = {
  "rules": {
    "quotes": [1, "single"]
  }
};

describe ('[RULE] quotes: Acceptances for single quote', function () {

	it ('should accept when receiving single quote strings', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './single-quoted.sol'), 'utf8'),
			errors = Solium.lint (toContract(code), userConfigSingle);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});

describe ('[RULE] quotes: Rejections for single quote', function () {

	it ('should reject when receiving double quote strings', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './double-quoted.sol'), 'utf8'),
			errors = Solium.lint (toContract(code), userConfigSingle);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (5);

		Solium.reset ();
		done ();
	});

});

var userConfigDouble = {
  "rules": {
    "quotes": ["error", "double"]
  }
};

describe ('[RULE] quotes: Acceptances for double quote', function () {

	it ('should accept when receiving double quote strings', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './double-quoted.sol'), 'utf8'),
			errors = Solium.lint (toContract(code), userConfigDouble);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});

describe ('[RULE] quotes: Rejections for double quote', function () {

	it ('should reject when receiving single quote strings', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './single-quoted.sol'), 'utf8'),
			errors = Solium.lint (toContract(code), userConfigDouble);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (5);

		Solium.reset ();
		done ();
	});

});