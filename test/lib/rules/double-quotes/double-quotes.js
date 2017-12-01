/**
 * @fileoverview Tests for double-quotes rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

// 2 extra errors produced due to deprecation warning since this rule is now deprecated
// and config format is also deprecated & we asked for internal issues.

"use strict";

let Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers"),
    fs = require("fs"),
    path = require("path");

let toContract = wrappers.toContract;
let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "double-quotes": true
    },
    "options": { "returnInternalIssues": true }
};

describe("[RULE] double-quotes: Acceptances", function() {

    it("should accept strings quoted with double quotes", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./accept/double-quoted.sol"), "utf8"),
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        Solium.reset();
        done();
    });

});


describe("[RULE] double-quotes: Rejections", function() {

    it("should reject strings quoted with single quotes", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./reject/single-quoted.sol"), "utf8"),
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(7);

        Solium.reset();
        done();
    });

});
