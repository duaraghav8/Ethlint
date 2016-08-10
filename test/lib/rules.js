/**
 * @fileoverview Tests for rules.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var rules = require ('../../lib/rules');

describe ('Checking exported rules object', function () {

	it ('should be an object that exposes a set of functions', function (done) {
		rules.should.be.type ('object');
		rules.should.have.ownProperty ('load');
		rules.load.should.be.type ('function');
		rules.should.have.ownProperty ('get');
		rules.get.should.be.type ('function');

		done ();
	});

	it ('should handle invalid arguments passed to rules.get ()', function (done) {
		rules.get.bind (rules).should.throw ();
		rules.get.bind (rules, null).should.throw ();
		rules.get.bind (rules, 100).should.throw ();
		rules.get.bind (rules, '').should.throw ();

		rules.get.bind (rules, 'foobar').should.not.throw ();

		done ();
	});

	it ('should handle invalid arguments passed to rules.load ()', function (done) {
		//invalid userRules object
		rules.load.bind (rules).should.throw ();
		rules.load.bind (rules, null).should.throw ();
		rules.load.bind (rules, []).should.throw ();

		//valid userRules object
		rules.load.bind (rules, {}).should.not.throw ();

		rules.load.bind (rules, {}, 'blahblah.txt').should.throw ();	//giving a non-existent file
		
		done ();
	});

});