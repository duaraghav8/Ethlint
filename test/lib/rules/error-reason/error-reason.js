/**
 * @fileoverview Tests for error message rule
 * @author Donatas Stundys <donatas.stundys@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    { toFunction } = require("../../../utils/wrappers");

const userConfigDefault = {
    "rules": {
        "error-reason": "warning"
    }
};

describe("[RULE] error-reason: Acceptances", function() {

    it("should accept revert calls with an error message", function(done) {
        const code = toFunction("revert(\"Error message\");"),
            errors = Solium.lint(code, userConfigDefault);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept revert calls without an error message when it is disabled", function(done) {
        const userConfig = {
            "rules": {
                "error-reason": ["error", { "revert": false, "require": true }]
            }
        };

        const code = toFunction("revert();"),
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept require calls with an error message", function(done) {
        const code = toFunction("require(1 == 1, \"Error message\");"),
            errors = Solium.lint(code, userConfigDefault);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept require calls without an error message when it is disabled", function(done) {
        const userConfig = {
            "rules": {
                "error-reason": ["warning", { "revert": true, "require": false }]
            }
        };

        const code = toFunction("require(1 == 1);"),
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

        const userConfig = {
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

        const userConfig = {
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

