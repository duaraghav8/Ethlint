/**
 * @fileoverview Tests for value-in-payable rule
 * @author Ivan Mushketyk <ivan.mushketik@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    { toContract } = require("../../../utils/wrappers");

let userConfig = {
    "rules": {
        "value-in-payable": "error"
    }
};

describe("[RULE] value-in-payable: Acceptances", () => {

    it("should accept functions that access 'msg.value' and have the 'payable' modifier", function(done) {
        const code = toContract("function pay() payable { require(msg.value >= MIN_PRICE); }"),
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept functions that access 'msg.value' and have the 'private' modifier", function(done) {
        const code = toContract("function pay() private { require(msg.value >= MIN_PRICE); }"),
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept functions that access 'msg.value' and have the 'internal' modifier", function(done) {
        const code = toContract("function pay() internal { require(msg.value >= MIN_PRICE); }"),
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

    it("should accept code that accesses 'msg.value' outside a function", function(done) {
        const code = toContract(`function foo() { }
                               unit foo1 = msg.value;`);
        const errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });

});

describe("[RULE] value-in-payable: Rejections", function() {

    it("should reject all functions that access 'msg.value' and don't have the 'payable' modifier", function(done) {
        let code = [
            "function pay() public { require(msg.value >= MIN_PRICE); }"
        ];
        let errors;

        code = code.map(function(item){return toContract(item);});

        errors = Solium.lint(code[0], userConfig);
        errors.should.be.Array();
        errors.should.have.size(1);

        Solium.reset();
        done();
    });

});
