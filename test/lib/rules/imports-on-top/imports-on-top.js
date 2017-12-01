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
