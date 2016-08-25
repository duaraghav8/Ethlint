/**
 * @fileoverview Tests for blank-lines rule
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
    "blank-lines": true,
  }
};

describe ('[RULE] blank-lines: Acceptances', function () {

	it ('should accept contract declarations succeeded by 2 blank lines (all declarations except for last)', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './accept/contract.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept library declarations succeeded by 2 blank lines (all declarations except for last)', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './accept/library.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept single contract declaration', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './accept/contract-single.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept single library declaration', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './accept/library-single.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept single-line functions without blank lines between them & multiline functions WITH them', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './accept/function.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});


describe ('[RULE] blank-lines: Rejections', function () {

	it ('should reject contract declarations with < 2 lines of gap between them', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './reject/contract.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (3);

		errors [0].node.name.should.equal ('Abc');
		errors [1].node.name.should.equal ('Bcd');
		errors [2].node.name.should.equal ('Cde');

		Solium.reset ();
		done ();
	});

	it ('should reject library declarations with < 2 lines of gap between them', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './reject/library.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (3);

		errors [0].node.name.should.equal ('Abc');
		errors [1].node.name.should.equal ('Bcd');
		errors [2].node.name.should.equal ('Cde');

		Solium.reset ();
		done ();
	});

	it ('should reject a multiline function that is not followed by a blank line', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './reject/function.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors [0].node.name.should.equal ('spam');

		Solium.reset ();
		done ();
	});

});