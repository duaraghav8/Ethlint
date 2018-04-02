/**
 * @fileoverview Tests for "msg.value" usage rule
 * @author Ivan Mushketyk <ivan.mushketik@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium");
let wrappers = require("../../../utils/wrappers");
let toContract = wrappers.toContract;

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "value-in-payable": true
    }
};

describe("[RULE] value-in-payable: Acceptances", function() {

    it("should accepts function that access 'msg.value' and has the 'payable' modifier", function(done) {
        let code = toContract("function pay() payable { require(msg.value >= MIN_PRICE); }");

        let errors = Solium.lint(code, userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accepts code that access 'msg.value' outside a function", function(done) {
        let code = toContract(`function foo() { }
                               unit foo1 = msg.value;`);

        let errors = Solium.lint(code, userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

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
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

});
