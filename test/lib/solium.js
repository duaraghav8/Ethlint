/**
 * @fileoverview Tests for lib/solium.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../lib/solium'),
	wrappers = require ('../utils/wrappers'),
	EventEmitter = require ('events').EventEmitter;

describe ('Checking Exported Solium API', function () {

	var meta = {
		docs: {
			recommended: true,
			type: 'error',
			description: 'Ensure that all strings use only 1 style - either double quotes or single quotes.'
		},
		schema: []
	};

	it ('should be an instance of EventEmitter & expose a set of functions', function (done) {
		Solium.should.be.type ('object');
		Solium.should.be.instanceof (EventEmitter);
		
		Solium.should.have.ownProperty ('reset');
		Solium.reset.should.be.type ('function');
		Solium.should.have.ownProperty ('lint');
		Solium.lint.should.be.type ('function');
		Solium.should.have.ownProperty ('lintAndFix');
		Solium.lint.should.be.type ('function');
		Solium.should.have.ownProperty ('report');
		Solium.report.should.be.type ('function');
		Solium.should.have.ownProperty ('getSourceCode');
		Solium.getSourceCode.should.be.type ('function');

		done ();
	});

	it ('should return a SourceCode instance upon calling Solium.getSourceCode ()', function (done) {
		var sourceCode = Solium.getSourceCode ();

		sourceCode.should.be.type ('object');
		sourceCode.constructor.name.should.equal ('SourceCode');

		sourceCode.should.have.ownProperty ('text');
		sourceCode.text.should.be.empty ();

		sourceCode.should.have.property ('getLine');
		sourceCode.getLine.should.be.type ('function');

		sourceCode.should.have.property ('getColumn');
		sourceCode.getColumn.should.be.type ('function');

		sourceCode.should.have.property ('getEndingColumn');
		sourceCode.getColumn.should.be.type ('function');
		
		sourceCode.should.have.property ('getParent');
		sourceCode.getParent.should.be.type ('function');

		sourceCode.should.have.property ('getEndingLine');
		sourceCode.getParent.should.be.type ('function');
		
		sourceCode.should.have.property ('isASTNode');
		sourceCode.getParent.should.be.type ('function');

		sourceCode.should.have.property ('getText');
		sourceCode.getText.should.be.type ('function');

		sourceCode.should.have.property ('getTextOnLine');
		sourceCode.getText.should.be.type ('function');
		
		sourceCode.should.have.property ('getStringBetweenNodes');
		sourceCode.getText.should.be.type ('function');

		sourceCode.should.have.property ('getNextChar');
		sourceCode.getNextChar.should.be.type ('function');
		
		sourceCode.should.have.property ('getPrevChar');
		sourceCode.getPrevChar.should.be.type ('function');
		
		sourceCode.should.have.property ('getNextChars');
		sourceCode.getNextChars.should.be.type ('function');
		
		sourceCode.should.have.property ('getPrevChars');
		sourceCode.getPrevChars.should.be.type ('function');

		done ();
	});

	it ('should be completely reset after call to Solium.reset ()', function (done) {
		Solium.reset ();

		var minmalConfig = { rules: {} };
		var sourceCode = Solium.getSourceCode ();
		var errorMessages = Solium.lint (wrappers.toFunction ('var foo = 100;'), minmalConfig, true)

		sourceCode.text.should.equal ('');
		(sourceCode.getText ()).should.equal (sourceCode.text);

		errorMessages.should.be.instanceof (Array);
		errorMessages.length.should.equal (0);

		//all event listeners should've been removed
		Object.keys (Solium._events).length.should.equal (0);

		done ();
	});

	it ('should handle invalid arguments when calling Solium.report()', function (done) {
		Solium.report.bind (Solium, null).should.throw ();
		Solium.report.bind (Solium).should.throw ();

		Solium.report.bind (Solium, {node: null}).should.throw ();
		Solium.report.bind (Solium, {node: undefined}).should.throw ();
		Solium.report.bind (Solium, {node: 100}).should.throw ();
		Solium.report.bind (Solium, {node: {}}).should.throw ();
		Solium.report.bind (Solium, {node: {type: 100}}).should.throw ();

		var n = { type: 'Type', start: 0, end: 89 };

		Solium.report.bind (Solium, {node: n}).should.throw ();
		Solium.report.bind (Solium, {node: n, message: ''}).should.throw ();
		Solium.report.bind (Solium, {node: n, message: null}).should.throw ();
		Solium.report.bind (Solium, {node: n, message: 100}).should.throw ();

		Solium.report.bind (Solium, {node: n, message: 'helo', ruleMeta: {}}).should.throw ();
		Solium.report.bind (Solium, {node: n, message: 'helo', ruleMeta: null}).should.throw ();
		Solium.report.bind (Solium, {
			node: n, message: 'helo', ruleMeta: [], ruleName: 'hola', type: 'warning'
		}).should.throw ();
		Solium.report.bind (Solium, {
			node: n, message: 'helo', ruleMeta: meta, type: 'blahblah', ruleName: 'hola'
		}).should.throw ();
		Solium.report.bind (Solium, {
			node: n, message: 'helo', ruleMeta: meta, type: 1892, ruleName: 'hola'
		}).should.throw ();

		Solium.report.bind (Solium, {
			node: n, message: 'helo', ruleMeta: meta, type: 'error', ruleName: ''
		}).should.throw ();
		Solium.report.bind (Solium, {
			node: n, message: 'helo', ruleMeta: meta, type: 'error', ruleName: {}
		}).should.throw ();

		//should not throw error with minimal valid object
		Solium.report.bind (Solium, {
			node: n,
			message: 'H',
			ruleMeta: meta,
			type: 'error',
			ruleName: 'lola'
		}).should.not.throw ();

		Solium.reset ();
		done ();
	});

	it ('should push a sample error object in messages upon calling Solium.report ()', function (done) {
		var sampleErrorObject = {
			ruleName: 'sample',
			type: 'error',
			node: {
				type: 'Type',
				start: 0,
				end: 3
			},
			location: {	line: 1, column: 2 },
			message: 'boo!',
			ruleMeta: meta
		};
		var minmalConfig = { rules: {} };

		Solium.report (sampleErrorObject);

		var errorObjects = Solium.lint (wrappers.toFunction ('var foo = 100;'), minmalConfig, true),
			err = errorObjects [0];

		errorObjects.length.should.equal (1);
		err.ruleName.should.equal ('sample');
		err.type.should.equal ('error');
		err.node.type.should.equal ('Type');
		err.node.start.should.equal (0);
		err.node.end.should.equal (3);
		err.line.should.equal (1);
		err.column.should.equal (2);
		err.message.should.equal ('boo!');

		Solium.reset ();	//clear everything

		done ();
	});

	it ('should handle all invalid arguments for Solium.lint ()', function (done) {
		var minimalConfig = { rules: {} },
			minimalSourceCode = wrappers.toFunction ('var foo = 100;');

		//sourceCode text validation
		Solium.lint.bind (Solium, '', minimalConfig).should.throw ();
		Solium.lint.bind (Solium, null, minimalConfig).should.throw ();
		Solium.lint.bind (Solium, 100, minimalConfig).should.throw ();
		Solium.lint.bind (Solium, {}, minimalConfig).should.throw ();
		Solium.lint.bind (Solium, undefined, minimalConfig).should.throw ();
		Solium.lint.bind (Solium, 10.8927, minimalConfig).should.throw ();
		Solium.lint.bind (Solium, [], minimalConfig).should.throw ();

		//config object validation
		Solium.lint.bind (Solium, minimalSourceCode).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {rules: null}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {rules: 'foo'}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, []).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, null).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, 19082).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, 'hoellla').should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, 0).should.throw ();

		// config (v1.0.0) object validation
		// These tests just ensure that Solium internally calls configInspector.isValid() on config.
		// Extensive testing of validation is done on isValid() (see test for config-inspector).
		Solium.lint.bind (Solium, minimalSourceCode, {extends: ''}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {extends: 908}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {extends: {}}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {extends: []}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {extends: 'hello', rules: {a: true}}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {extends: null}).should.throw ();

		Solium.lint.bind (Solium, minimalSourceCode, {rules: {a: []}}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {rules: {a: 'koala bear'}}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {rules: {a: 9018}}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {rules: {a: -1}}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {rules: {a: null}}).should.throw ();

		//minimal valid arguments
		Solium.lint.bind (Solium, minimalSourceCode, minimalConfig).should.not.throw ();
		Solium.reset ();

		done ();
	});

	it ('should return deprecation warnings when using old config format, "custom-rules-filename" is non-null & returnInternalIssues = true', function (done) {
		var config = {
			'custom-rules-filename': './test/extras/custom-rules-file',
			rules: {
				indentation: true,
				lbrace: true
			},
			options: {
				returnInternalIssues: true
			}
		};

		var errors = Solium.lint ('contract Foo {}', config);

		errors.should.be.array;
		errors.length.should.equal (2);

		errors.forEach (function (err) {
			err.should.be.type ('object');
			err.should.have.ownProperty ('internal');
			err.internal.should.equal (true);
			err.should.have.ownProperty ('line');
			err.line.should.equal (-1);
			err.should.have.ownProperty ('column');
			err.column.should.equal (-1);
			err.should.have.ownProperty ('message');

			err.message.should.be.type ('string');
		});

		Solium.reset ();
		done ();
	});

	it ('should not alter the configuration passed by user in any way', function (done) {
		var userConfig = {
			'custom-rules-filename': null,
			rules: {
				'mixedcase': true,
				'camelcase': false
			}
		};
		var minimalSourceCode = wrappers.toFunction ('var foo = 100;');

		Solium.lint (minimalSourceCode, userConfig);

		userConfig.should.be.type ('object');
		userConfig.should.have.ownProperty ('custom-rules-filename');
		(userConfig ['custom-rules-filename'] === null).should.equal (true);
		userConfig.should.have.ownProperty ('rules');
		userConfig.rules.should.be.type ('object');
		userConfig.rules.should.have.ownProperty ('mixedcase');
		userConfig.rules.mixedcase.should.equal (true);
		userConfig.rules.should.have.ownProperty ('camelcase');
		userConfig.rules.camelcase.should.equal (false);
		Object.keys (userConfig).length.should.equal (2);

		Solium.reset ();

		done ();
	});

	it ('should function as expected when valid arguments are provided', function (done) {
		var minimalConfig = { rules: {} },
			minimalSourceCode = wrappers.toFunction ('var foo = 100;');
		var emissionCounter = 5;

		function testComplete () {
			Solium.reset ();
			done ();
		}

		Solium.on ('Program', function () {
			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		Solium.on ('VariableDeclaration', function () {
			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		Solium.on ('VariableDeclarator', function (emitted) {
			emitted.exit.should.be.type ('boolean');
			emitted.node.should.be.type ('object');
			emitted.node.should.have.ownProperty ('parent');
			emitted.node.parent.should.be.type ('object');
			emitted.node.parent.should.have.ownProperty ('type');
			emitted.node.id.name.should.equal ('foo');

			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		Solium.on ('Identifier', function () {
			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		Solium.on ('Literal', function () {
			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		//without any rules applied
		var errorObjects = Solium.lint (minimalSourceCode, minimalConfig, true);
		errorObjects.length.should.equal (0);
	});

	it ('should function as expected even if a Buffer object is provided instead of String', function (done) {
		var minimalConfig = { rules: {} },
			minimalSourceCode = new Buffer (wrappers.toFunction ('var foo = 100;'));
		var emissionCounter = 5;

		function testComplete () {
			Solium.reset ();
			done ();
		}

		Solium.on ('Program', function () {
			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		Solium.on ('VariableDeclaration', function () {
			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		Solium.on ('VariableDeclarator', function (emitted) {
			emitted.exit.should.be.type ('boolean');
			emitted.node.should.be.type ('object');
			emitted.node.should.have.ownProperty ('parent');
			emitted.node.parent.should.be.type ('object');
			emitted.node.parent.should.have.ownProperty ('type');
			emitted.node.id.name.should.equal ('foo');

			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		Solium.on ('Identifier', function () {
			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		Solium.on ('Literal', function () {
			--emissionCounter;
			!emissionCounter && testComplete ();
		});

		//without any rules applied
		var errorObjects = Solium.lint (minimalSourceCode, minimalConfig, true);
		errorObjects.length.should.equal (0);
	});

	it ('should accept both deprecated and current config formats without any issue', function (done) {
		var deprecated = {
			'custom-rules-filename': null,
			rules: {
				'pragma-on-top': true,
				'lbrace': false,
				'mixedcase': true
			}
		};

		var current1 = {
			"extends": "solium:all",
			"rules": {
				"pragma-on-top": "off",
				"no-with": "warning",
				"deprecated-suicide": "error",
				"variable-declarations": 0,
				"imports-on-top": 1,
				"array-declarations": 2,
				"operator-whitespace": ["off"],
				"lbrace": ["warning"],
				"mixedcase": ["error"],
				"camelcase": [0],
				"uppercase": [1],
				"double-quotes": [2]
			},
			"options": { "autofix": false }
		};

		var current2 = {
			"extends": "solium:all"
		};

		var current3 = {
			"rules": {
				"deprecated-suicide": "error",
				"variable-declarations": 0,
				"imports-on-top": 1
			}
		};

		var minimalSourceCode = wrappers.toFunction ('var foo = 100;');

		Solium.lint.bind (Solium, minimalSourceCode, deprecated).should.not.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, current1).should.not.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, current2).should.not.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, current3).should.not.throw ();

		Solium.reset ();
		done ();
	});

	// Testing entire fix mechanism
	it ('should handle all valid inputs supplied to lintAndFix()', function (done) {
		// Since lintAndFix() internally first goes through lint(), we need not test the things
		// already tested in lint().
		var fixResults = [], code = 'contract Foo {}';

		var config = {
			rules: {
				lbrace: 'warning'
			}
		};

		fixResults.push (Solium.lintAndFix (code, config));
		fixResults.push (Solium.lintAndFix (Buffer (code), config));

		fixResults.forEach (function (f) {
			f.should.be.type ('object');
			f.should.have.ownProperty ('originalSourceCode');
			f.originalSourceCode.should.equal (code);
			f.should.have.ownProperty ('fixedSourceCode');
			f.fixedSourceCode.should.equal (code);
			f.should.have.ownProperty ('fixesApplied');
			f.fixesApplied.should.be.Array ();
			f.fixesApplied.length.should.equal (0);
			f.should.have.ownProperty ('errorMessages');
			f.errorMessages.should.be.Array ();
			f.errorMessages.length.should.equal (0);
		});

		// Should return fixed code now
		code = 'contract Foo {string name = "Dua";}';
		config.rules = {
			quotes: ['error', 'single']
		};

		fixResults = Solium.lintAndFix (code, config);
		var fixedCode = code.replace (/"/g, '\'');

		fixResults.should.be.type ('object');
		fixResults.should.have.ownProperty ('originalSourceCode');
		fixResults.originalSourceCode.should.equal (code);
		fixResults.should.have.ownProperty ('fixedSourceCode');
		fixResults.fixedSourceCode.should.equal (fixedCode);

		fixResults.should.have.ownProperty ('errorMessages');
		fixResults.errorMessages.should.be.empty ();

		fixResults.should.have.ownProperty ('fixesApplied');
		fixResults.fixesApplied.should.be.Array ();
		fixResults.fixesApplied.length.should.equal (1);
		fixResults.fixesApplied [0].should.be.type ('object');
		fixResults.fixesApplied [0].should.have.ownProperty ('fix');
		fixResults.fixesApplied [0].fix.should.be.type ('object');
		fixResults.fixesApplied [0].fix.should.have.ownProperty ('range');
		fixResults.fixesApplied [0].fix.should.have.ownProperty ('text');
		fixResults.fixesApplied [0].fix.text.should.equal ('\'Dua\'');
		fixResults.fixesApplied [0].fix.range.should.be.Array ();
		fixResults.fixesApplied [0].fix.range.length.should.equal (2);
		fixResults.fixesApplied [0].fix.range [0].should.equal (28);
		fixResults.fixesApplied [0].fix.range [1].should.equal (33);

		Solium.reset ();
		done ();
	});

	it ('should handle fix-related issues that arise in Solium.report()', function (done) {
		var error = {
			ruleName: 'sample',
			type: 'warning',
			message: 'sample message',
			location: {
				line: 10,
				column: 17
			},
			ruleMeta: meta,	// Doesn't contain "fixable" property initially
			fix: function (fixer) { return []; },
			node: {
				type: 'Literal',
				start: 1,
				end: 10
			}
		};

		// After reporting an error containing "fix" but no "ruleMeta.fixable" property,
		// Solium should also report an internal error that the fix was ignored.
		Solium.report (error);

		var errors = Solium.lint ('contract Foo {}', {
			rules: {}, options: { returnInternalIssues: true }
		}, true);

		errors.should.be.Array ();
		errors.length.should.equal (2);

		// First item should be the internal error
		errors [0].should.be.type ('object');
		errors [0].should.have.ownProperty ('type');
		errors [0].should.have.ownProperty ('internal');
		errors [0].type.should.equal ('warning');
		errors [0].internal.should.equal (true);

		// Second item should be the error actually report()ed
		errors [1].should.be.type ('object');
		['ruleName', 'type', 'message'].forEach (function (key) {
			errors [1] [key].should.equal (error [key]);
		});

		error.ruleMeta.fixable = 'space';
		Solium.report.bind (Solium, error).should.throw ();

		error.ruleMeta.fixable = 'whitespace';
		error.fix = 10902.897;	// invalid value for "fix"
		Solium.report.bind (Solium, error).should.throw ();

		error.fix = function (f) { return []; }
		Solium.report.bind (Solium, error).should.not.throw ();

		Solium.reset ();
		done ();
	});

});
