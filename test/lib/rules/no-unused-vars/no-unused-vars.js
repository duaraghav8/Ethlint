/**
 * @fileoverview Tests for no-unused-vars rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var wrappers = require ('../../../utils/wrappers');
var toContract = wrappers.toContract;
var toFunction = wrappers.toFunction;

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "no-unused-vars": true
  }
};

describe ('[RULE] no-unused-vars: Acceptances', function () {

	it ('should accept all variables that are used at least once in the same program', function (done) {
		var code = [
			'uint x = 100; function foo () returns (uint) { return x; }',
			'bytes32 x = "hello"; function foo () returns (bytes32) { return x; }',
			'string x = "hello"; function foo () returns (int) { return x; }',
			'address x = 0x0; function foo () returns (address) { return x; }',
			'mapping (address => uint) x; function foo () returns (mapping) { return x; }'
		];
		var errors;

		code = code.map(function(item){return toContract(item)});

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

		errors = Solium.lint (code [4], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept if the variable\'s usage occurs above its declaration & definition.', function (done) {
		var code = 'contract Owned {\nfunction setOwner(address _new) onlyOwner { NewOwner(owner, _new); owner = _new; }\naddress public owner = msg.sender;}',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});
});


describe ('[RULE] no-unused-vars: Rejections', function () {

	it ('should reject all variables that haven\'t been used even once', function (done) {
		var code = [
			'var x = 100;',
			'uint x = 100;',
			'bytes32 x = "hello";',
			'string x = "hello";',
			'address x = 0x0;',
			'mapping (address => uint) x;'
		];
		var errors;

		code = code.map(function(item){return toFunction(item)});

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
