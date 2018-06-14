/**
 * @fileoverview Tests for visibility-first rule.
 * @author Harrison Beckerich <https://github.com/hbeckeri>
 */

"use strict";

let Solium = require("../../../../lib/solium");
let wrappers = require("../../../utils/wrappers");
let toContract = wrappers.toContract;

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "visibility-first": true
    }
};

describe("[RULE] visibility-first: Acceptances", function() {

    it("accepts valid contract names", function(done) {
        let code = [
            "function test() public onlyOwner {}",
            "function test() external onlyOwner {}",
            "function test() internal onlyOwner {}",
            "function test() private onlyOwner {}"
        ];
        let errors;

        code = code.map(function(item){return toContract(item);});

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

        Solium.reset();
        done();
    });
});


describe("[RULE] visibility-first: Rejections", function() {
    it("rejects invalid struct names", function(done) {
        let code = [
            "function test() onlyOwner public {}",
            "function test() onlyOwner external {}",
            "function test() onlyOwner internal {}",
            "function test() onlyOwner private {}"
        ];
        let errors;

        code = code.map(function(item){return toContract(item);});

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
