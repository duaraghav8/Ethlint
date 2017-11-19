/**
 * @fileoverview Tests for indentation rule
 * @author Franco Victorio <victorio.franco@gmail.com>
 */

'use strict';

var fs = require('fs');
var path = require('path');
var Solium = require ('../../../../lib/solium');

var acceptDir = path.join(__dirname, 'accept');
var rejectDir = path.join(__dirname, 'reject');

describe ('[RULE] indentation: Acceptances', function () {
	it('should accept a valid file under the default options', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'config-default.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it('should accept a valid file with tabs', function (done) {
		var userConfig = {
			'rules': {
				'indentation': ['error', 'tab']
			}
		};

		var file = 'config-tabs.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it('should accept a valid file with two spaces', function (done) {
		var userConfig = {
			'rules': {
				'indentation': ['error', 2]
			}
		};

		var file = 'config-two-spaces.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it('should accept a file with a multiline array', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'multiline-array.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it('should accept a file with a multiline call declaration', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'multiline-call-declaration.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it('should accept a file with a multiline call expression', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'multiline-call-expression.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it('should accept a file with a struct', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'struct.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it('should accept a file with a struct in one line', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'one-line-struct.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it('should accept a file with an array in one line', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'one-line-array.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it('should accept a file with a function call in one line', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'one-line-function-call.sol';
		var code = fs.readFileSync(path.join(acceptDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});
});

describe ('[RULE] indentation: Rejections', function () {
	it('should reject an invalid file under the default options', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'config-default.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (13);

		Solium.reset ();
		done ();
	});

	it('should reject an invalid file with tabs', function (done) {
		var userConfig = {
			'rules': {
				'indentation': ['error', 'tab']
			}
		};

		var file = 'config-tabs.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (11);

		Solium.reset ();
		done ();
	});

	it('should reject an invalid file with two spaces', function (done) {
		var userConfig = {
			'rules': {
				'indentation': ['error', 2]
			}
		};

		var file = 'config-two-spaces.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (11);

		Solium.reset ();
		done ();
	});

	it('should reject files with mixed tabs and spaces', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'mixed-tabs-spaces.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

	it('should reject an invalid file with a multiline array', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'multiline-array.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (8);

		Solium.reset ();
		done ();
	});

	it('should reject an invalid file with a multiline call declaration', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'multiline-call-declaration.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

	it('should reject an invalid file with a multiline call expression', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'multiline-call-expression.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

	it('should reject an invalid file with a struct', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'struct.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (8);

		Solium.reset ();
		done ();
	});

	it('should reject top level indentation', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'top-level-indent.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

	it('should reject chars before top level declaration', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'chars-before-top-level.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

	it('should reject chars before top level declaration', function (done) {
		var userConfig = {
			'rules': {
				'indentation': 'error'
			}
		};

		var file = 'indented-top-level-closing-brace.sol';
		var code = fs.readFileSync(path.join(rejectDir, file), 'utf8');

		var errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});
});
