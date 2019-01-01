/**
 * @fileoverview Tests for linebreak-style rule
 * @author Arjun Nemani <nemaniarjun@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers"),
    { addPragma } = wrappers,
    path = require("path"),
    fs = require("fs");

const userConfigUnix = {
    rules: {
        "linebreak-style": "error"
    }
};

describe("[RULE] linebreak-style: Acceptances for Unix Line breaks", function() {
    it("should accept when receiving Unix Line breaks", function(done) {
        const code = fs
            .readFileSync(path.join(__dirname, "./unix-endings"))
            .toString();
        const errors = Solium.lint(addPragma(code), userConfigUnix);

        errors.should.be.Array();
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });
});

describe("[RULE] linebreak-style: Rejections for Unix Line breaks", function() {
    it("should reject when receiving Windows Line breaks", function(done) {
        const code = fs
            .readFileSync(path.join(__dirname, "./windows-endings"))
            .toString();
        const errors = Solium.lint(code, userConfigUnix);

        errors.should.be.Array();
        errors.length.should.be.above(0);

        Solium.reset();
        done();
    });
});



describe("[RULE] linebreak-style: Fixes for Unix Line breaks", function() {
    it("should change to Unix Line Breaks when receiving Windows Line breaks", function(done) {
        const unfixedCode = fs
            .readFileSync(path.join(__dirname, "./windows-endings"))
            .toString();
        const fixedCode = fs
            .readFileSync(path.join(__dirname, "./unix-endings"))
            .toString();
        const newCode = Solium.lintAndFix(unfixedCode, userConfigUnix);

        newCode.fixedSourceCode.should.equal(fixedCode);

        Solium.reset();
        done();
    });
});

const userConfigWindows = {
    rules: {
        "linebreak-style": ["error", "windows"]
    }
};

describe("[RULE] linebreak-style: Acceptances for Windows Line breaks", function() {
    it("should accept when receiving Windows Line breaks", function(done) {
        const code = fs
            .readFileSync(path.join(__dirname, "./windows-endings"))
            .toString();

        const errors = Solium.lint(code, userConfigWindows);

        errors.should.be.Array();
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });
});

describe("[RULE] linebreak-style: Rejections for Windows Line breaks", function() {
    it("should reject when receiving Unix Line breaks", function(done) {
        const code = fs
            .readFileSync(path.join(__dirname, "./unix-endings"))
            .toString();

        const errors = Solium.lint(code, userConfigWindows);

        errors.should.be.Array();
        errors.length.should.be.above(0);

        Solium.reset();
        done();
    });
});

describe("[RULE] linebreak-style: Fixes for Windows Line breaks", function() {
    it("should change to Windows Line breaks when receiving Unix Line breaks", function(done) {
        const unfixedCode = fs
            .readFileSync(path.join(__dirname, "./unix-endings"))
            .toString();
        const fixedCode = fs
            .readFileSync(path.join(__dirname, "./windows-endings"))
            .toString();

        const newCode = Solium.lintAndFix(unfixedCode, userConfigWindows);
        newCode.fixedSourceCode.should.equal(fixedCode);

        Solium.reset();
        done();
    });
});
