/**
 * @fileoverview Tests for test/utils/wrappers.js
 * @author cgewecke <christohergewecke@gmail.com>
 */

"use strict";

const wrappers = require("../../utils/wrappers"),
    Solium = require("../../../lib/solium"),
    { EOL } = require("os");

let userConfig = {
    "custom-rules-filename": null,
    rules: {}
};

describe("Test wrappers", function() {

    it("should have a set of functions exposed as API", function(done) {
        
        wrappers.should.have.ownProperty("toContract");
        wrappers.toContract.should.be.type("function");

        wrappers.should.have.ownProperty("toFunction");
        wrappers.toFunction.should.be.type("function");

        wrappers.should.have.ownProperty("addPragma");
        wrappers.toFunction.should.be.type("function");

        done();
    });

    it("toContract: should correctly wrap a solidity statement in contract code", function(done) {
        let toContract = wrappers.toContract;
        let statement = "uint x = 1;";
        let expected = 
            `pragma solidity ^0.4.3;${EOL.repeat(3)}` +
            `contract Wrap {${EOL}` +
            "\t" + statement + EOL +
            "}";

        let errors = Solium.lint(expected, userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);
        toContract(statement).should.equal(expected);

        Solium.reset();
        done();
    });

    it("toFunction: should correctly wrap a solidity statement in contract/function code", function(done) {
        let toFunction = wrappers.toFunction;
        let statement = "uint x = 1;";
        let expected = 
            `pragma solidity ^0.4.3;${EOL.repeat(3)}` +
            `contract Wrap {${EOL}` +
            `\tfunction wrap() {${EOL}` +
            "\t\t" + statement + EOL +
            `\t}${EOL}` +
            "}";

        let errors = Solium.lint(expected, userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);
        toFunction(statement).should.equal(expected);

        Solium.reset();
        done();
    });

    it("addPragma: should correctly pre-pend a pragma statement to a solidity contract or library", function(done) {
        let addPragma = wrappers.addPragma;
        let contract = "contract Abc { }";
        let expected = `pragma solidity ^0.4.3;${EOL.repeat(3)}` + contract;
            
        let errors = Solium.lint(expected, userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);
        addPragma(contract).should.equal(expected);

        Solium.reset();
        done();
    });
});