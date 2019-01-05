/**
 * @fileoverview Tests for visibility-first rule.
 * @author Harrison Beckerich <https://github.com/hbeckeri>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    { toContract } = require("../../../utils/wrappers");

const userConfig = {
    "rules": {
        "visibility-first": "warning"
    }
};

describe("[RULE] visibility-first: Acceptances", () => {
    it("accepts valid contract names", done => {
        let code = [
            "function test() public onlyOwner modA modB modC modD private modE {}",
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

        code.forEach(snip => {
            errors = Solium.lint(snip, userConfig);
            errors.should.be.Array();
            errors.should.be.empty();
        });

        Solium.reset();
        done();
    });
});


describe("[RULE] visibility-first: Rejections", () => {
    it("rejects invalid struct names", done => {
        let code = [
            "function test() onlyOwner modA modB modC public {}",
            "function test() onlyOwner modA modB modC external modD modE {}",
            "function test() onlyOwner modA modB modC internal modD modE private {}",
            "function test() onlyOwner public {}",
            "function test() onlyOwner external {}",
            "function test() onlyOwner internal {}",
            "function test() onlyOwner private {}"
        ];
        let errors;

        code = code.map(item => toContract(item));

        code.forEach(snip => {
            errors = Solium.lint(snip, userConfig);
            errors.should.be.Array();
            errors.should.have.size(1);
        });

        Solium.reset();
        done();
    });
});
