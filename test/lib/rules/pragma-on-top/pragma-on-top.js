/**
 * @fileoverview Tests for pragma-on-top rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium");

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "pragma-on-top": true
    }
};


describe("[RULE] pragma-on-top: Acceptances", function() {

    it("should accept if program has only 1 pragma statement at the top of the file", function(done) {
        let code = "pragma solidity ^4.4.0;\nimport {foo} from \"bar\";",
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(0);

        code = "\n\/*Foo Bar*\/\n\npragma solidity 4.4.0;";
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(0);

        code = `
			pragma solidity ^4.4.0;
			// Hello world
			pragma experimental ABIEncoderV2;
			/* Avada Kedavra! */
			pragma experimental "v0.5.0";

			import {foo} from "bar";

			contract Foo {}
		`;
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(0);

        code = "/*Foo Bar*\/";	// empty source code
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

});


describe("[RULE] pragma-on-top: Rejections", function() {

    it("should reject a non-empty program that doesn't have a pragma statement on top", function(done) {
        let code = "\/*Hello world*\/\nimport {foo} from \"bar\";",
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);
        errors [0].message.should.equal("No Pragma directive found at the top of file.");

        code = "\/*Hello world*\/\nimport {foo} from \"bar\";\npragma solidity ^4.4.0;";
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);
        errors [0].message.should.equal("\"pragma solidity ^4.4.0;\" should be at the top of the file.");

        code = `
			pragma experimental ABIEncoderV2;
			pragma experimental "v0.5.0";
			import {foo} from "bar";
			contract Foo {}
		`;
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);
        errors [0].message.should.equal("No Pragma directive found at the top of file.");

        code = `
			import {foo} from "bar";
			pragma experimental ABIEncoderV2;
			contract Foo {}
			pragma experimental "v0.5.0";
		`;
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(3);	// issues reported: no pragma & experimental pragmas not on top

        code = `
			pragma experimental ABIEncoderV2;
			pragma solidity ^0.4.0;
			import {foo} from "bar";
			contract Foo {}
		`;
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject program that has more than 1 pragma statement", function(done) {
        let code = "pragma solidity ^4.4.0;\npragma solidity ^4.4.0;",
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);

        code = "pragma solidity ^4.4.0;\ncontract Foo {}\npragma solidity ^4.4.0;";
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);

        code = "pragma solidity ^4.4.0;\npragma experimental ABIEncoderV2;\ncontract Foo {}\npragma solidity ^4.4.0;";
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject pragma experimental statement(s) having anything except pragma above them", done => {
        let code = `
			pragma solidity ^0.4.0;
			pragma experimental "blahblah";
			pragma experimental "blahblah2";
			import {foo} from "bar";
			pragma experimental ABIEncoderV2;
			contract Foo {}
			pragma experimental "v0.5.0";
		`;
        let errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(2);

        Solium.reset();
        done();
    });

});


describe("[RULE] pragma-on-top: Fixes", function() {

    it("should move an existing pragma statement to top of file (above all code) when fix is enabled", function(done) {
        let config = {
            "rules": {
                "pragma-on-top": "error"
            }
        };

        let unfixedCode = "contract Foo {}\npragma solidity ^0.4.0;",
            fixedCode = "pragma solidity ^0.4.0;\ncontract Foo {}\n";

        let fixed = Solium.lintAndFix(unfixedCode, config);

        fixed.should.be.type("object");
        fixed.should.have.ownProperty("fixedSourceCode");
        fixed.should.have.ownProperty("errorMessages");
        fixed.should.have.ownProperty("fixesApplied");

        fixed.fixedSourceCode.should.equal(fixedCode);
        fixed.errorMessages.should.be.Array();
        fixed.errorMessages.length.should.equal(0);
        fixed.fixesApplied.should.be.Array();
        fixed.fixesApplied.length.should.equal(1);

        Solium.reset();
        done();
    });

});
