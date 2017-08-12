/**
 * @fileoverview Tests for rule-inspector
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var ruleInspector = require ('../../../lib/utils/rule-inspector');

describe ('Test rule-inspector functions', function () {

	it ('should expose a set of functions', function (done) {
		ruleInspector.should.have.ownProperty ('isAValidRuleObject');
		ruleInspector.isAValidRuleObject.should.be.type ('function');

		ruleInspector.should.have.ownProperty ('areValidOptionsPassed');
		ruleInspector.areValidOptionsPassed.should.be.type ('function');

		done ();
	});

	it ('should correctly classify all valid rule objects', function (done) {
		var configObjects = [];

		// Complete object
		configObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": "This is a rule"
				},
				"schema": [],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		// No fixable
		configObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": "This is a rule"
				},
				"schema": []
			},
			"verify": function (context) {}
		});

		// Schemas for passed options
		configObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": "This is a rule"
				},
				"schema": [
					{ type: 'string', minLength: 5 },
					{ type: 'object', properties: {modifies: {type: 'boolean'}} },
					{ type: 'integer', minimum: 0, maximum: 69 }
				]
			},
			"verify": function (context) {}
		});
		
		configObjects.forEach (function (c) {
			ruleInspector.isAValidRuleObject (c).should.equal (true);
		});

		done ();
	});

	it ('should correctly classify all invalid rule objects', function (done) {
		var invalidConfigObjects = [, null, undefined, 0, '', 'harry potter', -190, 8927, 88.2891, [], [{}], [0], {}, function () {}];

		// No verify attr
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": "This is a rule"
				},
				"schema": [],
				"fixable": "code"
			}
		});

		// No meta attr
		invalidConfigObjects.push ({
			"verify": function (context) {}
		});

		// Invalid value for verify
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": "This is a rule"
				},
				"schema": [],
				"fixable": "code"
			},
			"verify": "jon snow dies"
		});

		// Invalid value for meta
		invalidConfigObjects.push ({
			"meta": [10, {}, null],
			"verify": function (context) {}
		});

		// No meta.docs
		invalidConfigObjects.push ({
			"meta": {
				"schema": []
			},
			"verify": function (context) {}
		});

		// No meta.schema
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": "This is a rule"
				}
			},
			"verify": function (context) {}
		});

		// Invalid meta.docs
		invalidConfigObjects.push ({
			"meta": {
				"docs": null,
				"schema": [],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		// Invalid meta.schema
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": "This is a rule"
				},
				"schema": [1, "think again"],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		// Invalid meta.fixable
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": "This is a rule"
				},
				"schema": [],
				"fixable": "somerandomnonsense"
			},
			"verify": function (context) {}
		});

		// No meta.docs.recommended
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"type": "error",
					"description": "This is a rule"
				},
				"schema": [],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		// No meta.docs.type
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"description": "This is a rule"
				},
				"schema": [],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		// No meta.docs.description
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error"
				},
				"schema": [],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		// Invalid meta.docs.recommended
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": 0,
					"type": "error",
					"description": "This is a rule"
				},
				"schema": [],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		// Invalid meta.docs.type
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "woo woo",
					"description": "This is a rule"
				},
				"schema": [],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		// Invalid meta.docs.description
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": {"cutie": 3.142}
				},
				"schema": [],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		// Empty meta.docs.description
		invalidConfigObjects.push ({
			"meta": {
				"docs": {
					"recommended": true,
					"type": "error",
					"description": ""
				},
				"schema": [],
				"fixable": "code"
			},
			"verify": function (context) {}
		});

		invalidConfigObjects.forEach (function (c) {
			ruleInspector.isAValidRuleObject (c).should.equal (false);
		});

		done ();
	});

	var listItemsSchema = [
		{type: 'string', minLength: 3},
		{type: 'integer', minimum: 0, maximum: 10},
		{type: 'object', properties: { name: {type: 'string', minLength: 1} }, additionalProperties: false}
	];

	it ('should correctly classify when a rule is provided a valid set of options', function (done) {
		ruleInspector.areValidOptionsPassed (['hello', 5, {name: 'chuck norris'}], listItemsSchema).should.equal (true);

		done ();
	});

	it ('should correctly classify when a rule is provided an invalid set of options', function (done) {
		var invalidOptionLists = [
			null, undefined, '', {}, 100, -9, 89.23, 0, function () {}, NaN,
			['', 5, {name: 'chuck norris'}],
			['hello', -189, {name: 'chuck norris'}],
			['', 5, {name: ''}],
			[],
			['hello'],
			['hell', 9],
			[9, {name: 'chuck norris'}],
			['sss', {name: 'chuck norris'}]
		];

		invalidOptionLists.forEach (function (ops) {
			ruleInspector.areValidOptionsPassed (ops, listItemsSchema).should.equal (false);
		});

		done ();
	});

});