/**
 * @fileoverview Tests for array-declarations.js rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let fs = require("fs"), path = require("path"),
    Solium = require("../../../../lib/solium"), wrappers = require("../../../utils/wrappers");

let toContract = wrappers.toContract;
let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "array-declarations": true
    }
};

describe("[RULE] array-declarations: Acceptances", function() {

    it("should accept \"uint[] x;\"", function(done) {
        let code = "uint[] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept \"uint[10] x;\"", function(done) {
        let code = "uint[10] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

});

describe("[RULE] array-declarations: Rejections", function() {

    it("should reject \"uint[ ] x;\"", function(done) {
        let code = "uint[ ] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal(
            "There should be no whitespace between opening & closing square brackets. Use [] instead.");

        Solium.reset();
        done();
    });

    it("should reject \"uint[\t] x;\" (\\t)", function(done) {
        let code = "uint[\t] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal(
            "There should be no whitespace between opening & closing square brackets. Use [] instead.");

        Solium.reset();
        done();
    });

    it("should reject \"uint[\n] x;\"", function(done) {
        let code = "uint[\n] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal(
            "There should be no whitespace between opening & closing square brackets. Use [] instead.");

        Solium.reset();
        done();
    });

    it("should reject \"uint[  ] x;\" (2 spaces)", function(done) {
        let code = "uint[  ] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal(
            "There should be no whitespace between opening & closing square brackets. Use [] instead.");

        Solium.reset();
        done();
    });

    it("should reject \"a.b.c.d[\t \n ] x = [1,2,3,'4'];\" (after member access)", function(done) {
        let code = "a.b.c.d[\t \n ] x = [1,2,3,'4'];",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal(
            "There should be no whitespace between opening & closing square brackets. Use [] instead.");

        Solium.reset();
        done();
    });

    it("should reject \"mapping (uint => string)[  ] x = [1,2,3,'4'];\" (mapping)", function(done) {
        let code = "mapping (uint => string)[  ] x = [1,2,3,'4'];",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal(
            "There should be no whitespace between opening & closing square brackets. Use [] instead.");

        Solium.reset();
        done();
    });



    it("should reject \"uint [] x;\" (space between literal and opening brackets", function(done) {
        let code = "uint [] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal("There should be no whitespace between \"uint\" and the opening square bracket.");

        Solium.reset();
        done();
    });

    it("should reject \"string\n[] x;\" (linebreak between literal and opening brackets", function(done) {
        let code = "string\n[] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal("There should be no whitespace between \"string\" and the opening square bracket.");

        Solium.reset();
        done();
    });

    it("should reject \"bytes32\t[] x;\" (tab between literal and opening brackets", function(done) {
        let code = "bytes32\t[] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal("There should be no whitespace between \"bytes32\" and the opening square bracket.");

        Solium.reset();
        done();
    });

    it("should reject \"a.b.c.d\t \t  [] doo = [];\" (arry dec. after member access)", function(done) {
        let code = "a.b.c.d\t \t  [] doo = [];",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal("There should be no whitespace between \"a.b.c.d\" and the opening square bracket.");

        Solium.reset();
        done();
    });

    it("should reject \"mapping (uint => string)\n  [] m;\" (mapping array dec)", function(done) {
        let code = "mapping (uint => string)\n  [] m;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors [0].message.should.equal(
            "There should be no whitespace between \"mapping (uint => string)\" and the opening square bracket.");

        Solium.reset();
        done();
    });



    it("should reject \"uint  [  ] x;\"", function(done) {
        let code = "uint  [  ] x;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);
        errors [1].message.should.equal("There should be no whitespace between opening & closing square brackets. Use [] instead.");
        errors [0].message.should.equal("There should be no whitespace between \"uint\" and the opening square bracket.");

        Solium.reset();
        done();
    });

});

describe("[RULE] array-declarations: Fixes", function() {

    it("should fix Whitespace between Literal & opening bracket", function(done) {
        let unfixed = fs.readFileSync(path.join(__dirname, "./unfixed/ws-btw-lit-op.sol"), "utf8"),
            fixed = fs.readFileSync(path.join(__dirname, "./fixed/ws-btw-op-clos.sol"), "utf8");

        fixed = Solium.lintAndFix(unfixed, userConfig);

        fixed.should.be.type("object");
        fixed.should.have.ownProperty("fixedSourceCode");
        fixed.should.have.ownProperty("errorMessages");
        fixed.should.have.ownProperty("fixesApplied");

        fixed.fixedSourceCode.should.equal(fixed.fixedSourceCode);
        fixed.errorMessages.should.be.Array();
        fixed.errorMessages.length.should.equal(0);
        fixed.fixesApplied.should.be.Array();
        fixed.fixesApplied.length.should.equal(6);

        Solium.reset();
        done();
    });

    it("should fix Whitespace between opening & closing brackets", function(done) {
        let unfixed = fs.readFileSync(path.join(__dirname, "./unfixed/ws-btw-op-clos.sol"), "utf8"),
            fixed = fs.readFileSync(path.join(__dirname, "./fixed/ws-btw-op-clos.sol"), "utf8");

        fixed = Solium.lintAndFix(unfixed, userConfig);

        fixed.should.be.type("object");
        fixed.should.have.ownProperty("fixedSourceCode");
        fixed.should.have.ownProperty("errorMessages");
        fixed.should.have.ownProperty("fixesApplied");

        fixed.fixedSourceCode.should.equal(fixed.fixedSourceCode);
        fixed.errorMessages.should.be.Array();
        fixed.errorMessages.length.should.equal(0);
        fixed.fixesApplied.should.be.Array();
        fixed.fixesApplied.length.should.equal(5);

        Solium.reset();
        done();
    });

    it("should handle and fix a mix of the errors", function(done) {
        let unfixed = fs.readFileSync(path.join(__dirname, "./unfixed/mixed.sol"), "utf8"),
            fixed = fs.readFileSync(path.join(__dirname, "./fixed/ws-btw-op-clos.sol"), "utf8");

        fixed = Solium.lintAndFix(unfixed, userConfig);

        fixed.should.be.type("object");
        fixed.should.have.ownProperty("fixedSourceCode");
        fixed.should.have.ownProperty("errorMessages");
        fixed.should.have.ownProperty("fixesApplied");

        fixed.fixedSourceCode.should.equal(fixed.fixedSourceCode);
        fixed.errorMessages.should.be.Array();
        fixed.errorMessages.length.should.equal(0);
        fixed.fixesApplied.should.be.Array();
        fixed.fixesApplied.length.should.equal(10);

        Solium.reset();
        done();
    });

});
