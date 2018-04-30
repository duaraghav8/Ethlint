/**
 * @fileoverview Tests for error message rule
 * @author Donatas Stundys <donatas.stundys@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium");
let toFunction = require("../../../utils/wrappers").toFunction;

let userConfig = {
    "rules": {
        "error-message": true
    }
};

describe("[RULE] error-message: Acceptances", function() {

    it("should accept revert calls with an error message", function(done) {
        let code = toFunction("revert(\"Error message\");"),
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept require calls with an error message", function(done) {
        let code = toFunction("require(1 == 1, \"Error message\");"),
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

});

describe("[RULE] error-message: Rejections", function() {

    it("should reject revert calls without an error message", function(done) {
        let code = "revert();",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.should.be.Array();
        errors.should.have.size(1);

        Solium.reset();
        done();
    });

    it("should reject require calls without an error message", function(done) {
        let code = "require(1 == 1);",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.should.be.Array();
        errors.should.have.size(1);

        Solium.reset();
        done();
    });

});

