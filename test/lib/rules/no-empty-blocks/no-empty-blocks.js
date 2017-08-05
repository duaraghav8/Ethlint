/**
 * @fileoverview Tests for no-empty-blocks rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var wrappers = require ('../../../utils/wrappers');
var toContract = wrappers.toContract;
var toFunction = wrappers.toFunction;
var addPragma = wrappers.addPragma;

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "no-empty-blocks": true
  }
};

describe ('[RULE] no-empty-blocks: Acceptances', function () {

	it ('should accept all non-empty contract, library and interface statements', function (done) {
		var code = 'contract Foo { event bar (); }',
			errors = Solium.lint (addPragma(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'library Foo { event bar (); }';
		errors = Solium.lint (addPragma(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'interface Foo { event bar (); }';
		errors = Solium.lint (addPragma(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept all non-empty function declarations', function (done) {
		var code = 'function foo () { bar (); }',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should ACCEPT all EMPTY function declarations (see fallback functions)', function (done) {
		var code = 'function foo () {}',
			errors = Solium.lint (toContract(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept all non-empty if-else declarations', function (done) {
		var code = 'if (true) { foo (); } else { bar (); }',
			errors = Solium.lint (toFunction(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);
		
		Solium.reset ();
		done ();
	});

	it ('should accept all non-empty for statements', function (done) {
		var code = 'for (i = 0; i < 10; i++) { foo (); }',
			errors = Solium.lint (toFunction(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);
		
		Solium.reset ();
		done ();
	});

	it ('should accept all non-empty do..while statements', function (done) {
		var code = 'do { foo (); } while (i < 20);',
			errors = Solium.lint (toFunction(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);
		
		Solium.reset ();
		done ();
	});

	it ('should accept all non-empty while statements', function (done) {
		var code = 'while (i < 20) { bar (); }',
			errors = Solium.lint (toFunction(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);
		
		Solium.reset ();
		done ();
	});

});


describe ('[RULE] no-empty-blocks: Rejections', function () {

	it ('should reject all empty contract, library & interface statements', function (done) {
		var code = 'contract Foo {}',
			errors = Solium.lint (addPragma(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'library Foo {}';
		errors = Solium.lint (addPragma(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'interface Foo {}';
		errors = Solium.lint (addPragma(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

	it ('should reject all empty if-else declarations', function (done) {
		var code = 'if (true) {} else {}',
			errors = Solium.lint (toFunction(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);
		
		Solium.reset ();
		done ();
	});

	it ('should reject all empty for statements', function (done) {
		var code = 'for (i = 0; i < 10; i++) {}',
			errors = Solium.lint (toFunction(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

	it ('should reject all empty do..while statements', function (done) {
		var code = 'do {} while (i < 20);',
			errors = Solium.lint (toFunction(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		
		Solium.reset ();
		done ();
	});

	it ('should reject all empty while statements', function (done) {
		var code = 'while (i < 20) {}',
			errors = Solium.lint (toFunction(code), userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

});
