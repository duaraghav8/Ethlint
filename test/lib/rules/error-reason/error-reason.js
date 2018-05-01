/**
 * @fileoverview Tests for error message rule
 * @author Donatas Stundys <donatas.stundys@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium");
let toFunction = require("../../../utils/wrappers").toFunction;

let userConfigDefault = {
    "rules": {
        "error-reason": true
    }
};

describe("[RULE] error-reason: Acceptances", function() {

    it("should accept revert calls with an error message", function(done) {
        let code = toFunction("revert(\"Error message\");"),
            errors = Solium.lint(code, userConfigDefault);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept revert calls without an error message when it is disabled", function(done) {
        let userConfig = {
            "rules": {
                "error-reason": ["warning", { "revert": false, "require": true }]
            }
        };

        let code = toFunction("revert();"),
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept require calls with an error message", function(done) {
        let code = toFunction("require(1 == 1, \"Error message\");"),
            errors = Solium.lint(code, userConfigDefault);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept require calls without an error message when it is disabled", function(done) {
        let userConfig = {
            "rules": {
                "error-reason": ["warning", { "revert": true, "require": false }]
            }
        };

        let code = toFunction("require(1 == 1);"),
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

});

describe("[RULE] error-reason: Rejections", function() {

    it("should reject revert calls without an error message", function(done) {
        let code = "revert();",
            errors = Solium.lint(toFunction(code), userConfigDefault);

        errors.should.be.Array();
        errors.should.have.size(1);

        let userConfig = {
            "rules": {
                "error-reason": ["warning", { "revert": true, "require": false }]
            }
        };

        errors = Solium.lint(toFunction(code), userConfig);

        errors.should.be.Array();
        errors.should.have.size(1);

        Solium.reset();
        done();
    });

    it("should reject require calls without an error message", function(done) {
        let code = "require(1 == 1);",
            errors = Solium.lint(toFunction(code), userConfigDefault);

        errors.should.be.Array();
        errors.should.have.size(1);

        let userConfig = {
            "rules": {
                "error-reason": ["warning", { "revert": false, "require": true }]
            }
        };

        errors = Solium.lint(toFunction(code), userConfig);

        errors.should.be.Array();
        errors.should.have.size(1);

        Solium.reset();
        done();
    });

});

