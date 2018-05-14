/**
 * @fileoverview Description of the rule
 * @author YOUR NAME <your@email>
 */

"use strict";

let Solium = require("../../../../lib/solium");

// Solium should only lint using your rule so only issues flagged by your rule are reported
// so you can easily test it. Replace foo-bar with your rule name.
let config = {
    "rules": {
        "deprecated-constructor": "warning"      // alternatively - ["error" OR "warning", options acc. to meta.schema of rule]
    }
};

describe("[RULE] deprecated-constructor: Rejections", function() {
    it("should reject constructor names that are the same as contract names", function(done) {
        let codes = [`
            contract Foo {
                function Foo() {}
            }
        `, `
            contract Foo {
                function Foo(string name, address account) {}
            }
        `];
        codes.forEach(code => {
            let errors = Solium.lint(code, config);
            errors.should.be.Array();
            errors.should.have.size(1);
        });

        Solium.reset();
        done();
    });
});

describe("[RULE] deprecated-constructor: Acceptances", function() {
    it("should accept constructor names that called \"constructor\"", function(done) {
        let codes = [`
            contract Foo {
                function constructor() {}
            }
        `, `
            contract Foo {
                function constructor(string name, address account) {}
            }
        `, `
            contract Foo {
                constructor() {}
            }
        `, `
            contract Foo {
                constructor(string name, address account) {}
            }
        `];

        codes.forEach(code => {
            const errors = Solium.lint(code, config);
            errors.should.be.Array();
            errors.should.have.size(0);
        });

        Solium.reset();
        done();
    });
});

describe("[RULE] deprecated-constructor: fixes", () => {

    it("should replace contract names with 'constructor' for constructor function", done => {
        const declarations = [
            { bad: "function Foo();", good: "function constructor();" },
            {
                bad: "function Foo(string name, address account) {}",
                good: "function constructor(string name, address account) {}"
            }
        ];

        declarations.forEach(({ bad, good }) => {
            const { fixesApplied, fixedSourceCode,
                errorMessages } = Solium.lintAndFix(`contract Foo { ${bad} }`, config);

            fixesApplied.should.be.Array();
            fixesApplied.should.have.size(1);
            errorMessages.should.be.Array();
            errorMessages.should.be.empty();
            fixedSourceCode.should.equal(`contract Foo { ${good} }`);
        });

        done();
    });

});