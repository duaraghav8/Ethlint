/**
 * @fileoverview Tests for blank-lines rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers"),
    fs = require("fs"),
    path = require("path");

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "blank-lines": true
    }
};

let addPragma = wrappers.addPragma;

describe("[RULE] blank-lines: Acceptances", function() {

    it("should accept contract declarations succeeded by 2 blank lines (all declarations except for last)", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./accept/contract.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept library declarations succeeded by 2 blank lines (all declarations except for last)", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./accept/library.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept single contract declaration", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./accept/contract-single.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept single library declaration", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./accept/library-single.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept properly separated top level declarations accompanied by comments", done => {
        let snippets = [
            `
			pragma solidity ^0.4.17;
			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';


			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;


			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';
			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;
			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';


			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';
			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;
			/* import 'zeppelin-solidity/contracts/token/StandardToken.sol'; */


			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;


			/* import 'zeppelin-solidity/contracts/token/StandardToken.sol'; */
			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;
			/* import 'zeppelin-solidity/contracts/token/StandardToken.sol'; */


			/* import 'zeppelin-solidity/contracts/token/StandardToken.sol'; */
			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;
			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';


			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';
			contract Test {

				function Test () {
				}

			}


			library Fafa {}


			// inherits
			contract bar is foobar {}
			`
        ];

        snippets.forEach(code => {
            let errors = Solium.lint(code, userConfig);
            errors.should.be.Array();
            errors.should.have.size(0);
        });

        Solium.reset();
        done();
    });

    it("should accept single-line functions without blank lines between them & multiline functions WITH them", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./accept/function.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should not enforce blank line rules on top level declarations other than contract & library declarations", function(done) {
        let code = "import * as x from \"y\";\nimport * as x from \"y\";\nimport * as x from \"y\";\n\n\ncontract Yoda {} import * as foo from \"bar.sol\";",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

});


describe("[RULE] blank-lines: Rejections", function() {

    it("should reject contract declarations with < 2 lines of gap between them", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./reject/contract.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        errors [0].node.name.should.equal("Bcd");
        errors [1].node.name.should.equal("Cde");
        errors [2].node.name.should.equal("Def");

        Solium.reset();
        done();
    });

    it("should reject library declarations with < 2 lines of gap between them", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./reject/library.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        errors [0].node.name.should.equal("Bcd");
        errors [1].node.name.should.equal("Cde");
        errors [2].node.name.should.equal("Def");

        Solium.reset();
        done();
    });

    it("should reject a multiline function that is not followed by a blank line", function(done) {
        let code = fs.readFileSync(path.join(__dirname, "./reject/function.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors [0].node.name.should.equal("spam");

        Solium.reset();
        done();
    });

    it("should reject top level declarations accompanied by comments but not gapped properly", done => {
        let snippets = [
            `
			pragma solidity ^0.4.17;
			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';

			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;

			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';
			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;
			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';

			// import 'zeppelin-solidity/contracts/token/StandardToken.sol';
			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;

			/* import 'zeppelin-solidity/contracts/token/StandardToken.sol'; */

			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;

			/* import 'zeppelin-solidity/contracts/token/StandardToken.sol'; */

			contract Test {

				function Test () {
				}

			}
			`,
            `
			pragma solidity ^0.4.17;

			/* import 'zeppelin-solidity/contracts/token/StandardToken.sol'; */

			/* import 'zeppelin-solidity/contracts/token/StandardToken.sol'; */

			contract Test {

				function Test () {
				}

			}
			`
        ];

        snippets.forEach(code => {
            let errors = Solium.lint(code, userConfig);
            errors.should.be.Array();
            errors.should.have.size(1);
        });

        Solium.reset();
        done();
    });

});
