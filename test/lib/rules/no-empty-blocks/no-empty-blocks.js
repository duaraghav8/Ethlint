/**
 * @fileoverview Tests for no-empty-blocks rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium");
let wrappers = require("../../../utils/wrappers");
let toContract = wrappers.toContract;
let toFunction = wrappers.toFunction;
let addPragma = wrappers.addPragma;

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "no-empty-blocks": true
    }
};

describe("[RULE] no-empty-blocks: Acceptances", function() {

    it("should accept all non-empty contract, library and interface statements", function(done) {
        let code = "contract Foo { event bar (); }",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "library Foo { event bar (); }";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "interface Foo { event bar (); }";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept all non-empty function declarations", function(done) {
        let code = "function foo () { bar (); }",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should ACCEPT all EMPTY function declarations (see fallback functions)", function(done) {
        let code = "function foo () {}",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept all non-empty if-else declarations", function(done) {
        let code = "if (true) { foo (); } else { bar (); }",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);
		
        Solium.reset();
        done();
    });

    it("should accept all non-empty for statements", function(done) {
        let code = "for (i = 0; i < 10; i++) { foo (); }",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);
		
        Solium.reset();
        done();
    });

    it("should accept all non-empty do..while statements", function(done) {
        let code = "do { foo (); } while (i < 20);",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);
		
        Solium.reset();
        done();
    });

    it("should accept all non-empty while statements", function(done) {
        let code = "while (i < 20) { bar (); }",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);
		
        Solium.reset();
        done();
    });

});


describe("[RULE] no-empty-blocks: Rejections", function() {

    it("should reject all empty contract, library & interface statements", function(done) {
        let code = "contract Foo {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "library Foo {}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "interface Foo {}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject all empty if-else declarations", function(done) {
        let code = "if (true) {} else {}",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);
		
        Solium.reset();
        done();
    });

    it("should reject all empty for statements", function(done) {
        let code = "for (i = 0; i < 10; i++) {}",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject all empty do..while statements", function(done) {
        let code = "do {} while (i < 20);",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
		
        Solium.reset();
        done();
    });

    it("should reject all empty while statements", function(done) {
        let code = "while (i < 20) {}",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

});
