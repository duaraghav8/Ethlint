/**
 * @fileoverview Tests for function-order rule
 * @author Yuichi Nukiyama
 */

"use strict";

const Solium = require("../../../../lib/solium");
const userConfig = {
    "rules": {
        "no-ignore-return-values": "warning"
    }
};


describe("[RULE] function-call: Acceptances", function() {

    it("should accept functions which use return value", done => {
        let codes = [`
			contract Foo {
				function a(uint x) private returns (uint) { return 1; }
				function b() private { uint c = a(1); }
			}
        `];

        codes.push(`
            contract Foo {
                uint c;
                function a(uint x) private returns (uint) {}
                function b() private { c = a(1); }
            }
        `);

        codes.push(`
            contract Foo {
                function a(uint x) public {}
                function b() private { a(1); }
            }
        `);

        codes.forEach(code => {
            const errors = Solium.lint(code, userConfig);
            errors.should.be.Array();
            errors.should.have.size(0);
        });

        Solium.reset();
        done();
    });
});

describe("[RULE] function-call: Rejections", function() {

    it("should reject functions which don't use return value", done => {
        let codes = [`
			contract Foo {
				function a(uint x) private returns (uint) { return 1; }
				function b() private { a(1); }
			}
        `];

        codes.push(`
            contract Foo {
                uint c;
                function a() private returns (uint) {}
                function b() private { a(); }
            }
        `);

        codes.forEach(code => {
            const errors = Solium.lint(code, userConfig);
            errors.should.be.Array();
            errors.should.have.size(1);
        });

        Solium.reset();
        done();
    });
});