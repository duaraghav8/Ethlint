/**
 * @fileoverview Tests for visibility-first rule.
 * @author Harrison Beckerich <https://github.com/hbeckeri>
 */

"use strict";

const Solium = require("../../../../lib/solium");
const wrappers = require("../../../utils/wrappers");
const toContract = wrappers.toContract;

const userConfig = {
    "rules": {
        "visibility-first": "warning"
    }
};

describe("[RULE] visibility-first: Acceptances", () => {
    it("accepts valid contract names", done => {
        let code = [
            "function test() public onlyOwner {}",
            "function test() external onlyOwner {}",
            "function test() internal onlyOwner {}",
            "function test() private onlyOwner {}",
            "function test() onlyOwner {}",
            "function test() public {}",
            "function test() external {}",
            "function test() internal {}",
            "function test() private {}",
            "function test() {}"
        ];
        let errors;

        code = code.map(item => toContract(item));

        errors = Solium.lint(code [0], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [1], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [2], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [3], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [4], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [5], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [6], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [7], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [8], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [9], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });
});


describe("[RULE] visibility-first: Rejections", () => {
    it("rejects invalid struct names", done => {
        let code = [
            "function test() onlyOwner public {}",
            "function test() onlyOwner external {}",
            "function test() onlyOwner internal {}",
            "function test() onlyOwner private {}"
        ];
        let errors;

        code = code.map(item => toContract(item));

        errors = Solium.lint(code [0], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [1], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [2], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [3], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });
});
