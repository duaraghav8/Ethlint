/**
 * @fileoverview Test for duplicate code rule
 * @author Devgoks <olabamsg@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium");
let config = {
    "rules": {
        "duplicate-code": "warning"      
    }
};

describe("[RULE] duplicate-code: Rejections", function(){
    it("should reject some stuff", function(done) {
        let code = `contract Foo {
						uint stateV1 = 100;
                        uint stateV1 = 100;
					}
				`;
        let errors = Solium.lint(code, config);
        errors.should.have.size(2);      

        Solium.reset();
        done();
    });
});

describe("[RULE] duplicate-code: Acceptances", function(){
    it("should accept some stuff", function(done) {
        let code = `contract Foo {
						uint stateV1 = 100;
					}
				`;
        let errors = Solium.lint(code, config);
        errors.should.be.size(0);      
        Solium.reset();
        done();
    });
});
