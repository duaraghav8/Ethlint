/**
 * @fileoverview Tests for imports-on-top rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    fs = require("fs"), path = require("path"), { EOL } = require("os");

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

describe("[RULE] imports-on-top: Fixes", function() {

    it("Should do nothing if source code is empty or has no import-related issues", done => {
        // Absolutely empty string results in exception from Solium.lintAndFix()
        let codes = [
            "// hello world",
            `
            pragma solidity 0.4.0;
            pragma experimental ABIEncoderV2;

            import "blah";
            import * as Lola from "blahblah.sol";

            contract Foo {}
            `,
            `
            import "foobar";
            library Blah {}
            `,
            `
            pragma experimental ABIEncoderV2;
            import "foobar";
            library Blah {}
            `,
            `
            contract Drone {}
            library Jenny {}
            `
        ];

        codes.forEach(code => {
            let { errorMessages: errors, fixedSourceCode, fixesApplied } = Solium.lintAndFix(code, userConfig);

            errors.should.be.Array();
            errors.should.be.size(0);
            fixedSourceCode.should.equal(code);
            fixesApplied.should.be.Array();
            fixesApplied.should.be.size(0);
        });

        Solium.reset();
        done();
    });

    it("should place import below pragma solidity", done => {
        const codes = [
            `
            pragma solidity ^0.2.3;
            library Foo {}
            import "wow.sol";
            `,
            `
            pragma solidity ^0.2.3;


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            `,
            `
            pragma solidity ^0.2.3;


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            import "mickey";
            import "minnie.sol";
            `
        ];
        const fixedCodes = [
            `
            pragma solidity ^0.2.3;


import "wow.sol";
            library Foo {}
            
            `,
            `
            pragma solidity ^0.2.3;


import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            `,
            `
            pragma solidity ^0.2.3;


import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            import "mickey";
            import "minnie.sol";
            `
        ];
        

        let result = Solium.lintAndFix(codes[0], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[0]);

        result = Solium.lintAndFix(codes[1], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[1]);

        result = Solium.lintAndFix(codes[2], userConfig);
        result.errorMessages.should.be.size(2);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[2]);

        Solium.reset();
        done();
    });

    it("should place import below pragma experimental", done => {
        const codes = [
            `
            pragma experimental ABIEncoderV2;
            library Foo {}
            import "wow.sol";
            `,
            `
            pragma experimental ABIEncoderV2;


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            `,
            `
            pragma experimental ABIEncoderV2;


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            import "mickey";
            import "minnie.sol";
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;
            library Foo {}
            import "wow.sol";
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            import "mickey";
            import "minnie.sol";
            `
        ];
        const fixedCodes = [
            `
            pragma experimental ABIEncoderV2;


import "wow.sol";
            library Foo {}
            
            `,
            `
            pragma experimental ABIEncoderV2;


import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            `,
            `
            pragma experimental ABIEncoderV2;


import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            import "mickey";
            import "minnie.sol";
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;


import "wow.sol";
            library Foo {}
            
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;


import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;


import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            import "mickey";
            import "minnie.sol";
            `
        ];
        

        let result = Solium.lintAndFix(codes[0], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[0]);

        result = Solium.lintAndFix(codes[1], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[1]);

        result = Solium.lintAndFix(codes[2], userConfig);
        result.errorMessages.should.be.size(2);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[2]);


        result = Solium.lintAndFix(codes[3], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[3]);

        result = Solium.lintAndFix(codes[4], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[4]);

        result = Solium.lintAndFix(codes[5], userConfig);
        result.errorMessages.should.be.size(2);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[5]);

        Solium.reset();
        done();
    });

    it("should place import below existing import statement", done => {
        const codes = [
            `
            pragma experimental ABIEncoderV2;
            import "foobar.sol";
            library Foo {}
            import "wow.sol";
            `,
            `
            pragma experimental ABIEncoderV2;
            import "foobar.sol";


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            `,
            `
            pragma experimental ABIEncoderV2;
            import "foobar.sol";


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            import "mickey";
            import "minnie.sol";
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;
            import "foobar.sol";
            library Foo {}
            import "wow.sol";
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;
            import "foobar.sol";


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;
            import "foobar.sol";


            library Foo {}
            contract WiggleWiggle{}
            import "wow.sol";
            import "mickey";
            import "minnie.sol";
            `
        ];
        const fixedCodes = [
            `
            pragma experimental ABIEncoderV2;
            import "foobar.sol";
import "wow.sol";
            library Foo {}
            
            `,
            `
            pragma experimental ABIEncoderV2;
            import "foobar.sol";
import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            `,
            `
            pragma experimental ABIEncoderV2;
            import "foobar.sol";
import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            import "mickey";
            import "minnie.sol";
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;
            import "foobar.sol";
import "wow.sol";
            library Foo {}
            
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;
            import "foobar.sol";
import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            `,
            `
            pragma solidity ^0.2.3;
            pragma experimental ABIEncoderV2;
            import "foobar.sol";
import "wow.sol";


            library Foo {}
            contract WiggleWiggle{}
            
            import "mickey";
            import "minnie.sol";
            `
        ];
        

        let result = Solium.lintAndFix(codes[0], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[0]);

        result = Solium.lintAndFix(codes[1], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[1]);

        result = Solium.lintAndFix(codes[2], userConfig);
        result.errorMessages.should.be.size(2);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[2]);


        result = Solium.lintAndFix(codes[3], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[3]);

        result = Solium.lintAndFix(codes[4], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[4]);

        result = Solium.lintAndFix(codes[5], userConfig);
        result.errorMessages.should.be.size(2);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[5]);

        Solium.reset();
        done();
    });

    it("should place import on top", done => {
        const codes = [
            `
            contract foo {}
            import "coal.sol";
            `,
            `
            contract foo {}
            library bar {}
            import "coal.sol";
            `,
            `
            contract foo {}
            library bar {}
            import "coal.sol";
            import "june.sol";
            `
        ];
        const fixedCodes = [
            `
            import "coal.sol";
contract foo {}
            
            `,
            `
            import "coal.sol";
contract foo {}
            library bar {}
            
            `,
            `
            import "coal.sol";
contract foo {}
            library bar {}
            
            import "june.sol";
            `
        ];


        let result = Solium.lintAndFix(codes[0], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[0]);

        result = Solium.lintAndFix(codes[1], userConfig);
        result.errorMessages.should.be.size(0);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[1]);

        result = Solium.lintAndFix(codes[2], userConfig);
        result.errorMessages.should.be.size(1);
        result.fixesApplied.should.be.size(1);
        result.fixedSourceCode.should.equal(fixedCodes[2]);

        Solium.reset();
        done();
    });

    it("Should move the import statements below the last valid import node", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./fixes/only-one-error.sol"), "utf8");
        let {errorMessages: errors, fixedSourceCode} = Solium.lintAndFix(code, userConfig);

        // All errors should've been corrected
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        // Ensure that the bad import is moved to the right place.
        const importLine = fixedSourceCode.split(EOL)[4].trim();
        importLine.should.equal("import \"nano.sol\";");

        // If we re-lint the fixedSourceCode with userConfig we should get no errors
        errors = Solium.lint(fixedSourceCode, userConfig);

        // Code should've been fixed
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("Should move the import statements two lines below the pragma if no valid import exists", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./fixes/before-pragma.sol"), "utf8");
        let {errorMessages: errors, fixedSourceCode} = Solium.lintAndFix(code, userConfig);

        // There should be no errors
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        // The fixed source code should have two new lines after the first pragma solidity then have all the imports
        let lines = fixedSourceCode.split(EOL);
        lines[3].should.equal("import \"nano.sol\";");

        errors = Solium.lint(fixedSourceCode, userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("Should still fix the file correctly if there's only one invalid import statement", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./fixes/only-one-error.sol"), "utf8");
        let {errorMessages: errors, fixedSourceCode} = Solium.lintAndFix(code, userConfig);

        // There should be no errors
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(fixedSourceCode, userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

});
