/**
 * @fileoverview Tests for rule-loader
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let ruleLoader = require("../../../lib/utils/rule-loader");

describe("Test rule-loader functions", function() {

    it("should expose a set of functions", function(done) {
        ruleLoader.should.be.size(4);	// including "constants" property

        ruleLoader.should.have.ownProperty("resolveUpstream");
        ruleLoader.resolveUpstream.should.be.type("function");

        ruleLoader.should.have.ownProperty("resolvePluginConfig");
        ruleLoader.resolvePluginConfig.should.be.type("function");

        ruleLoader.should.have.ownProperty("load");
        ruleLoader.load.should.be.type("function");

        done();
    });

    it("should expose a set of constants", function(done) {
        ruleLoader.should.have.ownProperty("constants");
        ruleLoader.constants.should.be.type("object");
        ruleLoader.constants.should.be.size(6);

        ruleLoader.constants.should.have.ownProperty("SOLIUM_RULESET_ALL");
        ruleLoader.constants.SOLIUM_RULESET_ALL.should.be.type("string");

        ruleLoader.constants.should.have.ownProperty("SOLIUM_RULESET_RECOMMENDED");
        ruleLoader.constants.SOLIUM_RULESET_RECOMMENDED.should.be.type("string");
        

        ruleLoader.constants.should.have.ownProperty("SOLIUM_CORE_RULES_DIRNAME");
        ruleLoader.constants.SOLIUM_CORE_RULES_DIRNAME.should.be.type("string");

        ruleLoader.constants.should.have.ownProperty("SOLIUM_CORE_RULES_DIRPATH");
        ruleLoader.constants.SOLIUM_CORE_RULES_DIRPATH.should.be.type("string");

        ruleLoader.constants.should.have.ownProperty("SOLIUM_PLUGIN_PREFIX");
        ruleLoader.constants.SOLIUM_PLUGIN_PREFIX.should.be.type("string");

        ruleLoader.constants.should.have.ownProperty("SOLIUM_SHARABLE_CONFIG_PREFIX");
        ruleLoader.constants.SOLIUM_SHARABLE_CONFIG_PREFIX.should.be.type("string");

        done();
    });

    it("should handle invalid input given to resolveUpstream()", function(done) {
        ruleLoader.resolveUpstream.bind(ruleLoader).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, undefined).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, null).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, 0).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, 11).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, -192).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, function foo() {}).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, []).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, [11]).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, {}).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, {a: 11}).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, true).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, false).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, 10.2897).should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, "").should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, "solium:blahblah").should.throw();

        // Valid sharable config names, but not installed
        ruleLoader.resolveUpstream.bind(ruleLoader, "17623").should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, "**(&&6%^").should.throw();
        ruleLoader.resolveUpstream.bind(ruleLoader, ":").should.throw();

        // Valid, installed but invalid JS syntax
        ruleLoader.resolveUpstream.bind(ruleLoader, "test-invalid-syntax").should.throw();

        // Valid, installed, valid syntax but invalid sharable config Schema
        ruleLoader.resolveUpstream.bind(ruleLoader, "test-invalid-schema").should.throw();

        // Valid & installed, valid syntax & valid sharable config schema, ie, acceptable
        ruleLoader.resolveUpstream.bind(ruleLoader, "test").should.not.throw();

        done();
    });

    it("should return expected result when valid upstream value is passed", function(done) {
        let result = ruleLoader.resolveUpstream(ruleLoader.constants.SOLIUM_RULESET_ALL);
        result.should.be.type("object");

        // Installed plugin
        result = ruleLoader.resolveUpstream("test");
        result.should.be.type("object");

        done();
    });

    it("should return rule config when a valid plugin is passed to resolvePluginConfig()", function(done) {
        let testPlugin = require("solium-plugin-test"),
            config = ruleLoader.resolvePluginConfig("test", testPlugin);

        config.should.be.type("object");
        config.should.have.size(2);

        config.should.have.ownProperty("test/foo");
        config ["test/foo"].should.equal("warning");

        config.should.have.ownProperty("test/bar");
        config ["test/bar"].should.equal("warning");

        done();
    });

    it("should throw when non-existent rule names are given to load()", function(done) {
        ruleLoader.load.bind(ruleLoader, ["nihi2yo87isuhlush"]).should.throw();

        done();
    });

    it("should return empty object when empty list is given to load()", function(done) {
        let result = ruleLoader.load([]);

        result.should.be.type("object");
        Object.keys(result).length.should.equal(0);

        done();
    });

    it("should load rules from plugins if they're installed", function(done) {
        ruleLoader.load.bind(ruleLoader, ["non-existent-plugin/foo"]).should.throw();

        let result = ruleLoader.load(["test/foo", "test/bar", "test/baz"]);

        result.should.be.type("object");
        result.should.be.size(3);

        result ["test/foo"].should.be.type("object");
        result ["test/bar"].should.be.type("object");
        (result ["test/baz"] === undefined).should.be.true();

        done();
    });

});
