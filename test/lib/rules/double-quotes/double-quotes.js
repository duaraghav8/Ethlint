/**
 * @fileoverview Tests for double-quotes rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var Solium = require ('../../../../lib/solium'),
	fs = require ('fs'),
	path = require ('path');

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "double-quotes": true
  }
};

describe ('[RULE] double-quotes: Acceptances', function () {

	it ('should accept strings quoted with double quotes', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './accept/double-quoted.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});


describe ('[RULE] double-quotes: Rejections', function () {

	it ('should reject strings quoted with single quotes', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './reject/single-quoted.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (5);

		Solium.reset ();
		done ();
	});

});