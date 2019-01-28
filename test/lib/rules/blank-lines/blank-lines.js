/**
 * @fileoverview Tests for blank-lines rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers"),
    fs = require("fs"),
    path = require("path");

const userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "blank-lines": true
    }
};

const addPragma = wrappers.addPragma;

describe("[RULE] blank-lines: Acceptances", () => {

    it("should accept contract declarations succeeded by 2 blank lines (all declarations except for last)", done => {
        let code = fs.readFileSync(path.join(__dirname, "./accept/contract.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept library declarations succeeded by 2 blank lines (all declarations except for last)", done => {
        let code = fs.readFileSync(path.join(__dirname, "./accept/library.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept single contract declaration", done => {
        let code = fs.readFileSync(path.join(__dirname, "./accept/contract-single.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should accept single library declaration", done => {
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

    it("should accept single-line functions without blank lines between them & multiline functions WITH them", done => {
        let code = fs.readFileSync(path.join(__dirname, "./accept/function.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should not enforce blank line rules on top level declarations other than contract & library declarations", done => {
        let code = "import * as x from \"y\";\nimport * as x from \"y\";\nimport * as x from \"y\";\n\n\ncontract Yoda {} import * as foo from \"bar.sol\";",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

});


describe("[RULE] blank-lines: Rejections", () => {

    it("should reject contract declarations with < 2 lines of gap between them", done => {
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

    it("should reject library declarations with < 2 lines of gap between them", done => {
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

    it("should reject a multiline function that is not followed by a blank line", done => {
        let code = fs.readFileSync(path.join(__dirname, "./reject/function.sol"), "utf8"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(5);

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


describe("[RULE] blank-lines: Fixes", () => {

    it("Should correct spacing between top level declarations with < 2 lines of gap between them", done => {
        const code = fs.readFileSync(path.join(__dirname, "./reject/contract.sol"), "utf8");
        let { errorMessages: errors, fixedSourceCode } = Solium.lintAndFix(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        // The fixes should have fixed all linting errors with respect to this rule
        errors = Solium.lint(fixedSourceCode, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("Should correct multiline functions not followed by a blank line", done => {
        let code = fs.readFileSync(path.join(__dirname, "./reject/function.sol"), "utf8"),
            { errorMessages: errors, fixedSourceCode } = Solium.lintAndFix(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        // The fixes should have fixed all linting errors with respect to this rule
        errors = Solium.lint(fixedSourceCode, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should correct top level declarations accompanied by comments but not gapped properly", done => {
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
            
            /*
            This is a test for block comments
            that extend across multiple lines
            */
            contract Test {
                  
            }
            `,
            `
            pragma solidity ^0.4.17;
            
            
            contract T {} // Test
            contract S {}
            `
        ];

        snippets.forEach(code => {
            let { errorMessages: errors, fixedSourceCode } = Solium.lintAndFix(code, userConfig);
            errors.should.be.Array();
            errors.should.have.size(0);

            errors = Solium.lint(fixedSourceCode, userConfig);
            errors.should.be.Array();
            errors.should.have.size(0);
        });

        Solium.reset();
        done();
    });

});
