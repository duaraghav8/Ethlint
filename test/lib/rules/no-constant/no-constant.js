/**
 * @fileoverview Tests for no-constant rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium");
let wrappers = require("../../../utils/wrappers");
let acceptanceCases = wrappers.acceptanceCases;
let rejectionCases = wrappers.rejectionCases;
const userConfig = {
    "rules": {
        "no-constant": "error"
    }
};

acceptanceCases("no-constant", userConfig,
    [
        "function foo() view pure returns(bool);",
        "function foo() view pure returns(bool) {}",
        "function foo() {}",
        "function foo();",
        "function(){}",
        "function foo() myModifier(100, \"hello\") boo;"
    ]
);

rejectionCases("no-constant", userConfig,
    [
        "function foo() view pure constant returns(bool);",
        "function foo() constant pure returns(bool) {}",
        "function foo() constant {}",
        "function foo() constant;",
        "function()constant{}",
        "function foo() myModifier(100, \"hello\") constant boo;"
    ]
);

describe("[RULE] emit: fixes", () => {

    it("should replace constant with view", done => {
        const declarations = [
            { bad: "function foo() view pure constant returns(bool);", good: "function foo() view pure view returns(bool);" },
            { bad: "function foo() constant pure returns(bool) {}", good: "function foo() view pure returns(bool) {}" },
            { bad: "function foo() constant {}", good: "function foo() view {}" },
            { bad: "function foo() constant;", good: "function foo() view;" },
            { bad: "function()constant{}", good: "function()view{}" },
            {
                bad: "function foo() myModifier(100, \"hello\") constant boo;",
                good: "function foo() myModifier(100, \"hello\") view boo;"
            }
        ];

        declarations.forEach(({ bad, good }) => {
            const { fixesApplied, fixedSourceCode,
                errorMessages } = Solium.lintAndFix(`contract Foo { ${bad} }`, userConfig);
            
            fixesApplied.should.be.Array();
            fixesApplied.should.have.size(1);
            errorMessages.should.be.Array();
            errorMessages.should.be.empty();
            fixedSourceCode.should.equal(`contract Foo { ${good} }`);
        });

        done();
    });

});