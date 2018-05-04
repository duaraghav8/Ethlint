/**
 * @fileoverview Ensure that experimental features are not used in production
 * @author Ivan Mushketyk <ivan.mushketik@gmail.com>
 */

"use strict";

const Solium = require("../../../../lib/solium");

const userConfig = {
    "rules": {
        "no-experimental": "error"
    }
};

describe("[RULE] no-experimental: Acceptances", () => {

    it("should accept contracts without 'pragma experimental'", done => {
        const code = "pragma solidity ^0.4.0; contract Foo {} library Bar {}",
            errors = Solium.lint(code, userConfig);

        errors.should.be.Array();
        errors.should.be.empty();

        Solium.reset();
        done();
    });
});

describe("[RULE] no-experimental: Rejections", function() {

    it("should reject contracts with 'pragma experimental'", done => {
        let code = `
            pragma experimental "^0.5.0";
            contract Foo {}
        `;
        let errors = Solium.lint(code, userConfig);
        errors.should.be.Array();
        errors.should.have.size(1);

        code = `
            pragma solidity ^0.4.0;
            pragma experimental "^0.5.0";
            contract Foo {}
            contract Bar {}
        `;
        errors = Solium.lint(code, userConfig);
        errors.should.be.Array();
        errors.should.have.size(1);

        Solium.reset();
        done();
    });

});