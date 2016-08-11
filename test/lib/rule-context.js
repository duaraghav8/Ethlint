/**
 * @fileoverview Tests for rules.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var RuleContext = require ('../../lib/rule-context'),
	Solium = require ('../../lib/solium'),
	_ = require ('lodash');

describe ('Testing RuleContext object', function () {

	it ('should create a RuleContext instance and expose an API when valid arguments are passed', function (done) {
		var ruleMeta = {
			enabled: true,
			recommended: true,
			type: 'warning',
			description: 'boo!',
			id: 1,
			custom: false
		};
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

});