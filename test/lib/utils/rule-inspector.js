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

});