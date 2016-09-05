/**
 * @fileoverview Tests for lbrace rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var Solium = require ('../../../../lib/solium');

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "lbrace": true
  }
};

describe ('[RULE] lbrace: Acceptances', function () {

	it ('should accept abstract functions', function (done) {
		var code = 'function abstractFunc (uint x, string y) public returns (boolean);',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept (short-declaration) bodies with opening brace on same line after a single space', function (done) {
		var code = 'contract Visual {}',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'library Visual {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'function foobar (bytes32 name) returns (address) {\n\t/*body*/\n}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'struct Student {\n\tstring name;\n\tuint age;\n\taddress account\n}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'for (var i = 0; i < 10; i++) {\n\thello ();\n}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'uint i = 0; while (i < 10) {\n\ti++;\n}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'uint i = 0; do {\n\ti++;\n}\nwhile (i < 10);';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should allow when closing brace is on its own line unless the body is declared on a single line like if (..) {...}', function (done) {
		var code = 'if (true) { hello (); }',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'if (true) {\n\thello ();\n}\nelse if (true) {\n\tworld ();\n}\nelse {\n\tfoobar ();\n}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'function foo () {hello ();}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'function foo () {\n\thello ();\n}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should allow single-item, single-line bodies without braces', function (done) {
		var code, errors;

		//since this rule doesn't lint for indentation, only \n without \t should also be valid
		code = 'if (true)\nnewNumber = (10 * 78 + 982 % 6**2);\nelse\nnewNumber = 0;';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'if (true)\n\tlaunchEvent ("foo bar!");';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		code = 'if (true)\ncreateStructObject ({ name: "Chuck Norris", age: "inf" });';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();

	});

	it ('should allow functions with arguments spanning over multiple lines to NOT have opening brace on same line', function (done) {
		var code = 'function lotsOfArgs (\n\tuint x,\n\tstring y,\n\taddress z\n) {\n\tfoobar ();\n}',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should allow opening brace to be on its own line in case a function has modifiers', function (done) {
		var code = 'function modifs ()\n\tpublic\n\towner\n\tpriced\n\treturns (uint)\n{\n\tfoobar ();\n}',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should allow opening brace to be on its own line in case a function has base constructor arguments', function (done) {
		var code = 'function baseArgs ()\n\tA (10)\n\tB ("hello")\n\tC (0x0)\n\tD (frodo)\n{\n\tfoobar ();\n}',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});


describe ('[RULE] lbrace: Rejections', function (done) {

	it ('should reject any opening brace which is not preceeded by EXACTLY single space', function (done) {
		var code = 'contract FooBar{}',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'contract FooBar  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'contract FooBar\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'contract FooBar/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'library FooBar{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'library FooBar  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'library FooBar\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'library FooBar/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'if (true){}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true)  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true)\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true)/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'if (true) {}\nelse if (true){}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse if (true)  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse if (true)\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse if (true)/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'if (true) {}\nelse{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'function foo (uint x) public modif returns (address){}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'function foo (uint x) public modif returns (address)  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'function foo (uint x) public modif returns (address)\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'function foo (uint x) public modif returns (address)/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'while (true){}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'while (true)  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'while (true)\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'while (true)/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'for (;;){}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'for (;;)  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'for (;;)\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'for (;;)/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'do{}\nwhile (true);';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'do  {}\nwhile (true);';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'do\t{}\nwhile (true);';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'do/*comment*/{}\nwhile (true);';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'struct Student{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'struct Student  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'struct Student\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'struct Student/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		code = 'with (true){}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'with (true)  {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'with (true)\t{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'with (true)/*comment*/{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});


	it ('should reject all short declarations whose opening brace is not on the same line as theirs', function (done) {
		var code = 'contract Foo is Bar, Baz\n{}',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'library Foo is Bar, Baz\n{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true)\n{}\nelse if (true)\n{}\nelse\n{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (3);

		code = 'while (true)\n{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'for (;;)\n{}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);


		Solium.reset ();
		done ();
	});


	it ('should reject clauses with empty statements', function (done) {
		var code = 'if (true);',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse;';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse if (true) {}\nelse;';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse if (true);';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});


	it ('should reject statements which are neither inside blocks nor completely reside on a single line', function (done) {
		var code = 'if (true)\nPacman ({\n\tname: "Shannon"\n});',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse\nPacman ({\n\tname: "Shannon"\n});';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse if (true) {}\nelse\nPacman ({\n\tname: "Shannon"\n});';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse if (true)\nPacman ({\n\tname: "Shannon"\n});';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});


	it ('should reject statements which exist on the same line as clause and are not brace-enclosed', function (done) {
		var code = 'if (true) sayHello ();',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse sayHello();';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse if (true) {}\nelse sayHello();';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {}\nelse if (true) sayHello ();';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});


	it ('should reject clauses which are not on their own line', function (done) {
		var code = 'if (true) {h();} else if (true) {h();} else {h();}',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		code = 'if (true) {h();} else {h();}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {h();} else if (true) {h();}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {h();} else if (true) hello ();';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		code = 'if (true) {h();}\nelse if (true) hello ();';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {h();} else hello ();';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'if (true) {h();}\nelse hello ();';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});


	it ('should reject control structures \'if\', \'while\', and \'for\' if there is no space between them and the parenthetic block representing their conditional.', function (done) {
		var code = 'if(true) {}\nelse if(true) {}',
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		code = 'for(;;) {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		code = 'while(true) {}';
		errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});
});