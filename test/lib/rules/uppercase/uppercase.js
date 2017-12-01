/**
 * @fileoverview Tests for uppercase rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium");
let wrappers = require("../../../utils/wrappers");
let toContract = wrappers.toContract;

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "uppercase": true
    }
};

describe("[RULE] uppercase: Acceptances", function() {

    it("should accept all constants that are uppercase", function(done) {
        let code = [
            "uint constant HE = 100;",
            "address constant HELLO_WORLD = 0x0;",
            "bytes32 constant HELLOWORLD = \"dd\";",
            "string constant HELLO = \"dd\";",
            "address constant HELLO_NUMBER_9 = 0x0;",
            "uint constant HELLO_NUMBER_0 = 190;",
            "string constant HELLO_NUMBER89116 = \"hello\";",
            "string constant HELLO_98_NUMBER = \"number\";",
            "address constant H0 = 0x1;"
        ];
        let errors;

        code = code.map(function(item){return toContract(item);});

        code.forEach(function(declaration) {
            errors = Solium.lint(declaration, userConfig);
            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);
        });

        Solium.reset();
        done();
    });

});


describe("[RULE] uppercase: Rejections", function() {

    it("should reject all constants which are not uppercase", function(done) {
        let code = [
            "uint constant he = 100;",
            "address constant hello_world = 0x0;",
            "bytes32 constant helloworld= \"dd\";",
            "string constant HellO = \"dd\";",
            "string constant HeO = \"dd\";"
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

        errors = Solium.lint(code [4], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

});
