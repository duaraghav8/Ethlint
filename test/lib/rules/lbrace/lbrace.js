/**
 * @fileoverview Tests for lbrace rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers");

const toContract = wrappers.toContract,
    toFunction = wrappers.toFunction,
    addPragma = wrappers.addPragma,
    { EOL } = require("os");

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "lbrace": true
    }
};

describe("[RULE] lbrace: Acceptances", function() {

    it("should allow abstract functions", function(done) {
        let code = "function abstractFunc (uint x, string y) public returns (boolean);",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow lbrace 1 line after returns declaration", done => {
        let code = `contract Foo {
    function calcUnclaimedRewards(uint gav)
        view
        returns (
            uint,
            string aaa,
            bytes32 exa,
            uint ff
        )
    {
        //code
    }
}`;
        let errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(0);


        code = `contract Foo {
    function calcUnclaimedRewards(uint gav)
        view
        returns (
            uint,
            string aaa,
            bytes32 exa,
            uint ff)
    {
        //code
    }
}`;
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow (short-declaration) bodies with opening brace on same line after a single space", function(done) {
        let code = "contract Visual {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "library Visual {}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `function foobar (bytes32 name) returns (address) {${EOL}\t/*body*/${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `struct Student {${EOL}\tstring name;${EOL}\tuint age;${EOL}\taddress account;${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `for (var i = 0; i < 10; i++) {${EOL}\thello ();${EOL}}`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `uint i = 0; while (i < 10) {${EOL}\ti++;${EOL}}`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `uint i = 0; do {${EOL}\ti++;${EOL}}${EOL}while (i < 10);`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow when closing brace is on its own line unless the body is declared on a single line like if (..) {...}", function(done) {
        let code = "if (true) { hello (); }",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `if (true) {${EOL}\thello ();${EOL}} else if (true) {${EOL}\tworld ();${EOL}} else {${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "function foo () {hello ();}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `function foo () {${EOL}\thello ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow single-item, single-line bodies without braces", function(done) {
        let code, errors;

        //since this rule doesn't lint for indentation, only ${EOL} without \t should also be valid
        code = `if (true)${EOL}newNumber = (10 * 78 + 982 % 6**2);${EOL}else${EOL}newNumber = 0;`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `if (true)${EOL}\tlaunchEvent (\"foo bar!\");`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `if (true)${EOL}createStructObject ({ name: \"Chuck Norris\", age: \"inf\" });`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();

    });

    it("should allow functions with arguments spanning over multiple lines to NOT have opening brace on same line", function(done) {
        let code = `function lotsOfArgs (${EOL}\tuint x,${EOL}\tstring y,${EOL}\taddress z${EOL}) {${EOL}\tfoobar ();${EOL}}`,
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow opening brace to be on its own line in case a function has modifiers", function(done) {
        let code = `function modifs ()${EOL}public${EOL}owner${EOL}priced${EOL}returns (uint)${EOL}{${EOL}\tfoobar ();${EOL}}`,
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `function modifs (${EOL}\tuint x,${EOL}\tstring y${EOL})${EOL}public${EOL}owner${EOL}priced${EOL}returns (uint)${EOL}{${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `pragma solidity ^4.4.0;${EOL}import {high} from \"low.sol\";${EOL.repeat(3)}contract MyContract {${EOL}    address public myAddress;${EOL.repeat(2)}    function MyContract(${EOL}        uint x,${EOL}        string y${EOL}    )${EOL}    public${EOL}    returns (uint)${EOL}    {${EOL}        myAddress = address(this);${EOL}    }${EOL}}`;
        errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `function modifs (${EOL}\tuint x,${EOL}\tstring y${EOL})${EOL}public${EOL}owner${EOL}priced${EOL}returns (uint) \t${EOL}{${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);


        code = `
            function requestSubscription(
                uint giveQuantity,
                uint shareQuantity,
                uint incentiveQuantity
            )
                external
                pre_cond(firstCond)   // a comment
                pre_cond(someCond)    // a comment
            {
                bar(100);
            }
        `;
        errors = Solium.lint(toContract(code), userConfig);

        errors.should.be.Array();
        errors.length.should.equal(0);


        code = `
            function requestSubscription(
                uint giveQuantity,
                uint shareQuantity,
                uint incentiveQuantity
            )
                external
                pre_cond(firstCond)   // a comment
                pre_cond(someCond)    // a comment
                payable
                blue    // a comment wooww
            {
                bar(100);
            }
        `;
        errors = Solium.lint(toContract(code), userConfig);

        errors.should.be.Array();
        errors.length.should.equal(0);
		
        Solium.reset();
        done();
    });

    it("should allow opening brace to be on its own line in case a function has modifiers (without brackets)", function(done) {
        let code = `function modifs ()${EOL}public${EOL}owner${EOL}priced(0)${EOL}payable${EOL}{${EOL}\tfoobar ();${EOL}}`,
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow opening brace to be on its own line in case a function has base constructor arguments", function(done) {
        let code = `function baseArgs ()${EOL}\tA (10)${EOL}\tB (\"hello\")${EOL}\tC (0x0)${EOL}\tD (frodo)${EOL}{${EOL}\tfoobar ();${EOL}}`,
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow else clauses beginning on the same line as closing brace of if consequent", function(done) {
        let code = "if (true) {h();} else if (true) {h();} else {h();}",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "if (true) {h();} else {h();}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "if (true) {h();} else if (true) {h();}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `if (true) {h();} else if (true)${EOL}hello ();`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = `if (true) {h();} else if (true)${EOL}hello ();`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

});


describe("[RULE] lbrace: Rejections", function() {

    it("should reject any opening brace which is not preceded by EXACTLY single space (exception: functions with modifiers)", function(done) {
        let code = "contract FooBar{}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "contract FooBar  {}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "contract FooBar\t{}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "contract FooBar/*comment*/{}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = "library FooBar{}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "library FooBar  {}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "library FooBar\t{}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "library FooBar/*comment*/{}";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = "if (true){}";
        errors = Solium.lint(toFunction(code), userConfig);

        code = `if (true)${EOL}{call();}`;
        errors = Solium.lint(toFunction(code), userConfig);

        code = `${EOL.repeat(4)}\tif (true)${EOL}{call();}${EOL.repeat(3)}`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true)  {}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true)\t{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true)/*comment*/{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = "if (true) {} else if (true){}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else if (true)  {}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else if (true)\t{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else if (true)/*comment*/{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = "if (true) {} else{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else  {}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else\t{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else/*comment*/{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = "while (true) foo();";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "while (true){}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "while (true)  {}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "while (true)\t{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "while (true)/*comment*/{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = "for (;;) foo();";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "for (;;){}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "for (;;)  {}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "for (;;)\t{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "for (;;)/*comment*/{}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = `do{}${EOL}while (true);`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `do  {}${EOL}while (true);`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `do\t{}${EOL}while (true);`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `do/*comment*/{}${EOL}while (true);`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = "struct Student{}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "struct Student  {}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "struct Student\t{}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "struct Student/*comment*/{}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = "function foo (uint x) public modif returns (address){}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "function foo (uint x) public modif returns (address)  {}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "function foo (uint x) public modif returns (address)\t{}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "function foo (uint x) public modif returns (address)/*comment*/{}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = `function lotsOfArgs (${EOL}\tuint x,${EOL}\tstring y,${EOL}\taddress z${EOL}){${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `function lotsOfArgs (${EOL}\tuint x,${EOL}\tstring y,${EOL}\taddress z${EOL})  {${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `function lotsOfArgs (${EOL}\tuint x,${EOL}\tstring y,${EOL}\taddress z${EOL})\t{${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `function lotsOfArgs (${EOL}\tuint x,${EOL}\tstring y,${EOL}\taddress z${EOL})/*comment*/{${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });


    it("should reject all function declarations having multiple modifiers over multiple lines whose brace does not open on the line after the last modifier", function(done) {
        let code = `function lotsOfArgs ()${EOL}\tpublic${EOL}\treturns (address){${EOL}\tfoobar ();${EOL}}`,
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `function lotsOfArgs ()${EOL}\tpublic${EOL}\treturns (address) {${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `function lotsOfArgs ()${EOL}\tpublic${EOL}\treturns (address)\t{${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `function lotsOfArgs ()${EOL}\tpublic${EOL}\treturns (address)  {${EOL}\tfoobar ();${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });


    it("should reject all short declarations whose opening brace is not on the same line as theirs", function(done) {
        let code = `contract Foo is Bar, Baz${EOL}{}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `library Foo is Bar, Baz${EOL}{}`;
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true)${EOL}{} else if (true)${EOL}{} else${EOL}{}`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        code = `while (true)${EOL}{}`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `for (;;)${EOL}{}`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `function increment(uint x) public onlyowner returns (uint)${EOL}{${EOL}\treturn x + 1;${EOL}}`;
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });


    it("should reject clauses with empty statements", function(done) {
        let code = "if (true);",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true) {}${EOL}else;`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else if (true) {} else;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else if (true);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });


    it("should reject statements which are neither inside blocks nor completely reside on a single line", function(done) {
        let code = `if (true)${EOL}Pacman ({${EOL}\tname: \"Shannon\"${EOL}});`,
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true) {}${EOL}else${EOL}Pacman ({${EOL}\tname: \"Shannon\"${EOL}});`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true) {} else if (true) {} else${EOL}Pacman ({${EOL}\tname: \"Shannon\"${EOL}});`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true) {} else if (true)${EOL}Pacman ({${EOL}\tname: \"Shannon\"${EOL}});`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });


    it("should reject statements which exist on the same line as clause and are not brace-enclosed", function(done) {
        let code = "if (true) sayHello ();",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true) {}${EOL}else sayHello();`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else if (true) {} else sayHello();";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "if (true) {} else if (true) sayHello ();";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = "do foo(); while (true);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });


    it("should reject else clauses which are not on the same line as closing brace of if consequent", function(done) {
        let code = `if (true) {h();}${EOL}else if (true) {h();}${EOL}else {h();}`,
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = `if (true) {h();}${EOL}else {h();}`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true) {h();}${EOL}else if (true) {h();}`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true) {h();}${EOL}else if (true)${EOL}hello ();`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true) {h();}${EOL}else if (true)${EOL}hello ();`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = `if (true) {h();}${EOL}else hello ();`;
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);


        code = `contract Foo {
        function() returns (uint x, address y) {
                if (true)
                        foo(); else chumma();}}`;
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.have.size(1);

        Solium.reset();
        done();
    });

    it("should reject lbrace that's NOT 1 line after returns declaration", done => {
        let code = `contract Foo {
    function calcUnclaimedRewards(uint gav)
        view
        returns (
            uint,
            string aaa,
            bytes32 exa,
            uint ff
        ) {
        //code
    }
}`;
        let errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);


        code = `contract Foo {
    function calcUnclaimedRewards(uint gav)
        view
        returns (
            uint,
            string aaa,
            bytes32 exa,
            uint ff) {
        //code
    }
}`;
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });


    it("should reject lbrace that's NOT 1 line after last modifier", done => {
        let code = `
            function requestSubscription(
                uint giveQuantity,
                uint shareQuantity,
                uint incentiveQuantity
            )
                external
                pre_cond(firstCond)   // a comment
                pre_cond(someCond) {    // a comment
                bar(100);
            }
        `;
        let errors = Solium.lint(toContract(code), userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);


        code = `
            function requestSubscription(
                uint giveQuantity,
                uint shareQuantity,
                uint incentiveQuantity
            )
                external
                pre_cond(firstCond)   // a comment
                pre_cond(someCond)    // a comment

            {
                bar(100);
            }
        `;
        errors = Solium.lint(toContract(code), userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);


        code = `
            function requestSubscription(
                uint giveQuantity,
                uint shareQuantity,
                uint incentiveQuantity
            )
                external
                pre_cond(firstCond)   // a comment
                pre_cond(someCond)    // a comment
                fuckertron

            {
                bar(100);
            }
        `;
        errors = Solium.lint(toContract(code), userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);


        code = `
            function requestSubscription(
                uint giveQuantity,
                uint shareQuantity,
                uint incentiveQuantity
            )
                external
                pre_cond(firstCond)   // a comment
                pre_cond(someCond)    // a comment
                fuckertron
                lol { // a lol comment
                bar(100);
            }
        `;
        errors = Solium.lint(toContract(code), userConfig);

        errors.should.be.Array();
        errors.length.should.equal(1);

        done();
    });

});
