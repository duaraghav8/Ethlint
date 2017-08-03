/**
 * @fileoverview Tests for lib/solium.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../lib/solium'),
	wrappers = require ('../utils/wrappers'),
	EventEmitter = require ('events').EventEmitter;

describe ('Checking Exported Solium API', function () {

	it ('should be an instance of EventEmitter & expose a set of functions', function (done) {
		Solium.should.be.type ('object');
		Solium.should.be.instanceof (EventEmitter);
		
		Solium.should.have.ownProperty ('reset');
		Solium.reset.should.be.type ('function');
		Solium.should.have.ownProperty ('lint');
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

		sourceCode.should.have.ownProperty ('text', '');

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

	it ('should handle invalid arguments when calling Solium.report ()', function (done) {
		var astValidationMessageRegExp = /AST/,
			messageValidationRegExp = /error description/;
		
		//basic validation
		Solium.report.bind (Solium, null).should.throw ('Invalid error object');
		Solium.report.bind (Solium).should.throw ('Invalid error object');

		//isASTNode validation
		Solium.report.bind (Solium, {node: null}).should.throw (astValidationMessageRegExp);
		Solium.report.bind (Solium, {node: undefined}).should.throw (astValidationMessageRegExp);
		Solium.report.bind (Solium, {node: 100}).should.throw (astValidationMessageRegExp);
		Solium.report.bind (Solium, {node:{}}).should.throw (astValidationMessageRegExp);
		Solium.report.bind (Solium, {node: {type: 100}}).should.throw (astValidationMessageRegExp);

		//message validation
		Solium.report.bind (Solium, {node: {type: 'Type'}}).should.throw (messageValidationRegExp);
		Solium.report.bind (Solium, {node: {type: 'Type'}, message: ''}).should.throw (messageValidationRegExp);
		Solium.report.bind (Solium, {node: {type: 'Type'}, message: null}).should.throw (messageValidationRegExp);
		Solium.report.bind (Solium, {node: {type: 'Type'}, message: 100}).should.throw (messageValidationRegExp);

		//should not throw error with minimal valid object
		Solium.report.bind (Solium, {node: {type: 'Type'}, message: 'H', ruleMeta: {}}).should.not.throw ();
		Solium.reset ();	//clear everything

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
			ruleMeta: {}
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

		//config object validation
		Solium.lint.bind (Solium, minimalSourceCode).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {rules: null}).should.throw ();
		Solium.lint.bind (Solium, minimalSourceCode, {rules: 'foo'}).should.throw ();

		//minimal valid arguments
		Solium.lint.bind (Solium, minimalSourceCode, minimalConfig).should.not.throw ();
		Solium.reset ();

		done ();
	});

	it ('should not alter the configuration passed by user in any way', function (done) {
		var userConfig = {
			'custom-rules-file': null,
			rules: {
				'mixedcase': true,
				'camelcase': false
			}
		};
		var minimalSourceCode = wrappers.toFunction ('var foo = 100;');

		Solium.lint (minimalSourceCode, userConfig);

		userConfig.should.be.type ('object');
		userConfig.should.have.ownProperty ('custom-rules-file', null);
		userConfig.should.have.ownProperty ('rules');
		userConfig.rules.should.be.type ('object');
		userConfig.rules.should.have.ownProperty ('mixedcase', true);
		userConfig.rules.should.have.ownProperty ('camelcase', false);
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

});
