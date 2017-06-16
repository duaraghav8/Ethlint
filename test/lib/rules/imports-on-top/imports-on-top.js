/**
 * @fileoverview Tests for imports-on-top rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium'),
	fs = require ('fs'),
	path = require ('path');

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "imports-on-top": true
  }
};

describe ('[RULE] imports-on-top: Acceptances', function () {

	it ('should accept if all import statements are on top of the file (but below the optional PRAGMA directive)', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './accept/on-top.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});


describe ('[RULE] imports-on-top: Rejections', function () {

	it ('should reject any import statement NOT on top of file', function (done) {
		var code = fs.readFileSync (path.join (__dirname, './reject/intermingled.sol'), 'utf8'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

});
