/**
 * @fileoverview Tests for indentation rule
 * @author Franco Victorio <victorio.franco@gmail.com>
 */

"use strict";

const fs = require("fs"),
    path = require("path"),
    Solium = require("../../../../lib/solium");
const acceptDir = path.join(__dirname, "accept"),
    rejectDir = path.join(__dirname, "reject"),
    { EOL } = require("os");

describe("[RULE] indentation: Acceptances", function() {
    it("should accept a valid file under the default options", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "config-default.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept a valid file with tabs", function(done) {
        let userConfig = {
            "rules": {
                "indentation": ["error", "tab"]
            }
        };

        let file = "config-tabs.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept a valid file with two spaces", function(done) {
        let userConfig = {
            "rules": {
                "indentation": ["error", 2]
            }
        };

        let file = "config-two-spaces.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept a file with a multiline array", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "multiline-array.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept a file with a multiline call declaration", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "multiline-call-declaration.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept a file with a multiline call expression", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "multiline-call-expression.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept a file with a struct", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "struct.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept a file with a struct in one line", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "one-line-struct.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept a file with an array in one line", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "one-line-array.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept a file with a function call in one line", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "one-line-function-call.sol";
        let code = fs.readFileSync(path.join(acceptDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });
});

describe("[RULE] indentation: Rejections", function() {
    it("should reject an invalid file under the default options", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "config-default.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(13);

        Solium.reset();
        done();
    });

    it("should reject an invalid file with tabs", function(done) {
        let userConfig = {
            "rules": {
                "indentation": ["error", "tab"]
            }
        };

        let file = "config-tabs.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(11);

        Solium.reset();
        done();
    });

    it("should reject an invalid file with two spaces", function(done) {
        let userConfig = {
            "rules": {
                "indentation": ["error", 2]
            }
        };

        let file = "config-two-spaces.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(11);

        Solium.reset();
        done();
    });

    it("should reject files with mixed tabs and spaces", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "mixed-tabs-spaces.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject an invalid file with a multiline array", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "multiline-array.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(8);

        Solium.reset();
        done();
    });

    it("should reject an invalid file with a multiline call declaration", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "multiline-call-declaration.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject an invalid file with a multiline call expression", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "multiline-call-expression.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject an invalid file with a struct", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "struct.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(8);

        Solium.reset();
        done();
    });

    it("should reject top level indentation", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "top-level-indent.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject chars before top level declaration", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "chars-before-top-level.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject chars before top level declaration", function(done) {
        let userConfig = {
            "rules": {
                "indentation": "error"
            }
        };

        let file = "indented-top-level-closing-brace.sol";
        let code = fs.readFileSync(path.join(rejectDir, file), "utf8");

        let errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject any kind of indent when indent is set to 0", done => {
        const config = {
            "rules": {
                "indentation": ["error", 0]
            }
        };
        const code = `contract Foo {${EOL}function bar() {${EOL}if (true) {${EOL}  lol(100, \'hello\');${EOL}}${EOL}}${EOL}}`,
            errors = Solium.lint(code, config);
        
        errors.should.have.size(1);

        Solium.reset();
        done();
    });
});
