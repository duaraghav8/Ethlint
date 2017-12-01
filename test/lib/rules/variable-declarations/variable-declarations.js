/**
 * @fileoverview Tests for variable-declarations rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers");
let toFunction = wrappers.toFunction, toContract = wrappers.toContract;

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "variable-declarations": true
    }
};

describe("[RULE] variable-declarations: Rejections", function() {

    it("should reject all variables having names \"l\", \"o\" or \"I\"", function(done) {
        let declarations = [
            "var l; var O; var I;",
            "uint l; uint O; uint I;",
            "string l; string O; string I;",
            "bytes32 l; bytes32 O; bytes32 I;",
            "mapping (uint => string) l; mapping (uint => string) O; mapping (uint => string) I;"
        ];
        let errors, code;

        code = declarations.map(function(item){return toFunction(item);});
		
        errors = Solium.lint(code [0], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        errors = Solium.lint(code [1], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        errors = Solium.lint(code [2], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        errors = Solium.lint(code [3], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        errors = Solium.lint(code [4], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);


        // var cannot be used to declare state variables, so truncate it from declarations array.
        code = declarations.slice(1).map(function(item){return toContract(item);});

        errors = Solium.lint(code [0], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        errors = Solium.lint(code [1], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        errors = Solium.lint(code [2], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        errors = Solium.lint(code [3], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        Solium.reset();
        done();
    });

    it("should reject variables whose names are provided via config instead of the default names", function(done) {
        let configWithCustomVarNames = {
            "rules": {
                "variable-declarations": ["error", ["myOwnVar", "myOwnVar2"]]
            }
        };

        let declarations = [
            "var l; var O; var I;",
            "uint l; uint O; uint I;",
            "string l; string O; string I;",
            "bytes32 l; bytes32 O; bytes32 I;",
            "mapping (uint => string) l; mapping (uint => string) O; mapping (uint => string) I;",

            "var myOwnVar; var myOwnVar2;",
            "uint myOwnVar; uint myOwnVar2;",
            "string myOwnVar; string myOwnVar2;",
            "bytes32 myOwnVar; bytes32 myOwnVar2;",
            "mapping (uint => string) myOwnVar; mapping (uint => string) myOwnVar2;"
        ];
        let errors, code;

        code = declarations.map(function(item){return toFunction(item);});
		
        errors = Solium.lint(code [0], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [1], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [2], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [3], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [4], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [5], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [6], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [7], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [8], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [9], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);


        // var cannot be used to declare state variables, so truncate it from declarations array.
        code = declarations.slice(1).map(function(item){return toContract(item);});

        errors = Solium.lint(code [0], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [1], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [2], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        errors = Solium.lint(code [3], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        // code [4] was purposely skipped since it is var and var can't be a state variable
        errors = Solium.lint(code [5], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [6], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [7], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [8], configWithCustomVarNames);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        Solium.reset();
        done();
    });

    it("should not accept invalid values for its option", function(done) {
        let configWithCustomVarNames = {
            "rules": {
                "variable-declarations": ["error", null]
            }
        };
        let code = toFunction(""),
            exceptionMessage = "Invalid options were passed to rule \"variable-declarations\".";

        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = {};
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = 0;
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = "";
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = "hello world";
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = ["d", 10];
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = [{}];
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = [null];
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = 190.2897;
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = [-1982];
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        configWithCustomVarNames.rules ["variable-declarations"] [1] = -1982;
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        // Empty array is a invalid option. If you need to allow all names, simply disable the rule.
        configWithCustomVarNames.rules ["variable-declarations"] [1] = [];
        Solium.lint.bind(Solium, code, configWithCustomVarNames).should.throw(exceptionMessage);

        Solium.reset();
        done();
    });

});
