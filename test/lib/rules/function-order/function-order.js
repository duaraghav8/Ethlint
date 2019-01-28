/**
 * @fileoverview Tests for function-order rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    { toContract } = require("../../../utils/wrappers");

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

    it("should accept valid config options", done => {
        const config = { rules: {} }, code = "contract Foo {}";
        const testOptions = [
            { ignore: { constructorFunc: false } },
            { ignore: { fallbackFunc: false } },
            { ignore: { functions: [] } },
            { ignore: { visibilities: [] } },
            { ignore: { constructorFunc: false, visibilities: [], functions: [] } },
            { ignore: { fallbackFunc: false, constructorFunc: false, visibilities: [], functions: [] } },
            { ignore: { visibilities: [], functions: [] } },
            { ignore: { constructorFunc: false, visibilities: [] } },
            { ignore: { constructorFunc: false, functions: [] } }
        ];

        testOptions.forEach(opt => {
            config.rules["function-order"] = ["error", opt];
            Solium.lint.bind(Solium, code, config).should.not.throw();
        });

        done();
    });

    it("should ignore functions as specified in configuration", done => {
        const config = {
            rules: {
                "function-order": ["error", { ignore: {} }]
            }
        };

        const cases = [
            [
                { constructorFunc: true },
                `
				function() payable {}
				constructor() public { foobar(); }
				`
            ],
            [
                { fallbackFunc: true },
                `
				function myFunc(uint x, string bby) external;
				function() payable {}
				`
            ],
            [
                { functions: ["mySecondFunc"] },
                `
				function myFunc(uint x, string bby) internal {}
				function mySecondFunc(address sherlock) public {}
				`
            ],
            [
                { visibilities: ["internal", "private"] },
                `
				function dummy() private;
				function myFunc(uint x, string bby) internal {}
				function mySecondFunc(address sherlock) public {}
				function myThirdFunc(address sherlock) public {}
				`
            ]
        ];

        cases.forEach(tc => {
            config.rules["function-order"][1].ignore = tc[0];
            const errors = Solium.lint(toContract(tc[1]), config);
            errors.should.be.Array();
            errors.should.be.empty();
        });

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

    it("should reject invalid config options", done => {
        const config = { rules: {} }, code = "contract Foo {}";
        const testOptions = [
            {},
            { ignore: {} },
            { foobarbaz: { visibilities: [] } },
            { ignore: { foobar: [] } },
            { ignore: { constructorFunc: "hello", visibilities: [], functions: [] } },
            { ignore: { constructorFunc: false, visibilities: 18926, functions: [] } },
            { ignore: { constructorFunc: false, visibilities: [], functions: {} } },
            { ignore: { fallbackFunc: null } }
        ];

        testOptions.forEach(opt => {
            config.rules["function-order"] = ["error", opt];
            Solium.lint.bind(Solium, code, config).should.throw();
        });

        done();
    });

});
