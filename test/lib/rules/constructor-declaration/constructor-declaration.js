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

<<<<<<< HEAD:test/lib/rules/constructor-name/constructor-name.js
describe("[RULE] constructor-name: Rejections", function() {
    it("should identify the use of the bounty name as constructor", done => {
=======
describe("[RULE] constructor-declaration: Rejections", function() {
    it("should correct the use of the bounty name as constructor", done => {
>>>>>>> 8e114f3aeacb5cf78f4576802e5e914d37b017d6:test/lib/rules/constructor-declaration/constructor-declaration.js
        let code = `
        pragma experimental "^0.5.0";
        contract Foo { function Foo() {} }
        `;
        const errors = Solium.lint(code, userConfig);
        errors.should.be.size(1);
        Solium.reset();
        done();
    });
    it("should correct the use of bounty name as constructor", done => {
        let unfixedCode = `
        pragma experimental "^0.5.0";
        contract Foo { function Foo() {} }
        `,
            fixedCode = `
        pragma experimental "^0.5.0";
        contract Foo { constructor() public {} }
        `;
        let fixed = Solium.lintAndFix(unfixedCode, userConfig);
        fixed.fixedSourceCode.should.equal(fixedCode);
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
        errors.should.have.size(0);
        Solium.reset();
        done();
    });
    it("should not fix a correct constructor", done => {
        let code = `
        pragma experimental "^0.5.0";
        contract Foo { constructor() public {} }
        `;
        let fixed = Solium.lintAndFix(code, userConfig);
        fixed.fixedSourceCode.should.equal(code);
        Solium.reset();
        done();
    });
});
