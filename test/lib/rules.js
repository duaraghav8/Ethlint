/**
 * @fileoverview Tests for lib/rules.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var rules = require ('../../lib/rules'),
	path = require ('path');

describe ('Checking exported rules object', function () {

	it ('should be an object that exposes a set of functions', function (done) {
		rules.should.be.type ('object');

		rules.should.have.ownProperty ('loadUsingDeprecatedConfigFormat');
		rules.loadUsingDeprecatedConfigFormat.should.be.type ('function');

		rules.should.have.ownProperty ('get');
		rules.get.should.be.type ('function');

		rules.should.have.ownProperty ('reset');
		rules.reset.should.be.type ('function');

		rules.should.have.ownProperty ('load');
		rules.load.should.be.type ('function');

		rules.should.have.ownProperty ('getRuleSeverity');
		rules.getRuleSeverity.should.be.type ('function');

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

	it ('should handle invalid arguments passed to rules.loadUsingDeprecatedConfigFormat ()', function (done) {
		//invalid userRules object
		rules.loadUsingDeprecatedConfigFormat.bind (rules).should.throw ();
		rules.loadUsingDeprecatedConfigFormat.bind (rules, null).should.throw ();
		rules.loadUsingDeprecatedConfigFormat.bind (rules, []).should.throw ();

		//valid userRules object
		rules.loadUsingDeprecatedConfigFormat.bind (rules, {}).should.not.throw ();

		//specified rule is neither pre-defined nor custom
		rules.loadUsingDeprecatedConfigFormat.bind (rules, {'NON_EXISTANT_RULE_1': true}).should.throw ();

		rules.loadUsingDeprecatedConfigFormat.bind (rules, {}, 'blahblah.txt').should.throw ();	//giving a non-existent file for customRulesFilePath
		
		done ();
	});

	it ('should return a rule object after valid call to loadUsingDeprecatedConfigFormat () & get ()', function (done) {
		var config = { 'mixedcase': true, 'camelcase': false, 'CUSTOM_RULE': true, 'lbrace': true };
		rules.loadUsingDeprecatedConfigFormat (config, path.join (__dirname, '../extras/custom-rules-file.js'));
		
		var ret = rules.get ('mixedcase');
		ret.should.be.type ('object');
		ret.should.have.ownProperty ('verify');
		ret.verify.should.be.type ('function');

		ret = rules.get ('camelcase');
		(typeof ret).should.equal ('undefined');

		ret = rules.get ('CUSTOM_RULE');
		ret.should.be.type ('object');
		ret.should.have.ownProperty ('verify');
		ret.verify.should.be.type ('function');

		//overlapping rule - lbrace (custom) should overwrite lbrace (pre-defined)
		ret = rules.get ('lbrace');
		ret.should.be.type ('object');
		ret.should.have.ownProperty ('verify');
		ret.verify.should.be.type ('function');

		//rule definition exists in the file but shouldn't be included in rules because we don't enable it
		ret = rules.get ('not-included');
		(typeof ret).should.equal ('undefined');

		rules.reset ();

		done ();
	});

	it ('rules set to false to be deleted, rest (pre-defined) should be expanded with rule meta info in loadUsingDeprecatedConfigFormat()', function (done) {
		var config = {
			'mixedcase': true,
			'camelcase': false,
			'lbrace': true,
			'CUSTOM_RULE': true,	//not defined in config/solium.json, is a user-defined rule,
			'NON_EXISTANT_RULE_2': false
		};

		rules.loadUsingDeprecatedConfigFormat (config, path.join (__dirname, '../extras/custom-rules-file.js'));

		config.should.be.type ('object');
		config.should.not.have.ownProperty ('camelcase');
		config.should.not.have.ownProperty ('NON_EXISTANT_RULE_2');

		//a non-existant rule set to true must NOT be deleted by load (), this might be a custom-defined rule

		config.should.have.ownProperty ('mixedcase');
		config.mixedcase.should.be.type ('object');
		config.mixedcase.should.have.ownProperty ('enabled', true);
		config.mixedcase.should.have.ownProperty ('custom', false);
		config.mixedcase.should.have.ownProperty ('recommended');
		config.mixedcase.recommended.should.be.type ('boolean');
		config.mixedcase.should.have.ownProperty ('type');
		config.mixedcase.should.have.ownProperty ('description');
		config.mixedcase.should.have.ownProperty ('id');
		config.mixedcase.id.should.be.type ('number');

		config.should.have.ownProperty ('CUSTOM_RULE');
		config.CUSTOM_RULE.should.be.type ('object');
		config.CUSTOM_RULE.should.have.ownProperty ('enabled', true);
		config.CUSTOM_RULE.should.have.ownProperty ('custom', false);
		config.CUSTOM_RULE.should.have.ownProperty ('type');
		config.CUSTOM_RULE.type.should.equal ('custom-error');
		config.CUSTOM_RULE.should.have.ownProperty ('id');
		config.CUSTOM_RULE.id.should.be.type ('number');

		config.should.have.ownProperty ('lbrace');
		config.lbrace.should.be.type ('object');
		config.lbrace.should.have.ownProperty ('enabled', true);
		config.lbrace.should.have.ownProperty ('custom', false);
		config.lbrace.should.have.ownProperty ('type');
		config.lbrace.type.should.equal ('custom-error');
		config.lbrace.should.have.ownProperty ('id');
		config.lbrace.id.should.be.type ('number');

		done ();
	});

	it ('should handle invalid arguments passed to getRuleSeverity()', function (done) {
		rules.getRuleSeverity.bind (rules).should.throw ();
		rules.getRuleSeverity.bind (rules, undefined).should.throw ();
		rules.getRuleSeverity.bind (rules, null).should.throw ();
		rules.getRuleSeverity.bind (rules, {}).should.throw ();
		rules.getRuleSeverity.bind (rules, 19.8927).should.throw ();
		rules.getRuleSeverity.bind (rules, -1).should.throw ();
		rules.getRuleSeverity.bind (rules, 3).should.throw ();
		rules.getRuleSeverity.bind (rules, 19028).should.throw ();
		rules.getRuleSeverity.bind (rules, 'arbitrary').should.throw ();
		rules.getRuleSeverity.bind (rules, {a: true, b: 'c'}).should.throw ();
		rules.getRuleSeverity.bind (rules, []).should.throw ();
		rules.getRuleSeverity.bind (rules, [null]).should.throw ();

		done ();
	});

	it ('should return severity integer when a valid config value is passed', function (done) {
		rules.getRuleSeverity (0).should.equal (0);
		rules.getRuleSeverity (1).should.equal (1);
		rules.getRuleSeverity (2).should.equal (2);
		rules.getRuleSeverity ('off').should.equal (0);
		rules.getRuleSeverity ('warning').should.equal (1);
		rules.getRuleSeverity ('error').should.equal (2);
		rules.getRuleSeverity ([0]).should.equal (0);
		rules.getRuleSeverity ([1]).should.equal (1);
		rules.getRuleSeverity ([2]).should.equal (2);
		rules.getRuleSeverity (['off']).should.equal (0);
		rules.getRuleSeverity (['warning']).should.equal (1);
		rules.getRuleSeverity (['error']).should.equal (2);

		done ();
	});

});
