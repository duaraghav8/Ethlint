/**
 * @fileoverview Tests for the long-lines rule
 * @author Leo Arias <yo@elopio.net>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers");

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "long-lines": true,
    }
};

const addPragma = wrappers.addPragma;

function makeString(length, character) {
    return new Array(length + 1).join(character);
}

describe("[RULE] long-lines: Acceptances", function() {
    it("should allow short line", function(done) {
        let name = makeString(79 - 1 - "contract  {}".length, "a"),
            code = `contract ${name} {}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });
});

describe("[RULE] long-lines: Rejections", function() {
    it("should reject long line on top level node", function(done) {
        let name = makeString(79 - "contract  {}".length, "a"),
            code = `contract ${name} {}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].node.type.should.equal("ContractStatement");
        errors[0].message.should.equal("line is longer than 79 characters");

        Solium.reset();
        done();
    });

    it("should reject long line on child node", function(done) {
        let name = makeString(79 - "        uint ;".length, "a"),
            code = (
                'contract dummy {\n' +
                `    function dummy() {\n` +
                `        uint ${name};\n` +
                '    }\n' +
                '}'),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].node.type.should.equal("ExpressionStatement");
        errors[0].message.should.equal("line is longer than 79 characters");

        Solium.reset();
        done();
    });

    it("should reject long line only once", function(done) {
        let name = makeString(79 - "        uint short;uint ;".length, "a"),
            code = (
                'contract dummy {\n' +
                `    function dummy() {\n` +
                `        uint short;uint ${name};\n` +
                '    }\n' +
                '}'),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].node.type.should.equal("ExpressionStatement");
        errors[0].message.should.equal("line is longer than 79 characters");

        Solium.reset();
        done();
    });
});
