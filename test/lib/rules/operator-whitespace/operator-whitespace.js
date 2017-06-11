/**
 * @fileoverview Tests for operator-whitespace.js rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var wrappers = require ('../../../utils/wrappers')
var toFunction = wrappers.toFunction;

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "operator-whitespace": true
  }
};

describe ('[RULE] operator-whitespace: Acceptances', function () {

	it ('should accept BinaryExpressions having no extraneous whitespace or comments with the operator', function (done) {
		var code = [
			'x [10]+y.foo;',
			'x.foo + bar ();',
			'x.foo * bar ();',
			'x.foo**bar ();',
			'x.foo ^ bar ();',
			'x.foo >> bar ();',
			'x.foo && bar ();',
			'x.foo||bar ();',
			'x.foo - bar ();',
			'x.foo <= bar ();',
			'x.foo%clu++;',
			'x.foo <= (1 - 45);',
			'(90.89 * 1) / (100 - 76 % (3**2));',
			'!x + --8;',
			'(90.89 * 1) / (100 - 76 % 3**2);',
			'a ** b + c ** d;',
			'8 * 9 / 3 % 2;',
			'1 + 8 - 67;',
			'1909 + 189 * 1 ** 29 / 190;',
			'1909 + 189*1 ** 29/190;',
			'1909+189*1**29/190;',
			'x+189 * uy ** dex / 190;'
		];
		var errors;

		code = code.map(function(item){return toFunction(item)});

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

		errors = Solium.lint (code [5], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [6], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [7], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [8], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [9], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [10], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [11], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [12], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [13], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [14], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [15], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [16], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [17], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [18], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [19], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [20], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		errors = Solium.lint (code [21], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	})

});


describe ('[RULE] operator-whitespace: Rejections', function () {

	it ('should reject reject BinaryExpressions with extraneous whitespace or comments next to operators', function (done) {
		var code = [
			'x [10]  +y.foo;',
			'x.foo +  bar ();',
			'x.foo\t* bar ();',
			'x.foo**\tbar ();',
			'x.foo\n^ bar ();',
			'x.foo\n>>\nbar ();',
			'x.foo/**/&& bar ();',
			'x.foo||/**/bar ();',
			'x.foo/**/-/**/bar ();',
			'x.foo /**/<=/**/ bar ();',
			'x.foo% clu++;',
			'x.foo/**/ <= /**/(1 - 45);',
			'(90.89 * 1) /**/-/**/ (100 - 76 % (3**2));',
			'x.foo\n**\nbar ();',
			'8 *\n9 /\t3 % 2;',
			'1+ 8- 67;',
			'1909\n+\n189 * 1 ** 29 / 190;',
			'1909\t+ 189*1\t** 29/190;',
			'1909+ 189 *1**29/190;',
			'x+189 * uy\t**\tdex / 190;'
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
		errors.length.should.equal (2);

		errors = Solium.lint (code [6], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [7], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [8], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [9], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [10], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		errors = Solium.lint (code [11], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [12], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [13], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [14], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [15], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [16], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [17], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [18], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		errors = Solium.lint (code [19], userConfig);
		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (2);

		Solium.reset ();
		done ();
	});

});
