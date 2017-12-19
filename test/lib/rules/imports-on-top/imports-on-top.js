/**
 * @fileoverview Tests for imports-on-top rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium"),
    fs = require("fs"),
    path = require("path");

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "imports-on-top": true
    }
};

let runAll = {
    "extends": "solium:all",
};

const eol = require('os').EOL;


describe("[RULE] imports-on-top: Acceptances", function() {

    it("should accept if all import statements are on top of the file (but below the pragma directive)", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./accept/on-top.sol"), "utf8"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        // imports without pragmas
        code = `
			import "filename";
			import * as symbolName from "filename";
			import {symbol1 as alias, symbol2} from "filename";
			import "filename" as symbolName;
		`;
        errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `
			pragma solidity ^0.4.0;
			import "filename";
			import * as symbolName from "filename";
			import {symbol1 as alias, symbol2} from "filename";
			import "filename" as symbolName;
			contract Foo {}
		`;
        errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `
			pragma experimental blahblah;
			import "filename";
			import * as symbolName from "filename";
			import {symbol1 as alias, symbol2} from "filename";
			import "filename" as symbolName;

			library Foo {}
		`;
        errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

});


describe("[RULE] imports-on-top: Rejections", function() {

    it("should reject any import statement NOT on top of file", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./reject/intermingled.sol"), "utf8"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        Solium.reset();
        done();
    });

});

describe("[RULE] imports-on-top: Fixes", function() {

    it("Should move the import statements below the last valid import node", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./reject/intermingled.sol"), "utf8");
        let {errorMessages: errors, fixedSourceCode} = Solium.lintAndFix(code, userConfig);

        // All errors should've been corrected
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        // If we re-lint the fixedSourceCode with "extends": "all" we should get no errors
        errors = Solium.lint(fixedSourceCode, runAll);

        // Code should've been fixed
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("Should move the import statements two lines below the pragma if no valid import exists", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./fixes/beforePragma.sol"), "utf8");
        let {errorMessages: errors, fixedSourceCode} = Solium.lintAndFix(code, userConfig);

        // There should be no errors
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        // The fixed source code should have two new lines after the first pragma solidity then have all the imports
        let lines = fixedSourceCode.split(eol);
        lines[3].should.equal('import "nano.sol";');
        lines[4].should.equal('import * as symbolName from "filename";');

        // If we re-lint the fixedSourceCode with "extends": "all" we should get no errors
        errors = Solium.lint(fixedSourceCode, runAll);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("Should still fix the file correctly if there's only one invalid import statement", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./fixes/onlyOneError.sol"), "utf8");
        let {errorMessages: errors, fixedSourceCode} = Solium.lintAndFix(code, userConfig);

        // There should be no errors
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(fixedSourceCode, runAll);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    })

});
