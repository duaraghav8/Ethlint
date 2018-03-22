/**
 * @fileoverview Tests for emit rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium");
const userConfig = {
    "rules": {
        "emit": "error"
    }
};


describe("[RULE] emit: Acceptances", () => {

    it("should accept code without any event declarations", done => {
        let code = `contract Foo {
            function bar() {
                callFunc(100, "hello");
            }
        }`;
        let errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        done();
    });

    it("should accept code in which emit is used when events are declared", done => {
        let code = `contract Foo {
            event Blast(uint radius);
            event LogString(string desc);

            function bar() {
                emit Blast(100);
            }

            function() {
                if (true) {
                    emit SomeEvent();

                    for (uint i = 0; i < 10; i++) {
                        emit LogString("Hello world");
                        emit Blast(i);
                    }
                }
            }
        }`;
        let errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        done();
    });

    it("should accept code in which CallExpression is a function call, not event trigger", done => {
        let code = `contract Foo {
            event Blast(uint radius);
            event LogString(string desc);

            function bar() {
                myRandomFuncCall();
            }

            function() {
                if (true) {
                    for (uint i = 0; i < 10; i++) {
                        logString("Hello world");
                        blast(i);
                    }
                }
            }
        }`;
        let errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        done();
    });

    it("should accept when CallExpression & event declaration have same name but are in different scopes", done => {
        let code = `contract UnrelatedContract {
            event Blast(uint radius);
            event LogString(string desc);

            function foo() {}
        }
        
        contract Foo {
            function bar() {
                Blast(100);
            }

            function() {
                if (true) {
                    emit SomeEvent();

                    for (uint i = 0; i < 10; i++) {
                        LogString("Hello world");
                        Blast(i);
                    }
                }
            }
        }`;
        let errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        done();
    });

});


describe("[RULE] emit: Rejections", () => {

    it("should reject if event declared in the same contract is triggered without emit", done => {
        let code = `contract Foo {
            event Blast(uint radius);
            event LogString(string desc);

            function bar() {
                Blast(100);
            }

            function() {
                if (true) {
                    SomeEvent();
                    someFunctionCall(100, lol());

                    for (uint i = 0; i < 10; i++) {
                        LogString("Hello world");
                        Blast(i);
                    }

                    LogString("Dora the explorer!");
                }
            }
        }`;
        let errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.have.size(4);

        done();
    });

    // Below test case will be enabled only once
    // emit rule can detect event declarations from inherited contracts
    /*
    it("should reject if event declared in an inherited contract is triggered without emit", done => {
        done();
    });
    */

});


describe("[RULE] emit: Fixes", () => {

    it("should add emit keyword before non-emit event trigger statements when declaration & usage are in same contract", done => {
        let code = `contract Foo {
            event Blast(uint radius);
            event LogString(string desc);

            function bar() {
                Blast(100);
            }

            function() {
                if (true) {
                    SomeEvent();
                    someFunctionCall(100, lol());

                    for (uint i = 0; i < 10; i++) {
                        LogString("Hello world");
                        Blast(i);
                    }

                    LogString("Dora the explorer!");
                }
            }
        }`;

        let fixedCode = `contract Foo {
            event Blast(uint radius);
            event LogString(string desc);

            function bar() {
                emit Blast(100);
            }

            function() {
                if (true) {
                    SomeEvent();
                    someFunctionCall(100, lol());

                    for (uint i = 0; i < 10; i++) {
                        emit LogString("Hello world");
                        emit Blast(i);
                    }

                    emit LogString("Dora the explorer!");
                }
            }
        }`;

        const { originalSourceCode, fixesApplied,
            fixedSourceCode, errorMessages } = Solium.lintAndFix(code, userConfig);

        originalSourceCode.should.equal(code);
        fixedSourceCode.should.equal(fixedCode);
        errorMessages.should.be.Array();
        errorMessages.should.be.empty();
        fixesApplied.should.be.Array();
        fixesApplied.should.have.size(4);

        done();
    });

    it("should shouldn't attempt to fix statements which already use emit keyword", done => {
        let code = `contract Foo {
            event Blast(uint radius);
            event LogString(string desc);

            function bar() {
                emit Blast(100);
            }

            function() {
                if (true) {
                    SomeEvent();
                    someFunctionCall(100, lol());

                    for (uint i = 0; i < 10; i++) {
                        emit LogString("Hello world");
                        emit Blast(i);
                    }

                    emit LogString("Dora the explorer!");
                }
            }
        }`;

        const { originalSourceCode, fixesApplied,
            fixedSourceCode, errorMessages } = Solium.lintAndFix(code, userConfig);
        
        originalSourceCode.should.equal(code);
        fixedSourceCode.should.equal(code);
        fixesApplied.should.be.Array();
        fixesApplied.should.be.empty();
        errorMessages.should.be.Array();
        errorMessages.should.be.empty();

        done();
    });

});