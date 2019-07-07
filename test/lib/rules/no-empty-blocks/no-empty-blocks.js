/**
 * @fileoverview Tests for no-empty-blocks rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium");
const wrappers = require("../../../utils/wrappers");
const toContract = wrappers.toContract;
const toFunction = wrappers.toFunction;
const addPragma = wrappers.addPragma;

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

    it("should allow fallback and payable functions & payable constructors to have empty bodies", done => {
        let snippets = [
            "function(string address) {}",
            "function foo(string address) payable external {}",
            "function(string address) payable public {}",
            "constructor(uint x) payable {}",

            "function(string address) { /* hello world */ }",
            "function foo(string address) payable external {\t\t\t\t\t\n\n\t}",
            "function(string address) payable public {       }",
            "constructor(uint x) payable {   /* testing     */    }"
        ];

        snippets.forEach(code => {
            let errors = Solium.lint(toContract(code), userConfig);
            errors.should.be.empty();
        });

        Solium.reset();
        done();
    });

    it("should allow constructors calling base constructors to have empty bodies", done => {
        const code = `
contract Foo is Bar {
    constructor(uint _y) Bar(_y * _y) public {}
}

contract Jax is Base(10) {
    constructor() public blah Base foo bar(100) {}
}

// This should be accepted because payable constructor
contract Ipsum is Foo {
    constructor() payable public {}
}
`;
        const errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

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

    it("should reject functions & constructors with empty bodies", done => {
        let snippets = [
            "function foo(string address) {}",
            "function foo(string address) external {}",
            "constructor(uint x) {}",
            "constructor(uint x) public {}",

            "function foo(string address) { /* hello world */ }",
            "function foo(string address) external {\t\t\t\t\t\n\n\t}",
            "constructor(uint x) {       }",
            "constructor(uint x) public {   /* testing     */    }"
        ];

        snippets.forEach(code => {
            let errors = Solium.lint(toContract(code), userConfig);
            errors.should.have.size(1);
        });

        Solium.reset();
        done();
    });

});
