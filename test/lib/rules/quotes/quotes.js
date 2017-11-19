/**
 * @fileoverview Tests for quotes rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium'),
	path = require ('path'), fs = require ('fs');
var toContract = require ('../../../utils/wrappers').toContract;

var userConfigSingle = {
	'rules': {
		'quotes': [1, 'single']
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
		errors.length.should.equal (41);

		Solium.reset ();
		done ();
	});

});

var userConfigDouble = {
	'rules': {
		'quotes': ['error', 'double']
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
		errors.length.should.equal (41);

		Solium.reset ();
		done ();
	});

});

describe ('[RULE] quotes: Fix when double quotes are mandatory', function () {
	var config = {
		'rules': {
			'quotes': ['error', 'double']
		}
	};

	it ('should fix single to double', function (done) {
		var unfixedCode = fs.readFileSync (path.join (__dirname, 'single-full.sol'), 'utf8'),
			fixedCode =  fs.readFileSync (path.join (__dirname, 'double-full.sol'), 'utf8');

		var fixed = Solium.lintAndFix (unfixedCode, config);

		fixed.should.be.type ('object');
		fixed.should.have.ownProperty ('fixedSourceCode');
		fixed.should.have.ownProperty ('errorMessages');
		fixed.should.have.ownProperty ('fixesApplied');

		fixed.fixedSourceCode.should.equal (fixedCode);
		fixed.errorMessages.should.be.Array ();
		fixed.errorMessages.length.should.equal (0);
		fixed.fixesApplied.should.be.Array ();
		fixed.fixesApplied.length.should.equal (11);

		Solium.reset ();
		done ();
	});

	it ('should escape any unescaped double quotes in the text', function (done) {
		var unfixedCode = toContract ('string x = \'he\\\'"\\"llo w\\\\"or\\\\\\"l"d\';'),
			fixedCode = toContract ('string x = \"he\\\'\\"\\"llo w\\\\\\"or\\\\\\"l\\"d\";');

		var fixed = Solium.lintAndFix (unfixedCode, config);

		fixed.should.be.type ('object');
		fixed.should.have.ownProperty ('fixedSourceCode');
		fixed.should.have.ownProperty ('errorMessages');
		fixed.should.have.ownProperty ('fixesApplied');

		fixed.fixedSourceCode.should.equal (fixedCode);
		fixed.errorMessages.should.be.Array ();
		fixed.errorMessages.length.should.equal (0);
		fixed.fixesApplied.should.be.Array ();
		fixed.fixesApplied.length.should.equal (1);


		unfixedCode = toContract ('string x = \'\';');
		fixedCode = toContract ('string x = \"\";');
		fixed = Solium.lintAndFix (unfixedCode, config);

		fixed.should.be.type ('object');
		fixed.should.have.ownProperty ('fixedSourceCode');
		fixed.should.have.ownProperty ('errorMessages');
		fixed.should.have.ownProperty ('fixesApplied');

		fixed.fixedSourceCode.should.equal (fixedCode);
		fixed.errorMessages.should.be.Array ();
		fixed.errorMessages.length.should.equal (0);
		fixed.fixesApplied.should.be.Array ();
		fixed.fixesApplied.length.should.equal (1);

		Solium.reset ();
		done ();
	});

});

describe ('[RULE] quotes: Fix when single quotes are mandatory', function () {
	var config = {
		'rules': {
			'quotes': ['error', 'single']
		}
	};

	it ('should fix double to single', function (done) {
		var unfixedCode = fs.readFileSync (path.join (__dirname, 'double-full.sol'), 'utf8'),
			fixedCode =  fs.readFileSync (path.join (__dirname, 'single-full.sol'), 'utf8');

		var fixed = Solium.lintAndFix (unfixedCode, config);

		fixed.should.be.type ('object');
		fixed.should.have.ownProperty ('fixedSourceCode');
		fixed.should.have.ownProperty ('errorMessages');
		fixed.should.have.ownProperty ('fixesApplied');

		fixed.fixedSourceCode.should.equal (fixedCode);
		fixed.errorMessages.should.be.Array ();
		fixed.errorMessages.length.should.equal (0);
		fixed.fixesApplied.should.be.Array ();
		fixed.fixesApplied.length.should.equal (11);

		Solium.reset ();
		done ();
	});

	it ('should escape any unescaped single quotes in the text', function (done) {
		var unfixedCode = toContract ('string y = "he\\"\'\\\'llo w\\\\\'or\\\\\\\'l\'d";'),
			fixedCode = toContract ('string y = \'he\\"\\\'\\\'llo w\\\\\\\'or\\\\\\\'l\\\'d\';');

		var fixed = Solium.lintAndFix (unfixedCode, config);

		fixed.should.be.type ('object');
		fixed.should.have.ownProperty ('fixedSourceCode');
		fixed.should.have.ownProperty ('errorMessages');
		fixed.should.have.ownProperty ('fixesApplied');

		fixed.fixedSourceCode.should.equal (fixedCode);
		fixed.errorMessages.should.be.Array ();
		fixed.errorMessages.length.should.equal (0);
		fixed.fixesApplied.should.be.Array ();
		fixed.fixesApplied.length.should.equal (1);


		unfixedCode = toContract ('string x = \"\";');
		fixedCode = toContract ('string x = \'\';');
		fixed = Solium.lintAndFix (unfixedCode, config);

		fixed.should.be.type ('object');
		fixed.should.have.ownProperty ('fixedSourceCode');
		fixed.should.have.ownProperty ('errorMessages');
		fixed.should.have.ownProperty ('fixesApplied');

		fixed.fixedSourceCode.should.equal (fixedCode);
		fixed.errorMessages.should.be.Array ();
		fixed.errorMessages.length.should.equal (0);
		fixed.fixesApplied.should.be.Array ();
		fixed.fixesApplied.length.should.equal (1);

		Solium.reset ();
		done ();
	});
});