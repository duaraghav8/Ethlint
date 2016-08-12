/**
 * @fileoverview Tests for lib/rule-context.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var RuleContext = require ('../../lib/rule-context'),
	Solium = require ('../../lib/solium'),
	_ = require ('lodash');

describe ('Testing RuleContext object', function () {
	var ruleMeta = {
		enabled: true,
		recommended: true,
		type: 'test-warning',
		description: 'boo!',
		id: 1,
		custom: false
	};
	var sourceCode = 'contract Visual {\n\tfunction foobar () {}\n}';

	it ('should create a RuleContext instance and expose an API when valid arguments are passed', function (done) {
		var rcObject = new RuleContext ('foo', ruleMeta, Solium);

		rcObject.should.be.type ('object');
		rcObject.should.be.instanceOf (RuleContext);

		rcObject.should.have.ownProperty ('getSourceCode');
		rcObject.getSourceCode.should.be.type ('function');

		rcObject.should.have.ownProperty ('on');
		rcObject.on.should.be.type ('function');

		rcObject.should.have.ownProperty ('report');
		rcObject.report.should.be.type ('function');

		//read-only properties
		rcObject.should.have.ownProperty ('name');
		rcObject.name.should.be.type ('string');
		Object.getOwnPropertyDescriptor (rcObject, 'name').writable.should.equal (false);	//check for read-only

		rcObject.should.have.ownProperty ('meta');
		rcObject.meta.should.be.type ('object');
		_.isEqual (rcObject.meta, ruleMeta).should.equal (true);
		Object.getOwnPropertyDescriptor (rcObject, 'meta').writable.should.equal (false);	//check for read-only

		done ();
	});

	it ('should behave as expected upon calling getSourceCode ()', function (done) {
		var rcObject, scObject;

		Solium.lint (sourceCode, { rules: {} });
		rcObject = new RuleContext ('foo', ruleMeta, Solium);
		scObject = rcObject.getSourceCode ();

		scObject.should.be.type ('object');
		scObject.constructor.name.should.equal ('SourceCode');
		scObject.should.have.ownProperty ('text', sourceCode);

		Solium.reset ();
		done ();
	});

	it ('should behave as expected upon calling report ()', function (done) {
		var rcObject = new RuleContext ('foo', ruleMeta, Solium);

		rcObject.report ({
			node: {type: 'TestNode', start: 0, end: 2},
			message: 'test run'
		});
		var errorObjects = Solium.lint (sourceCode, { rules: {} }, true);

		errorObjects.length.should.equal (1);
		var err = errorObjects [0];

		err.should.be.type ('object');
		err.should.have.ownProperty ('ruleName', 'foo');
		err.should.have.ownProperty ('type', 'test-warning');
		err.should.have.ownProperty ('node');
		err.node.should.be.type ('object');
		err.node.should.have.ownProperty ('type', 'TestNode');
		err.should.have.ownProperty ('message', 'test run');
		err.should.have.ownProperty ('line', 1);
		err.should.have.ownProperty ('column', 0);

		Solium.reset ();
		done ();
	});

	it ('should behave as expected upon calling on ()', function (done) {
		var rcObject = new RuleContext ('foo', ruleMeta, Solium);

		rcObject.on ('ContractStatement', function (emitted) {
			Solium.reset ();
			done ();
		});

		Solium.lint (sourceCode, { rules: {} }, true);
	});

});