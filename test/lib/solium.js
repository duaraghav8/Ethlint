/**
 * @fileoverview Tests for Solium.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var Solium = require ('../../lib/solium'),
	EventEmitter = require ('events').EventEmitter;

describe ('Checking Exported Solium API', function () {

	it ('should be an instance of EventEmitter & expose a set of functions', function (done) {
		Solium.should.be.type ('object');
		Solium.should.be.instanceof (EventEmitter);
		
		Solium.should.have.ownProperty ('reset');
		(typeof Solium.reset).should.equal ('function');
		Solium.should.have.ownProperty ('lint');
		(typeof Solium.lint).should.equal ('function');
		Solium.should.have.ownProperty ('report');
		(typeof Solium.report).should.equal ('function');
		Solium.should.have.ownProperty ('getSourceCode');
		(typeof Solium.getSourceCode).should.equal ('function');

		done ();
	});

	it ('should return a SourceCode instance upon calling Solium.getSourceCode ()', function (done) {
		var sourceCode = Solium.getSourceCode ();

		sourceCode.should.be.type ('object');
		sourceCode.constructor.name.should.equal ('SourceCode');

		sourceCode.should.have.ownProperty ('text');
		should.equal (sourceCode.text, null);

		sourceCode.should.have.property ('getLine');
		(typeof sourceCode.getLine).should.equal ('function');
		sourceCode.should.have.property ('getColumn');
		(typeof sourceCode.getColumn).should.equal ('function');
		sourceCode.should.have.property ('getParent');
		(typeof sourceCode.getParent).should.equal ('function');

		sourceCode.should.have.property ('getText');
		(typeof sourceCode.getText).should.equal ('function');

		sourceCode.should.have.property ('getNextChar');
		(typeof sourceCode.getNextChar).should.equal ('function');
		sourceCode.should.have.property ('getPrevChar');
		(typeof sourceCode.getPrevChar).should.equal ('function');
		sourceCode.should.have.property ('getNextChars');
		(typeof sourceCode.getNextChars).should.equal ('function');
		sourceCode.should.have.property ('getPrevChars');
		(typeof sourceCode.getPrevChars).should.equal ('function');

		done ();
	});

	it ('should be completely reset after call to Solium.reset ()', function (done) {
		Solium.reset ();

		var minmalConfig = { rules: {} };
		var sourceCode = Solium.getSourceCode ();
		var errorMessages = Solium.lint ('var foo = 100;', minmalConfig, true)

		sourceCode.text.should.equal ('');
		(sourceCode.getText ()).should.equal (sourceCode.text);

		errorMessages.should.be.instanceof (Array);
		errorMessages.length.should.equal (0);

		Object.keys (Solium._events).length.should.equal (0);

		done ();
	});

	it ('should push a sample error object in messages upong calling Solium.report ()', function (done) {
		var sampleErrorObject = {
			ruleName: 'sample',
			type: 'error',
			node: {
				type: 'Type',
				start: 0,
				end: 3
			},
			location: {	line: 1, column: 2 },
			message: 'boo!'
		};
		var minmalConfig = { rules: {} };

		Solium.report (sampleErrorObject);

		var errorObjects = Solium.lint ('var foo = 100;', minmalConfig, true),
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

	it ('should handle invalid arguments when calling Solium.report ()', function (done) {
		var astValidationMessageRegExp = /AST/,
			messageValidationRegExp = /error description/;
		
		//basic validation
		Solium.report.bind (null, null).should.throw ('Invalid error object');
		Solium.report.bind (null).should.throw ('Invalid error object');

		//isASTNode validation
		Solium.report.bind (null, {node: null}).should.throw (astValidationMessageRegExp);
		Solium.report.bind (null, {node: undefined}).should.throw (astValidationMessageRegExp);
		Solium.report.bind (null, {node: 100}).should.throw (astValidationMessageRegExp);
		Solium.report.bind (null, {node:{}}).should.throw (astValidationMessageRegExp);
		Solium.report.bind (null, {node: {type: 100}}).should.throw (astValidationMessageRegExp);

		//message validation
		Solium.report.bind (null, {node: {type: 'Type'}}).should.throw (messageValidationRegExp);
		Solium.report.bind (null, {node: {type: 'Type'}, message: ''}).should.throw (messageValidationRegExp);
		Solium.report.bind (null, {node: {type: 'Type'}, message: null}).should.throw (messageValidationRegExp);
		Solium.report.bind (null, {node: {type: 'Type'}, message: 100}).should.throw (messageValidationRegExp);

		//should not throw error with minimal valid object
		Solium.report.bind (null, {node: {type: 'Type'}, message: 'H'}).should.not.throw ();
		Solium.reset ();	//clear everything


		done ();
	});

});