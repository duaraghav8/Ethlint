/**
 * @fileoverview Ensure constructor name does not match bounty name
 * @author Daniel McLellan <daniel.mclellan@gmail.com>
 */

"use strict";
const Solium = require("../../../../lib/solium");
// const toContract = require("../../../utils/wrappers").toContract;
const userConfig = {
    "rules": {
        "constructor-name": "error"
    }
};

describe("[RULE] constructor-name: Rejections", function() {
    it("should identify the use of the bounty name as constructor", done => {
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
describe("[RULE] constructor-name: Acceptances", function() {
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
