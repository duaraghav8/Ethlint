/**
 * @fileoverview Tests for the max-len rule
 * @author Leo Arias <yo@elopio.net>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers"),
    { addPragma } = wrappers;
const DEFAULT_MAX_ACCEPTABLE_LEN = 145;

function makeString(length, character) {
    return new Array(length + 1).join(character);
}

describe("[RULE] max-len: default len", function() {

    before(function(done) {
        this.userConfig = {
            "rules": {
                "max-len": true
            }
        };
        done();
    });

    describe("Acceptances", function() {

        it("should allow line length <= default acceptable", function(done) {
            let name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN - "contract  {}".length, "a"),
                code = `contract ${name} {}`,
                errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);


            name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN - 1 - "contract  {}".length, "a");
            code = `contract ${name} {}`;
            errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);

            Solium.reset();
            done();
        });
    });

    describe("Rejections", function() {

        it("should reject line length > default acceptable on top level node", function(done) {
            let name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN + 1 - "contract  {}".length, "a"),
                code = `contract ${name} {}`,
                errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].node.type.should.equal("ContractStatement");
            errors[0].message.should.equal(`Line exceeds the limit of ${DEFAULT_MAX_ACCEPTABLE_LEN} characters`);

            Solium.reset();
            done();
        });

        it("should reject line length > default acceptable on child node", function(done) {
            let name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN + 1 - "        uint ;".length, "a"),
                code = (
                    "contract dummy {\n" +
                    "    function dummy() {\n" +
                    `        uint ${name};\n` +
                    "    }\n" +
                    "}"),
                errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].node.type.should.equal("ExpressionStatement");
            errors[0].message.should.equal(`Line exceeds the limit of ${DEFAULT_MAX_ACCEPTABLE_LEN} characters`);

            Solium.reset();
            done();
        });

        it("should reject line length > default acceptable only once", function(done) {
            let name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN + 1 - "        uint short;uint ;".length, "a"),
                code = (
                    "contract dummy {\n" +
                    "    function dummy() {\n" +
                    `        uint short;uint ${name};\n` +
                    "    }\n" +
                    "}"),
                errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].node.type.should.equal("ExpressionStatement");
            errors[0].message.should.equal(`Line exceeds the limit of ${DEFAULT_MAX_ACCEPTABLE_LEN} characters`);

            Solium.reset();
            done();
        });
    });
});

describe("[RULE] max-len: custom len", function() {

    before(function(done) {
        this.CUSTOM_MAX_ACCEPTABLE_LEN = 200;
        this.userConfig = {
            "rules": {
                "max-len": ["error", this.CUSTOM_MAX_ACCEPTABLE_LEN]
            }
        };
        done();
    });

    describe("Acceptances", function() {

        it("should allow line length <= custom acceptable", function(done) {
            let name = makeString(this.CUSTOM_MAX_ACCEPTABLE_LEN - "contract  {}".length, "a"),
                code = `contract ${name} {}`,
                errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);


            name = makeString(this.CUSTOM_MAX_ACCEPTABLE_LEN - 1 - "contract  {}".length, "a");
            code = `contract ${name} {}`;
            errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);

            Solium.reset();
            done();
        });
    });

    describe("Rejections", function() {

        it("should reject line length > custom acceptable on top level node", function(done) {
            let name = makeString(this.CUSTOM_MAX_ACCEPTABLE_LEN + 1 - "contract  {}".length, "a"),
                code = `contract ${name} {}`,
                errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].node.type.should.equal("ContractStatement");
            errors[0].message.should.equal(`Line exceeds the limit of ${this.CUSTOM_MAX_ACCEPTABLE_LEN} characters`);

            Solium.reset();
            done();
        });

        it("should reject line length > custom acceptable on child node", function(done) {
            let name = makeString(this.CUSTOM_MAX_ACCEPTABLE_LEN + 1 - "        uint ;".length, "a"),
                code = (
                    "contract dummy {\n" +
                    "    function dummy() {\n" +
                    `        uint ${name};\n` +
                    "    }\n" +
                    "}"),
                errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].node.type.should.equal("ExpressionStatement");
            errors[0].message.should.equal(`Line exceeds the limit of ${this.CUSTOM_MAX_ACCEPTABLE_LEN} characters`);

            Solium.reset();
            done();
        });

        it("should reject line length > custom acceptable only once", function(done) {
            let name = makeString(this.CUSTOM_MAX_ACCEPTABLE_LEN + 1 - "        uint short;uint ;".length, "a"),
                code = (
                    "contract dummy {\n" +
                    "    function dummy() {\n" +
                    `        uint short;uint ${name};\n` +
                    "    }\n" +
                    "}"),
                errors = Solium.lint(addPragma(code), this.userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].node.type.should.equal("ExpressionStatement");
            errors[0].message.should.equal(`Line exceeds the limit of ${this.CUSTOM_MAX_ACCEPTABLE_LEN} characters`);

            Solium.reset();
            done();
        });
    });
});
