/**
 * @fileoverview Tests for Solium v1 plugin Schema
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let pluginSchema = require("../../../config/schemas/plugin.js"), isAValidPlugin = pluginSchema.validationFunc;

/* eslint-disable no-unused-vars */

describe("Checking Plugin Schema", function() {

    let sampleRule = {
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
    };


    it("should expose a set of functions", function(done) {
        pluginSchema.should.be.type("object");
        pluginSchema.should.be.size(2);

        pluginSchema.should.have.ownProperty("Schema");
        pluginSchema.Schema.should.be.type("object");

        pluginSchema.should.have.ownProperty("validationFunc");
        pluginSchema.validationFunc.should.be.type("function");

        done();
    });

    it("should accept valid plugin objects", function(done) {

        let plugin = {
            "rules": {
                "sample-rule-1": sampleRule,
                "sample-rule-2": sampleRule
            },
            "meta": {
                "description": "This is my badass plugin"
            }
        };

        isAValidPlugin(plugin).should.equal(true);

        plugin = {
            "rules": {
                "a": sampleRule,
                "b": sampleRule
            },
            "meta": {
                "description": "c"
            }
        };

        isAValidPlugin(plugin).should.equal(true);

        plugin = {
            "rules": {},
            "meta": {
                "description": "c"
            }
        };

        isAValidPlugin(plugin).should.equal(true);

        done();
    });

    it("should reject invalid plugin objects", function(done) {
        let invalidPlugins = [-1, 0, 1, 89.189, "hello world", null, function(){}, undefined, [], true, false];

        // no 'rules'
        invalidPlugins.push({
            "meta": {
                "description": "This is my badass plugin"
            }
        });

        // no "meta"
        invalidPlugins.push({
            "rules": {
                "sample-rule-1": sampleRule,
                "sample-rule-2": sampleRule
            }
        });

        // invalid rule
        invalidPlugins.push({
            "rules": "hello world",
            "meta": {
                "description": "This is my badass plugin"
            }
        });

        // invalid meta
        invalidPlugins.push({
            "rules": {
                "sample-rule-1": sampleRule
            },
            "meta": []
        });

        // invalid rule name
        invalidPlugins.push({
            "rules": {
                "": sampleRule
            },
            "meta": {
                "description": "This is my badass plugin"
            }
        });

        // invalid rule definition
        invalidPlugins.push({
            "rules": {
                "sample-rule-1": null
            },
            "meta": {
                "description": "This is my badass plugin"
            }
        });

        // no meta.description
        invalidPlugins.push({
            "rules": {
                "sample-rule-1": sampleRule,
                "sample-rule-2": sampleRule
            },
            "meta": {}
        });

        // empty meta.description
        invalidPlugins.push({
            "rules": {
                "sample-rule-1": sampleRule,
                "sample-rule-2": sampleRule
            },
            "meta": {
                "description": ""
            }
        });

        // invalid meta.description value
        invalidPlugins.push({
            "rules": {
                "sample-rule-1": sampleRule,
                "sample-rule-2": sampleRule
            },
            "meta": {
                "description": 190828
            }
        });

        // extra property
        invalidPlugins.push({
            "rules": {
                "sample-rule-1": sampleRule,
                "sample-rule-2": sampleRule
            },
            "meta": {
                "description": "This is my badass plugin"
            },
            "randombullshit": {}
        });

        // extra property in meta
        invalidPlugins.push({
            "rules": {
                "sample-rule-1": sampleRule,
                "sample-rule-2": sampleRule
            },
            "meta": {
                "description": "This is my badass plugin",
                "morebullshit": true
            }
        });

        // All the plugin definitions should be invalid because of precisely 1 error
        // This forces us to test all possibilities separately.
        invalidPlugins.forEach(function(p) {
            isAValidPlugin(p).should.equal(false);
            isAValidPlugin.errors.should.have.size(1);
        });

        isAValidPlugin({}).should.equal(false);
        isAValidPlugin.errors.should.have.size(2);

        done();
    });

});

/* eslint-enable no-unused-vars */
