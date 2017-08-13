/**
 * @fileoverview Tests for rule-loader
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var ruleLoader = require ('../../../lib/utils/rule-loader');

describe ('Test rule-loader functions', function () {

	it ('should expose a set of functions', function (done) {
		ruleLoader.should.have.ownProperty ('resolveUpstream');
		ruleLoader.resolveUpstream.should.be.type ('function');

		ruleLoader.should.have.ownProperty ('load');
		ruleLoader.load.should.be.type ('function');

		done ();
	});

	it ('should expose a set of constants', function (done) {
		ruleLoader.should.have.ownProperty ('constants');
		ruleLoader.constants.should.be.type ('object');

		ruleLoader.constants.should.have.ownProperty ('SOLIUM_RULESET_ALL');
		ruleLoader.constants.SOLIUM_RULESET_ALL.should.be.type ('string');

		ruleLoader.constants.should.have.ownProperty ('SOLIUM_CORE_RULES_DIRNAME');
		ruleLoader.constants.SOLIUM_CORE_RULES_DIRNAME.should.be.type ('string');

		ruleLoader.constants.should.have.ownProperty ('SOLIUM_CORE_RULES_DIRPATH');
		ruleLoader.constants.SOLIUM_CORE_RULES_DIRPATH.should.be.type ('string');

		done ();
	});

	it ('should handle invalid input given to resolveUpstream()', function (done) {
		ruleLoader.resolveUpstream.bind (ruleLoader).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, undefined).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, null).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, 0).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, 11).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, -192).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, function foo () {}).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, []).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, [11]).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, {}).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, {a: 11}).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, true).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, false).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, 10.2897).should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, '').should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, 'hello world').should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, 'soliu').should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, 'olium:all').should.throw ();
		ruleLoader.resolveUpstream.bind (ruleLoader, ':').should.throw ();

		done ();
	});

	it ('should return expected result when valid upstream value is passed', function (done) {
		var result = ruleLoader.resolveUpstream (ruleLoader.constants.SOLIUM_RULESET_ALL);
		result.should.be.type ('object');

		done ();
	});

	it ('should throw when non-existent rule names are given to load()', function (done) {
		ruleLoader.load.bind (ruleLoader, ['nihi2yo87isuhlush']).should.throw ();

		done ();
	});

	it ('should return empty object when empty list is given to load()', function (done) {
		var result = ruleLoader.load ([]);

		result.should.be.type ('object');
		Object.keys (result).length.should.equal (0);

		done ();
	});

});