/**
 * @fileoverview Tests for rule-inspector
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let ruleInspector = require("../../../lib/utils/rule-inspector");

/* eslint-disable no-unused-vars */

describe("Test rule-inspector functions", function() {

    it("should expose a set of functions", function(done) {
        ruleInspector.should.have.size(3);

        ruleInspector.should.have.ownProperty("isAValidRuleObject");
        ruleInspector.isAValidRuleObject.should.be.type("function");

        ruleInspector.should.have.ownProperty("isAValidRuleResponseObject");
        ruleInspector.isAValidRuleResponseObject.should.be.type("function");

        ruleInspector.should.have.ownProperty("areValidOptionsPassed");
        ruleInspector.areValidOptionsPassed.should.be.type("function");

        done();
    });

    it("should correctly classify all valid rule objects", function(done) {
        let configObjects = [];

        // Complete object
        configObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule",
                    "replacedBy": ["new-rule"]
                },
                "schema": [],
                "fixable": "code",
                "deprecated": true
            },
            "create": function(context) {}
        });

        // No fixable
        configObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule"
                },
                "schema": []
            },
            "create": function(context) {}
        });

        // Schemas for passed options
        configObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule"
                },
                "schema": [
                    { type: "string", minLength: 5 },
                    { type: "object", properties: {modifies: {type: "boolean"}} },
                    { type: "integer", minimum: 0, maximum: 69 }
                ]
            },
            "create": function(context) {}
        });

        // No deprecation
        configObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule"
                },
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // Only deprecation, no replacement
        configObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule"
                },
                "schema": [],
                "fixable": "code",
                "deprecated": true
            },
            "create": function(context) {}
        });

        // "replacedBy" attr without the "deprecated: true"
        // In this case, "replacedBy" is redundant & will be ignored by solium, but its not invalid.
        configObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule",
                    "replacedBy": ["new-rule"]
                },
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });
		
        configObjects.forEach(function(c) {
            ruleInspector.isAValidRuleObject(c).should.equal(true);
        });

        done();
    });

    it("should correctly classify all invalid rule objects", function(done) {
        let invalidConfigObjects = [, null,
            undefined, 0, "", "harry potter", -190, 8927, 88.2891, [], [{}], [0], {}, function() {}];

        /**
		 * First rule out all the obviously invalid args.
		 * Then check for subtle invalidities.
		 */
        invalidConfigObjects.forEach(function(c) {
            ruleInspector.isAValidRuleObject(c).should.equal(false);
        });

        invalidConfigObjects = [];

        // No create attr
        invalidConfigObjects.push({
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
        invalidConfigObjects.push({
            "create": function(context) {}
        });

        // Invalid value for create
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule"
                },
                "schema": [],
                "fixable": "code"
            },
            "create": "jon snow dies"
        });

        // Invalid value for meta
        invalidConfigObjects.push({
            "meta": [10, {}, null],
            "create": function(context) {}
        });

        // No meta.docs
        invalidConfigObjects.push({
            "meta": {
                "schema": []
            },
            "create": function(context) {}
        });

        // No meta.schema
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule"
                }
            },
            "create": function(context) {}
        });

        // Invalid meta.docs
        invalidConfigObjects.push({
            "meta": {
                "docs": null,
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // Invalid meta.schema
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule"
                },
                "schema": [{"type": "object"}, "think again"],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // Invalid meta.fixable
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule"
                },
                "schema": [],
                "fixable": "somerandomnonsense"
            },
            "create": function(context) {}
        });

        // No meta.docs.recommended
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "type": "error",
                    "description": "This is a rule"
                },
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // No meta.docs.type
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "description": "This is a rule"
                },
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // No meta.docs.description
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error"
                },
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // Invalid meta.docs.recommended
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": 0,
                    "type": "error",
                    "description": "This is a rule"
                },
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // Invalid meta.docs.type
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "woo woo",
                    "description": "This is a rule"
                },
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // Invalid meta.docs.description
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": {"cutie": 3.142}
                },
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // Empty meta.docs.description
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": ""
                },
                "schema": [],
                "fixable": "code"
            },
            "create": function(context) {}
        });

        // Invalid value for "deprecated"
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule",
                    "replacedBy": ["new-rule"]
                },
                "schema": [],
                "fixable": "code",
                "deprecated": null
            },
            "create": function(context) {}
        });

        // Invalid value for "replacedBy"
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule",
                    "replacedBy": "new-rule"
                },
                "schema": [],
                "fixable": "code",
                "deprecated": true
            },
            "create": function(context) {}
        });

        // Invalid value for "replacedBy"
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule",
                    "replacedBy": []
                },
                "schema": [],
                "fixable": "code",
                "deprecated": true
            },
            "create": function(context) {}
        });

        // Invalid value for "replacedBy"
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule",
                    "replacedBy": [""]
                },
                "schema": [],
                "fixable": "code",
                "deprecated": true
            },
            "create": function(context) {}
        });

        // Invalid value for "replacedBy"
        invalidConfigObjects.push({
            "meta": {
                "docs": {
                    "recommended": true,
                    "type": "error",
                    "description": "This is a rule",
                    "replacedBy": null
                },
                "schema": [],
                "fixable": "code",
                "deprecated": true
            },
            "create": function(context) {}
        });

        invalidConfigObjects.forEach(function(c, i) {
            ruleInspector.isAValidRuleObject(c).should.equal(false);
            // Because rule-inspector directly exposes an AJV object compiled with the schema as
            // "isAValidRuleObject", we can even access other properties of this AJV object like "errors".
            ruleInspector.isAValidRuleObject.should.have.ownProperty("errors");
            ruleInspector.isAValidRuleObject.errors.should.be.Array();

            // Because each invalid object above must have exactly 1 invalid piece of info
            // to test that specific validation in isolation.
            ruleInspector.isAValidRuleObject.errors.should.have.size(1);
        });

        done();
    });

    it("should correctly classify all valid rule response objects", function(done) {
        let response = {};
        ruleInspector.isAValidRuleResponseObject(response).should.equal(true);

        response = {
            Literal: function(context) {}
        };
        ruleInspector.isAValidRuleResponseObject(response).should.equal(true);

        // Keys that aren't actually node names are still valid. The emitter would simply never emit anything for this node,
        // so it will just be ignored.
        response = {
            NotAnActualNodeName: function(context) {}
        };
        ruleInspector.isAValidRuleResponseObject(response).should.equal(true);

        response = {
            Program: function(context) {},
            ContractStatement: function(context) {},
            ArrayExpression: function(context) {}
        };
        ruleInspector.isAValidRuleResponseObject(response).should.equal(true);

        done();
    });

    it("should correctly classify all invalid rule response objects", function(done) {
        let invalidResponses = [, null,
            undefined, 0, "", "harry potter", -190, 8927, 88.2891, [], [{}], [0], function() {}];

        invalidResponses.push({
            "": function(ctx) {}
        });

        invalidResponses.push({
            Literal: "Hello world"
        });

        invalidResponses.push({
            Literal: undefined
        });

        invalidResponses.push({
            Literal: null
        });

        invalidResponses.push({
            NodaA: function(c) {},
            NodaB: function(c) {},
            Literal: null
        });

        invalidResponses.forEach(function(res) {
            ruleInspector.isAValidRuleResponseObject(res).should.equal(false);
            ruleInspector.isAValidRuleResponseObject.should.have.ownProperty("errors");
            ruleInspector.isAValidRuleResponseObject.errors.should.be.Array();
        });

        done();
    });

    let listItemsSchema = [
        {type: "string", minLength: 3},
        {type: "integer", minimum: 0, maximum: 10},
        {type: "object", properties: { name: {type: "string", minLength: 1} }, additionalProperties: false}
    ];

    it("should correctly classify when a rule is provided a valid set of options", function(done) {
        ruleInspector.areValidOptionsPassed(["hello", 5, {name: "chuck norris"}], listItemsSchema).should.equal(true);
        done();
    });

    it("should correctly classify when a rule is provided an invalid set of options", function(done) {
        let invalidOptionLists = [
            null, undefined, "", {}, 100, -9, 89.23, 0, function() {}, NaN,
            ["", 5, {name: "chuck norris"}],
            ["hello", -189, {name: "chuck norris"}],
            ["", 5, {name: ""}],
            [],
            ["hello"],
            ["hell", 9],
            [9, {name: "chuck norris"}],
            ["sss", {name: "chuck norris"}]
        ];

        invalidOptionLists.forEach(function(ops) {
            ruleInspector.areValidOptionsPassed(ops, listItemsSchema).should.equal(false);
        });

        done();
    });

});

/* eslint-enable no-unused-vars */
