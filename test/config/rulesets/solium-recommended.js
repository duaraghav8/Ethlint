/**
 * @fileoverview Ensure that all rule files present in the lib/rules/ directory have a corresponding entry in solium-recommended.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let fs = require("fs"), path = require("path");
let rsSoliumAll = require("../../../config/rulesets/solium-recommended");
let JS_EXT = ".js";

describe("Tests for solium-recommended.js ruleset", function() {

    it("should have a set of properties", function(done) {
        rsSoliumAll.should.be.type("object");
        rsSoliumAll.should.have.ownProperty("rules");
        rsSoliumAll.rules.should.be.type("object");

        done();
    });

    it("should have an entry for every rule file in lib/rules directory", function(done) {
        let listOfRuleFiles = fs.readdirSync(__dirname + "/../../../lib/rules/");

        listOfRuleFiles.forEach(function(filename) {
            if (path.extname(filename) === JS_EXT) {
                rsSoliumAll.rules.should.have.ownProperty(filename.slice(0, -JS_EXT.length));
            }
        });

        done();
    });

});
