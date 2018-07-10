/**
 * @fileoverview Ensure that constructors are not declared using the deprecated style
 * @author Daniel McLellan <daniel.mclellan@gmail.com>
 */

"use strict";
const Solium = require("../../../../lib/solium");
// const toContract = require("../../../utils/wrappers").toContract;
const userConfig = {
    "rules": {
        "constructor-declaration": "error"
    }
};

describe("[RULE] constructor-declaration: Rejections", function() {
    it("should correct the use of the bounty name as constructor", done => {
        let code = `
        pragma experimental "^0.5.0";
        contract Foo { function Foo() {} }
    `;
        const errors = Solium.lint(code, userConfig);
        // errors.should.be.Array;
        errors.should.be.size(1);
        Solium.reset();
        done();
    });
});

describe("[RULE] constructor-declaration: Acceptances", function() {
    it("should accept the contract using contructor as first function", done => {
        let code = `
        pragma experimental "^0.5.0";
        contract Foo { constructor() public {} }
    `;
        const errors = Solium.lint(code, userConfig);
        // errors.should.be.Array;
        errors.should.have.size(0);
        Solium.reset();
        done();
    });
});
