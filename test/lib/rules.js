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
		
		done ();
	});

	it ('should return a rule object after valid call to loadUsingDeprecatedConfigFormat () & get ()', function (done) {
		var config = { 'mixedcase': true, 'camelcase': false, 'lbrace': true };
		rules.loadUsingDeprecatedConfigFormat (config, path.join (__dirname, '../extras/custom-rules-file.js'));
		
		var ret = rules.get ('mixedcase');
		ret.should.be.type ('object');
		ret.should.have.ownProperty ('verify');
		ret.verify.should.be.type ('function');

		ret = rules.get ('camelcase');
		(typeof ret).should.equal ('undefined');

		//overlapping rule - lbrace (custom) should overwrite lbrace (pre-defined)
		ret = rules.get ('lbrace');
		ret.should.be.type ('object');
		ret.should.have.ownProperty ('verify');
		ret.verify.should.be.type ('function');

		//rule definition exists in the file but shouldn't be included in rules because we don't enable it
		ret = rules.get ('not-included');
		(typeof ret).should.equal ('undefined');

		/*
		getting CUSTOM_RULE should throw since Solium v1 removes the use of "custom-rules-filename" attribute
		ret = rules.get ('CUSTOM_RULE');
		ret.should.be.type ('object');
		ret.should.have.ownProperty ('verify');
		ret.verify.should.be.type ('function');
		*/

		config = { 'CUSTOM_RULE': true };
		rules.loadUsingDeprecatedConfigFormat.bind (rules, config, path.join (__dirname, '../extras/custom-rules-file.js')).should.throw ();

		rules.reset ();
		done ();
	});

	it ('rules set to false to be deleted, rest (pre-defined) should be expanded with rule meta info in loadUsingDeprecatedConfigFormat()', function (done) {
		var config = {
			'mixedcase': true,
			'camelcase': false,
			'lbrace': true,
			'NON_EXISTANT_RULE_2': false
		};

		rules.loadUsingDeprecatedConfigFormat (config, path.join (__dirname, '../extras/custom-rules-file.js'));

		config.should.be.type ('object');
		config.should.not.have.ownProperty ('camelcase');
		config.should.not.have.ownProperty ('NON_EXISTANT_RULE_2');

		//a non-existant rule set to true must NOT be deleted by load (), this might be a custom-defined rule

		config.should.have.ownProperty ('mixedcase');
		config.mixedcase.should.be.type ('object');
		config.mixedcase.should.have.ownProperty ('enabled');
		config.mixedcase.enabled.should.equal (true);
		config.mixedcase.should.have.ownProperty ('custom');
		config.mixedcase.custom.should.equal (false);
		config.mixedcase.should.have.ownProperty ('recommended');
		config.mixedcase.recommended.should.be.type ('boolean');
		config.mixedcase.should.have.ownProperty ('type');
		config.mixedcase.should.have.ownProperty ('description');
		config.mixedcase.should.have.ownProperty ('id');
		config.mixedcase.id.should.be.type ('number');

		config.should.have.ownProperty ('lbrace');
		config.lbrace.should.be.type ('object');
		config.lbrace.should.have.ownProperty ('enabled');
		config.lbrace.enabled.should.equal (true);
		config.lbrace.should.have.ownProperty ('custom');
		config.lbrace.custom.should.equal (false);
		config.lbrace.should.have.ownProperty ('type');
		config.lbrace.type.should.equal ('error');
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

	it ('should load rules from the new config format using load() when both "extends" & "rules" are passed', function (done) {
		var config = {
			"extends": "solium:all",
			"rules": {
				"pragma-on-top": "off",
				"no-with": "warning",
				"deprecated-suicide": "error",
				"variable-declarations": 0,
				"imports-on-top": 1,
				"array-declarations": 2,
				"operator-whitespace": ["off", "double"],
				"lbrace": ["warning", 1, 2, {a: 100, h: "world"}],
				"mixedcase": ["error"],
				"camelcase": [0, 100, "hello", 9.283],
				"uppercase": [1],
				"double-quotes": [2, "double"]
			},
			"options": { "autofix": false }
		};

		var ruleDescriptions = rules.load (config);

		ruleDescriptions.should.be.type ('object');

		ruleDescriptions.should.not.have.ownProperty ('pragma-on-top');
		ruleDescriptions.should.not.have.ownProperty ('variable-declarations');
		ruleDescriptions.should.not.have.ownProperty ('operator-whitespace');
		ruleDescriptions.should.not.have.ownProperty ('camelcase');

		ruleDescriptions ['no-with'].type.should.equal ('warning');
		ruleDescriptions ['imports-on-top'].type.should.equal ('warning');
		ruleDescriptions ['lbrace'].type.should.equal ('warning');
		ruleDescriptions ['uppercase'].type.should.equal ('warning');

		ruleDescriptions ['deprecated-suicide'].type.should.equal ('error');
		ruleDescriptions ['array-declarations'].type.should.equal ('error');
		ruleDescriptions ['mixedcase'].type.should.equal ('error');
		ruleDescriptions ['double-quotes'].type.should.equal ('error');

		// We extend ALL solium core rules and eliminate a few by setting their severity to 0.
		// The rest of the rules should all be available.
		// The below count will keep changing with every change in the number of core rules that exist in solium.
		Object.keys (ruleDescriptions).length.should.equal (19);

		done ();
	});

	it ('should load rules from the new config format using load() when only "rules" is passed', function (done) {
		var config = {
			"rules": {
				"pragma-on-top": "off",
				"no-with": "warning",
				"deprecated-suicide": "error",
				"variable-declarations": 0,
				"imports-on-top": 1,
				"array-declarations": 2,
				"operator-whitespace": ["off", "double"],
				"lbrace": ["warning", 1, 2, {a: 100, h: "world"}],
				"mixedcase": ["error"],
				"camelcase": [0, 100, "hello", 9.283],
				"uppercase": [1],
				"double-quotes": [2, "double"]
			}
		};

		var ruleDescriptions = rules.load (config);

		ruleDescriptions.should.be.type ('object');

		ruleDescriptions.should.not.have.ownProperty ('pragma-on-top');
		ruleDescriptions.should.not.have.ownProperty ('variable-declarations');
		ruleDescriptions.should.not.have.ownProperty ('operator-whitespace');
		ruleDescriptions.should.not.have.ownProperty ('camelcase');

		ruleDescriptions ['no-with'].type.should.equal ('warning');
		ruleDescriptions ['imports-on-top'].type.should.equal ('warning');
		ruleDescriptions ['lbrace'].type.should.equal ('warning');
		ruleDescriptions ['uppercase'].type.should.equal ('warning');

		ruleDescriptions ['deprecated-suicide'].type.should.equal ('error');
		ruleDescriptions ['array-declarations'].type.should.equal ('error');
		ruleDescriptions ['mixedcase'].type.should.equal ('error');
		ruleDescriptions ['double-quotes'].type.should.equal ('error');

		// Check for existence of options
		ruleDescriptions ['lbrace'].should.have.ownProperty ('options');
		ruleDescriptions ['lbrace'].options.should.be.Array ();

		ruleDescriptions ['double-quotes'].should.have.ownProperty ('options');
		ruleDescriptions ['double-quotes'].options.should.be.Array ();

		// Check for options contents
		ruleDescriptions ['lbrace'].options.length.should.equal (3);
		ruleDescriptions ['lbrace'].options [0].should.equal (1);

		ruleDescriptions ['double-quotes'].options.length.should.equal (1);
		ruleDescriptions ['double-quotes'].options [0].should.equal ('double');

		// There should be exactly 8 properties - the rules described in "rules" with severity > 0.
		Object.keys (ruleDescriptions).length.should.equal (8);

		done ();
	});

});
