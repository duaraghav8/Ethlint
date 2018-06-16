/**
 * @fileoverview Tests for function-order rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium");
const userConfig = {
    "rules": {
        "function-order": "error"
    }
};


describe("[RULE] function-order: Acceptances", function() {

    it("should accept functions ordered correctly inside a contract", done => {
        let codes = [`
			contract Foo {
				function Foo() {}
				string myName = "Hello";
				function() {}

				function a(uint x) myModif external returns (uint);
				uint stateV1 = 100;
				function a() external {}
				function a(uint x) myModif external returns (uint) {}

				function a(uint x) myModif public returns (uint);
				uint stateV1 = 100;
				function a() public {}
				function a(uint x) myModif public returns (uint) {}
				function a(uint x) {}	// public
				function a(uint x) myModif otherModif {}	// public

				function a(uint x) myModif internal returns (uint);
				uint stateV1 = 100;
				function a() internal {}
				function a(uint x) myModif internal returns (uint) {}

				modifier someModif (bytes32 faa) { _; }

				function a(uint x) myModif private returns (uint);
				uint stateV1 = 100;
				function a() private {}
				function a(uint x) myModif private returns (uint) {}
			}
		`];

        codes.push(`
			contract Foo {
				constructor(string name, address account) {

				}
				string myName = "Hello";
				function() {}

				modifier someModif (bytes32 faa) { _; }

				function a(uint x) myModif private returns (uint);
				uint stateV1 = 100;
				function a() private {}
				function a(uint x) myModif private returns (uint) {}
			}
		`);

        codes.push(`
			contract Foo {
				function Foo() {}
				string myName = "Hello";
				
				uint stateV1 = 100;
				function a() public {}
				function a(uint x) {}	// public
				function a(uint x) myModif otherModif {}	// public

				modifier someModif (bytes32 faa) { _; }

				uint stateV1 = 100;
				function a(uint x) myModif private returns (uint) {}
			}
		`);

        codes.push(`
			contract Foo {}
		`);

        codes.push(`
			contract Foo {
				function a(uint x) myModif internal returns (uint);
				uint stateV1 = 100;
				
				modifier someModif (bytes32 faa) { _; }

				function a(uint x) myModif private returns (uint);
			}
		`);

        codes.push(`
			contract Foo {
				function Foo() {}
			}
		`);

        codes.push(`
			contract Foo {
				function() {}
			}
		`);

        codes.push(`
			contract Foo {
				function a() external {}
			}
		`);

        codes.push(`
			contract Foo {
				function a() {}
			}
		`);

        codes.push(`
			contract Foo {
				function a() internal {}
			}
		`);

        codes.push(`
			contract Foo {
				function a() private {}
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


describe("[RULE] function-order: Rejections", function() {

    it("should reject functions ordered incorrectly inside a contract", done => {
        let code = `
			contract Foo {
				function bar() {}
				function Foo(string f) {}
			}
		`;
        let errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.have.size(1);

        code = `
			contract Foo {
				function a(uint x) myModif private returns (uint) {}
				function a() private {}
				uint stateV1 = 100;
				function a(uint x) myModif private returns (uint);

				modifier someModif (bytes32 faa) { _; }

				function a(uint x) myModif internal returns (uint) {}
				function a() internal {}
				uint stateV1 = 100;
				function a(uint x) myModif internal returns (uint);

				function a(uint x) myModif otherModif {}	// public
				function a(uint x) {}	// public
				function a(uint x) myModif public returns (uint) {}
				function a() public {}
				uint stateV1 = 100;
				function a(uint x) myModif public returns (uint);

				function a(uint x) myModif external returns (uint) {}
				function a() external {}
				uint stateV1 = 100;
				function a(uint x) myModif external returns (uint);

				function() {}
				string myName = "Hello";
				function Foo() {}
				constructor(uint x, bool boop) {

				}
			}
		`;
        errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.have.size(14);

        Solium.reset();
        done();
    });

});
