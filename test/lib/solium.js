/**
 * @fileoverview Tests for lib/solium.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Solium = require("../../lib/solium"),
    wrappers = require("../utils/wrappers"),
    EventEmitter = require("events").EventEmitter;

/* eslint-disable no-unused-vars */

describe("Checking Exported Solium API", function() {

    let meta = {
        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that all strings use only 1 style - either double quotes or single quotes."
        },
        schema: []
    };

    it("should be an instance of EventEmitter & expose a set of functions", function(done) {
        Solium.should.be.type("object");
        Solium.should.be.instanceof(EventEmitter);
        Solium.should.have.size(11);
		
        Solium.should.have.ownProperty("reset");
        Solium.reset.should.be.type("function");
        Solium.should.have.ownProperty("lint");
        Solium.lint.should.be.type("function");
        Solium.should.have.ownProperty("lintAndFix");
        Solium.lintAndFix.should.be.type("function");
        Solium.should.have.ownProperty("report");
        Solium.report.should.be.type("function");
        Solium.should.have.ownProperty("reportInternal");
        Solium.reportInternal.should.be.type("function");
        Solium.should.have.ownProperty("getSourceCode");
        Solium.getSourceCode.should.be.type("function");
        Solium.should.have.ownProperty("getDefaultConfig");
        Solium.getDefaultConfig.should.be.type("function");

        Solium.should.have.ownProperty("version");
        Solium.version.should.be.type("string");

        done();
    });

    it("should provide default dotfiles", done => {
        const defaultConfigs = Solium.getDefaultConfig();

        defaultConfigs.should.have.size(2);
        defaultConfigs.should.have.ownProperty(".soliumrc.json");
        defaultConfigs.should.have.ownProperty(".soliumignore");
        defaultConfigs[".soliumrc.json"].should.be.type("object");
        defaultConfigs[".soliumignore"].should.be.type("string");

        done();
    });

    it("should throw in case of syntax error in code passed to lint()", done => {
        // syntax error is "fuction" instead of "function"
        const code = "contract Foo {\n\n\tfuction foobar() {\n\t\tbax();\n\t}\n\n}",
            config = { "plugins": ["security"] };

        Solium.lint.bind(Solium, code, config).should.throw();

        try {
            Solium.lint(code, config);
        } catch (e) {
            e.message.should.equal(
                "An error occured while parsing the source code:" +
                " Expected \";\", \"=\", comment, end of line, or whitespace but \"(\" found. Line: 3, Column: 16"
            );
            e.name.should.equal("SyntaxError");
            e.location.start.line.should.equal(3);
            e.location.start.column.should.equal(16);
        }

        Solium.reset();
        done();
    });

    it("should throw when reportInternal() is passed invalid issue object", done => {
        const invalidData = [undefined, , null, 1902, "hello world", [1, 2, 3], true, false, 9.28937];

        invalidData.forEach(data => {
            Solium.reportInternal.bind(Solium, data).should.throw();
        });

        done();
    });

    it("should return a SourceCode instance upon calling Solium.getSourceCode ()", function(done) {
        let sourceCode = Solium.getSourceCode();

        sourceCode.should.be.type("object");
        sourceCode.constructor.name.should.equal("SourceCode");

        sourceCode.should.have.ownProperty("text");
        sourceCode.text.should.be.empty();

        sourceCode.should.have.property("getLine");
        sourceCode.getLine.should.be.type("function");

        sourceCode.should.have.property("getColumn");
        sourceCode.getColumn.should.be.type("function");

        sourceCode.should.have.property("getEndingColumn");
        sourceCode.getColumn.should.be.type("function");
		
        sourceCode.should.have.property("getParent");
        sourceCode.getParent.should.be.type("function");

        sourceCode.should.have.property("getEndingLine");
        sourceCode.getParent.should.be.type("function");
		
        sourceCode.should.have.property("isASTNode");
        sourceCode.getParent.should.be.type("function");

        sourceCode.should.have.property("getText");
        sourceCode.getText.should.be.type("function");

        sourceCode.should.have.property("getTextOnLine");
        sourceCode.getText.should.be.type("function");
		
        sourceCode.should.have.property("getStringBetweenNodes");
        sourceCode.getText.should.be.type("function");

        sourceCode.should.have.property("getNextChar");
        sourceCode.getNextChar.should.be.type("function");
		
        sourceCode.should.have.property("getPrevChar");
        sourceCode.getPrevChar.should.be.type("function");
		
        sourceCode.should.have.property("getNextChars");
        sourceCode.getNextChars.should.be.type("function");
		
        sourceCode.should.have.property("getPrevChars");
        sourceCode.getPrevChars.should.be.type("function");

        sourceCode.should.have.property("getComments");
        sourceCode.getComments.should.be.type("function");

        done();
    });

    it("should be completely reset after call to Solium.reset()", function(done) {
        Solium.reset();

        let minmalConfig = { rules: {} };
        let sourceCode = Solium.getSourceCode();
        let errorMessages = Solium.lint(wrappers.toFunction("var foo = 100; /* helo */"), minmalConfig, true);

        sourceCode.text.should.equal("");
        (sourceCode.getText()).should.equal(sourceCode.text);

        errorMessages.should.be.instanceof(Array);
        errorMessages.length.should.equal(0);

        // comments array should be empty
        sourceCode.getComments().should.be.empty();

        //all event listeners should've been removed
        Object.keys(Solium._events).length.should.equal(0);

        done();
    });

    it("should handle invalid arguments when calling Solium.report()", function(done) {
        Solium.report.bind(Solium, null).should.throw();
        Solium.report.bind(Solium).should.throw();

        Solium.report.bind(Solium, { node: null }).should.throw();
        Solium.report.bind(Solium, { node: undefined }).should.throw();
        Solium.report.bind(Solium, { node: 100 }).should.throw();
        Solium.report.bind(Solium, { node: {} }).should.throw();
        Solium.report.bind(Solium, { node: { type: 100 } }).should.throw();

        let n = { type: "Type", start: 0, end: 89 };

        Solium.report.bind(Solium, { node: n }).should.throw();
        Solium.report.bind(Solium, { node: n, message: "" }).should.throw();
        Solium.report.bind(Solium, { node: n, message: null }).should.throw();
        Solium.report.bind(Solium, { node: n, message: 100 }).should.throw();

        Solium.report.bind(Solium, { node: n, message: "helo", ruleMeta: {} }).should.throw();
        Solium.report.bind(Solium, { node: n, message: "helo", ruleMeta: null }).should.throw();
        Solium.report.bind(Solium, {
            node: n, message: "helo", ruleMeta: [], ruleName: "hola", type: "warning"
        }).should.throw();
        Solium.report.bind(Solium, {
            node: n, message: "helo", ruleMeta: meta, type: "blahblah", ruleName: "hola"
        }).should.throw();
        Solium.report.bind(Solium, {
            node: n, message: "helo", ruleMeta: meta, type: 1892, ruleName: "hola"
        }).should.throw();

        Solium.report.bind(Solium, {
            node: n, message: "helo", ruleMeta: meta, type: "error", ruleName: ""
        }).should.throw();
        Solium.report.bind(Solium, {
            node: n, message: "helo", ruleMeta: meta, type: "error", ruleName: {}
        }).should.throw();

        //should not throw error with minimal valid object
        Solium.report.bind(Solium, {
            node: n,
            message: "H",
            ruleMeta: meta,
            type: "error",
            ruleName: "lola"
        }).should.not.throw();

        Solium.reset();
        done();
    });

    it("should push a sample error object in messages upon calling Solium.report()", function(done) {
        let sampleErrorObject = {
            ruleName: "sample",
            type: "error",
            node: {
                type: "Type",
                start: 0,
                end: 3
            },
            location: {	line: 1, column: 2 },
            message: "boo!",
            ruleMeta: meta
        };
        let minmalConfig = { rules: {} };

        Solium.report(sampleErrorObject);

        let errorObjects = Solium.lint(wrappers.toFunction("var foo = 100;"), minmalConfig, true),
            err = errorObjects [0];

        errorObjects.length.should.equal(1);
        err.ruleName.should.equal("sample");
        err.type.should.equal("error");
        err.node.type.should.equal("Type");
        err.node.start.should.equal(0);
        err.node.end.should.equal(3);
        err.line.should.equal(1);
        err.column.should.equal(2);
        err.message.should.equal("boo!");

        Solium.reset();	//clear everything

        done();
    });

    it("should accept valid plugin rules", function(done) {
        let config = {
            "plugins": ["test"],
            "rules": {
                "test/foo": 1,
                "test/bar": 2
            }
        };

        let minimalSourceCode = wrappers.toFunction("var foo = 100;");
        let errors = Solium.lint(minimalSourceCode, config);	// should not throw
        errors.should.be.Array();
        errors.should.be.size(0);


        Solium.reset();
        done();
    });

    it("should handle all invalid arguments for Solium.lint ()", function(done) {
        let minimalConfig = { rules: {} },
            minimalSourceCode = wrappers.toFunction("var foo = 100;");

        //sourceCode text validation
        Solium.lint.bind(Solium, "", minimalConfig).should.throw();
        Solium.lint.bind(Solium, null, minimalConfig).should.throw();
        Solium.lint.bind(Solium, 100, minimalConfig).should.throw();
        Solium.lint.bind(Solium, {}, minimalConfig).should.throw();
        Solium.lint.bind(Solium, undefined, minimalConfig).should.throw();
        Solium.lint.bind(Solium, 10.8927, minimalConfig).should.throw();
        Solium.lint.bind(Solium, [], minimalConfig).should.throw();

        //config object validation
        Solium.lint.bind(Solium, minimalSourceCode).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, {}).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { rules: null }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { rules: "foo" }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, []).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, null).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, 19082).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, "hoellla").should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, 0).should.throw();

        // config (v1.0.0) object validation
        // These tests just ensure that Solium internally calls configInspector.isValid() on config.
        // Extensive testing of validation is done on isValid() (see test for config-inspector).
        Solium.lint.bind(Solium, minimalSourceCode, { extends: "" }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { extends: 908 }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { extends: {} }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { extends: [] }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { extends: "hello", rules: { a: true } }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { extends: null }).should.throw();

        Solium.lint.bind(Solium, minimalSourceCode, { rules: { a: [] } }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { rules: { a: "koala bear" } }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { rules: { a: 9018 } }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { rules: { a: -1 } }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { rules: { a: null } }).should.throw();
        Solium.lint.bind(Solium, minimalSourceCode, { plugins: ["1*&&67%``"], rules: {} }).should.throw();

        // Minimal valid arguments
        Solium.lint.bind(Solium, minimalSourceCode, minimalConfig).should.not.throw();
        Solium.reset();

        done();
    });

    it("should return deprecation warnings when using old config format, \"custom-rules-filename\" is non-null & returnInternalIssues = true", function(done) {
        let config = {
            "custom-rules-filename": "./test/extras/custom-rules-file",
            rules: {
                indentation: true,
                lbrace: true
            },
            options: {
                returnInternalIssues: true
            }
        };

        let errors = Solium.lint("contract Foo {}", config);

        errors.should.be.array;
        errors.length.should.equal(2);

        errors.forEach(function(err) {
            err.should.be.type("object");
            err.should.have.ownProperty("internal");
            err.internal.should.equal(true);
            err.should.have.ownProperty("line");
            err.line.should.equal(-1);
            err.should.have.ownProperty("column");
            err.column.should.equal(-1);
            err.should.have.ownProperty("message");

            err.message.should.be.type("string");
        });

        Solium.reset();
        done();
    });

    it("should not alter the configuration passed by user in any way", function(done) {
        let userConfig = {
            "custom-rules-filename": null,
            rules: {
                "mixedcase": true,
                "camelcase": false
            }
        };
        let minimalSourceCode = wrappers.toFunction("var foo = 100;");

        Solium.lint(minimalSourceCode, userConfig);

        userConfig.should.be.type("object");
        userConfig.should.have.ownProperty("custom-rules-filename");
        (userConfig ["custom-rules-filename"] === null).should.equal(true);
        userConfig.should.have.ownProperty("rules");
        userConfig.rules.should.be.type("object");
        userConfig.rules.should.have.ownProperty("mixedcase");
        userConfig.rules.mixedcase.should.equal(true);
        userConfig.rules.should.have.ownProperty("camelcase");
        userConfig.rules.camelcase.should.equal(false);
        Object.keys(userConfig).length.should.equal(2);

        Solium.reset();

        done();
    });

    it("should function as expected when valid arguments are provided", function(done) {
        let minimalConfig = { rules: {} },
            minimalSourceCode = wrappers.toFunction("var foo = 100;");
        let emissionCounter = 5;

        function testComplete() {
            Solium.reset();
            done();
        }

        Solium.on("Program", function() {
            --emissionCounter;
            !emissionCounter && testComplete();
        });

        Solium.on("VariableDeclaration", function() {
            --emissionCounter;
            !emissionCounter && testComplete();
        });

        Solium.on("VariableDeclarator", function(emitted) {
            emitted.exit.should.be.type("boolean");
            emitted.node.should.be.type("object");
            emitted.node.should.have.ownProperty("parent");
            emitted.node.parent.should.be.type("object");
            emitted.node.parent.should.have.ownProperty("type");
            emitted.node.id.name.should.equal("foo");

            --emissionCounter;
            !emissionCounter && testComplete();
        });

        Solium.on("Identifier", function() {
            --emissionCounter;
            !emissionCounter && testComplete();
        });

        Solium.on("Literal", function() {
            --emissionCounter;
            !emissionCounter && testComplete();
        });

        //without any rules applied
        let errorObjects = Solium.lint(minimalSourceCode, minimalConfig, true);
        errorObjects.length.should.equal(0);
    });

    it("should function as expected even if a Buffer object is provided instead of String", function(done) {
        let minimalConfig = { rules: {} },
            minimalSourceCode = new Buffer(wrappers.toFunction("var foo = 100;"));
        let emissionCounter = 5;

        function testComplete() {
            Solium.reset();
            done();
        }

        Solium.on("Program", function() {
            --emissionCounter;
            !emissionCounter && testComplete();
        });

        Solium.on("VariableDeclaration", function() {
            --emissionCounter;
            !emissionCounter && testComplete();
        });

        Solium.on("VariableDeclarator", function(emitted) {
            emitted.exit.should.be.type("boolean");
            emitted.node.should.be.type("object");
            emitted.node.should.have.ownProperty("parent");
            emitted.node.parent.should.be.type("object");
            emitted.node.parent.should.have.ownProperty("type");
            emitted.node.id.name.should.equal("foo");

            --emissionCounter;
            !emissionCounter && testComplete();
        });

        Solium.on("Identifier", function() {
            --emissionCounter;
            !emissionCounter && testComplete();
        });

        Solium.on("Literal", function() {
            --emissionCounter;
            !emissionCounter && testComplete();
        });

        //without any rules applied
        let errorObjects = Solium.lint(minimalSourceCode, minimalConfig, true);
        errorObjects.length.should.equal(0);
    });

    it("should accept both deprecated and current config formats without any issue", function(done) {
        let deprecated = {
            "custom-rules-filename": null,
            rules: {
                "pragma-on-top": true,
                "lbrace": false,
                "mixedcase": true
            }
        };

        let current1 = {
            "extends": "solium:all",
            "plugins": [],
            "rules": {
                "pragma-on-top": "off",
                "no-with": "warning",
                "deprecated-suicide": "error",
                "variable-declarations": 0,
                "imports-on-top": 1,
                "array-declarations": 2,
                "operator-whitespace": ["off"],
                "lbrace": ["warning"],
                "mixedcase": ["error"],
                "camelcase": [0],
                "uppercase": [1],
                "double-quotes": [2]
            },
            "options": { "autofix": false }
        };

        let current2 = {
            "extends": "solium:all"
        };

        let current3 = {
            "rules": {
                "deprecated-suicide": "error",
                "variable-declarations": 0,
                "imports-on-top": 1
            }
        };

        let current4 = {
            "extends": "solium:all",
            "plugins": ["test"]
        };

        let current5 = {
            "plugins": ["test"],
            "rules": {
                "test/foo": "warning",
                "test/bar": [2]
            }
        };

        // Temporary. This config should actually not be accepted since we're using a plugin without declaring it.
        // In future, the declaration inside "plugins" will ensure that the plugin is installed (and if not, it will
        // be installed automatically).
        let current6 = {
            "rules": {
                "test/foo": "error"
            }
        };

        let minimalSourceCode = wrappers.toFunction("var foo = 100;");

        Solium.lint.bind(Solium, minimalSourceCode, deprecated).should.not.throw();
        Solium.lint.bind(Solium, minimalSourceCode, current1).should.not.throw();
        Solium.lint.bind(Solium, minimalSourceCode, current2).should.not.throw();
        Solium.lint.bind(Solium, minimalSourceCode, current3).should.not.throw();
        Solium.lint.bind(Solium, minimalSourceCode, current4).should.not.throw();
        Solium.lint.bind(Solium, minimalSourceCode, current5).should.not.throw();
        Solium.lint.bind(Solium, minimalSourceCode, current6).should.not.throw();

        Solium.reset();
        done();
    });

    // Testing entire fix mechanism
    it("should handle all valid inputs supplied to lintAndFix()", function(done) {
        // Since lintAndFix() internally first goes through lint(), we need not test the things
        // already tested in lint().
        let fixResults = [], code = "contract Foo {}";

        let config = {
            "plugins": ["test"],
            "rules": {
                "lbrace": "warning",
                "test/foo": "error"
            }
        };

        fixResults.push(Solium.lintAndFix(code, config));
        fixResults.push(Solium.lintAndFix(Buffer(code), config));

        fixResults.forEach(function(f) {
            f.should.be.type("object");
            f.should.have.ownProperty("originalSourceCode");
            f.originalSourceCode.should.equal(code);
            f.should.have.ownProperty("fixedSourceCode");
            f.fixedSourceCode.should.equal(code);
            f.should.have.ownProperty("fixesApplied");
            f.fixesApplied.should.be.Array();
            f.fixesApplied.length.should.equal(0);
            f.should.have.ownProperty("errorMessages");
            f.errorMessages.should.be.Array();
            f.errorMessages.length.should.equal(0);
        });

        // Should return fixed code now
        code = "contract Foo {string name = \"Dua\";}";
        config.rules = {
            quotes: ["error", "single"]
        };

        fixResults = Solium.lintAndFix(code, config);
        let fixedCode = code.replace(/"/g, "'");

        fixResults.should.be.type("object");
        fixResults.should.have.ownProperty("originalSourceCode");
        fixResults.originalSourceCode.should.equal(code);
        fixResults.should.have.ownProperty("fixedSourceCode");
        fixResults.fixedSourceCode.should.equal(fixedCode);

        fixResults.should.have.ownProperty("errorMessages");
        fixResults.errorMessages.should.be.empty();

        fixResults.should.have.ownProperty("fixesApplied");
        fixResults.fixesApplied.should.be.Array();
        fixResults.fixesApplied.length.should.equal(1);
        fixResults.fixesApplied [0].should.be.type("object");
        fixResults.fixesApplied [0].should.have.ownProperty("fix");
        fixResults.fixesApplied [0].fix.should.be.type("object");
        fixResults.fixesApplied [0].fix.should.have.ownProperty("range");
        fixResults.fixesApplied [0].fix.should.have.ownProperty("text");
        fixResults.fixesApplied [0].fix.text.should.equal("'Dua'");
        fixResults.fixesApplied [0].fix.range.should.be.Array();
        fixResults.fixesApplied [0].fix.range.length.should.equal(2);
        fixResults.fixesApplied [0].fix.range [0].should.equal(28);
        fixResults.fixesApplied [0].fix.range [1].should.equal(33);

        Solium.reset();
        done();
    });

    it("should handle fix-related issues that arise in Solium.report()", function(done) {
        let error = {
            ruleName: "sample",
            type: "warning",
            message: "sample message",
            location: {
                line: 10,
                column: 17
            },
            ruleMeta: meta,	// Doesn't contain "fixable" property initially
            fix: function(fixer) {
                return { text: "", range: [0, 0] };
            },
            node: {
                type: "Literal",
                start: 1,
                end: 10
            }
        };

        // After reporting an error containing "fix" but no "ruleMeta.fixable" property,
        // Solium should also report an internal error that the fix was ignored.
        Solium.report(error);

        let errors = Solium.lint("contract Foo {}", {
            rules: {}, options: { returnInternalIssues: true }
        }, true);

        errors.should.be.Array();
        errors.length.should.equal(2);

        // First item should be the internal error
        errors [0].should.be.type("object");
        errors [0].should.have.ownProperty("type");
        errors [0].should.have.ownProperty("internal");
        errors [0].type.should.equal("warning");
        errors [0].internal.should.equal(true);

        // Second item should be the error actually report()ed
        errors [1].should.be.type("object");
        ["ruleName", "type", "message"].forEach(function(key) {
            errors [1] [key].should.equal(error [key]);
        });

        error.ruleMeta.fixable = "space";	// valid values for "fixable" are 'whitespace' or 'code'
        Solium.report.bind(Solium, error).should.throw();

        error.ruleMeta.fixable = "whitespace";
        error.fix = 10902.897;	// invalid value for "fix"
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return []; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) {};
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return 1908.287; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return {}; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return "hello world"; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return true; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return false; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return function(){}; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return [[]]; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return [{}]; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return [907]; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return ["humpty dumpty"]; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return { text: "" }; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return { text: 19082, range: [0, 0] }; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return { text: "", range: [-1, 0] }; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return { text: "", range: null }; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return { text: "", range: "foobar" }; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return { text: "", range: [27, 25.7] }; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return { text: "", range: [27] }; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return { text: "", range: [27, 29, 33] }; };
        Solium.report.bind(Solium, error).should.throw();

        error.fix = function(f) { return { text: "", range: [27, 29], randomAttribute: true }; };
        Solium.report.bind(Solium, error).should.throw();


        // When a rule's fix() doesn't want to apply any fixes (maybe under some conditions),
        // it can return null. This should not throw and simply delete the fix (treat it like it didn't exist).
        error.fix = function(f) { return null; };
        Solium.report.bind(Solium, error).should.not.throw();


        error.fix = function(f) {
            return [{ text: "", range: [0, 10] }, { text: "aighjbhsjga", range: [900, 6754] }];
        };
        Solium.report.bind(Solium, error).should.not.throw();

        error.fix = function(f) {
            return { text: "    ", range: [90, 100] };
        };
        Solium.report.bind(Solium, error).should.not.throw();

        Solium.reset();
        done();
    });

    it("should work well with the pre-installed security plugin", function(done) {
        let config = {
            "plugins": ["security"]
        };
        let code = "contract Foo { function bar() { address usr = tx.origin; } }";

        let errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(2);

        errors.forEach(function(err) {
            err.should.be.type("object");
            err.should.have.ownProperty("ruleName");
            err.ruleName.startsWith("security/").should.equal(true);
        });


        config = {
            "rules": {
                "security/no-tx-origin": "error"
            }
        };

        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(1);

        errors [0].ruleName.should.equal("security/no-tx-origin");
        errors [0].type.should.equal("error");


        config = {
            "plugins": ["security"],
            "rules": {
                "security/enforce-explicit-visibility": 0
            }
        };

        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(1);
        errors [0].ruleName.should.equal("security/no-tx-origin");

        done();
    });

    it("should work well with the solium:recommended ruleset", done => {
        Solium.lint.bind(
            Solium,
            "contract Foo {}",
            { "extends": "solium:recommended" }
        ).should.not.throw();

        Solium.reset();
        done();
    });

});

/* eslint-enable no-unused-vars */

describe("Solium.lint() comment directives", () => {


    /**
     * Tests for disabling directives should cover the following patterns:
     * - Line comments & Block Comments
     * - Only directive & Directive + list of rules (single, multiple) both core and security plugin's
     * - Directives at different positions of the program
     * - Having/Not having extraneous whitespace (including \n in block comments)
     * - Comments that seem like dirs but aren't due to minor changes (like char addition, etc)
     * - Non-Directive comments (should have no impact on linting therefore)
     */

    it("should ignore any comments which are not meant for linter configuration", done => {
        const code = `




            // Hello world
            /**
             * this is my sample contract
             */
            contract foobar {
                /**/ /********/
                function() payable {
                    /* nothing here
                        seriously. nothing*/
                    call(10, /****some stupid comment***/"hello world");
                    /* soliummmm-disable-next-line */
                    var x = 100;
                }

                // olium-disable
                function baz(uint x, address abc) returns (uint, string) {
                    // majola
                    var addr = tx.origin;
                }
            }/* something*/


            // Another comment



        `;
        const config = {
            "extends": "solium:all",
            "rules": {
                "no-trailing-whitespace": "off"
            }
        };

        const errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(10); // This no. can change if changes are made in any rules from solium:all ruleset

        Solium.reset();
        done();
    });

    it("should respect solium-disable", done => {
        const config = {
            "extends": "solium:all",
            "rules": {
                "no-trailing-whitespace": "off"
            }
        };

        let code = `//    \t   solium-disable
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }
        `;
        let errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(0); // Number should remain 0 regardless of what rules are manipulated


        code = `

            //solium-disable
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(0);


        code = `

            //solium-disable
            //solium-disable indentation
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(0); // the 2nd comment dir. should have no effect


        code = `

            //solium-disable indentation
            //solium-disable
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(0);


        code = `

            // solium-disable indentation
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(7); // May change if rules other than indentation are changed


        code = `

            // solium-disable indentation
            contract blah{}
            contract f {
                // solium-disable indentation
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(7);


        config.plugins = ["security"];  // enable security plugin
        code = `

            //solium-disable security/enforce-explicit-visibility
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(14); // May change if rules other than sec/e-e-v are changed


        code = `

            //solium-disable security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            //solium-disable security/enforce-explicit-visibility,security/no-throw,foo/bar
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            //solium-disable     security/no-throw,  \t   \tlbrace
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(12);


        // Should disable sec/no-throw & lbrace rules after line 4 all the way down (turtles!)
        code = `

            contract blah{}
            contract f {
                //solium-disable     security/no-throw,  \t   \tlbrace
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        // Should disable all rules starting line 4 (after line 3)
        code = `

            contract blah{}
            //\t  \t\tsolium-disable
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(5);

        delete config.plugins; // disable security plugin


        code = `
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }
            // \tsolium-disable
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13); // should lint without disruption, disable directive has no effect here


        // Block comments
        code = `/*    \t   solium-disable     */
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(0); // Number should remain 0 regardless of what rules are manipulated


        code = `

            /*solium-disable*/
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(0);


        code = `

            /* solium-disable indentation */
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(7); // May change if rules other than indentation are changed


        config.plugins = ["security"];  // enable security plugin
        code = `

            /*solium-disable security/enforce-explicit-visibility*/
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(14); // May change if rules other than sec/e-e-v are changed


        code = `

            /*solium-disable security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar\t */
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            /*solium-disable security/enforce-explicit-visibility,security/no-throw,foo/bar\t */
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            /*solium-disable     security/no-throw,  \t   \tlbrace           */
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(12);


        // Should disable sec/no-throw & lbrace rules after line 4 all the way down (turtles!)
        code = `

            contract blah{}
            contract f {
                /* solium-disable     security/no-throw,  \t   \tlbrace    */
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        // Should disable all rules starting line 4 (after line 3)
        code = `

            contract blah{}
            /*\t  \t\tsolium-disable*/
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(5);

        delete config.plugins; // disable security plugin


        code = `
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }
            /* \tsolium-disable \t*/
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13); // should lint without disruption, disable directive has no effect here


        // solium-disable tag disables rules from NEXT line, not from current line
        code = "//hello world\n\n/* solium-disable  */ contract foo {\nfunction(){}\n}";
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(3);

        code = "//hello world\n\n/* solium-disable  */ contract foo { function(){} }";
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(5);


        code = `
            contract Foo {}
            /*\t\t\tsolium-disable \n\n       \n  */
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(3);


        config.plugins = ["security"];
        code = `
            contract Foo {}
            /*\t\t\tsolium-disable\nsecurity/no-throw\n,lbrace,\nindentation  */
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(6); // can change if rules other than specified above are changed
        delete config.plugins;


        Solium.reset();
        done();
    });

    it("should respect solium-disable-line", done => {
        const config = {
            "extends": "solium:all",
            "rules": {
                "no-trailing-whitespace": "off"
            }
        };

        let code = `
            contract blah{}//    \t   solium-disable-line
            contract f {
            }
        `;
        let errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(5);


        code = `

            contract blah{} //solium-disable-line
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(8);


        code = `

            
            contract blah{}     \t// \t\tsolium-disable-line indentation, lbrace
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(11);


        config.plugins = ["security"];  // enable security plugin
        code = `

            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }\t\t//solium-disable-line security/no-throw
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(14);


        code = `

            contract blah{}
            contract f {
                function(uint x, //solium-disable-line security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }//solium-disable-line security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            contract f {
                function(uint x,//solium-disable-line security/enforce-explicit-visibility,security/no-throw,foo/bar
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }\t\t//solium-disable-line security/enforce-explicit-visibility,security/no-throw,foo/bar
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; } // solium-disable-line     security/no-throw,  \t   \tlbrace
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            contract f { //\t  \t\tsolium-disable-line
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(12);

        delete config.plugins; // disable security plugin


        code = `
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }
            // \tsolium-disable-line
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        // Block comments
        code = `
            contract blah{}/*    \t   solium-disable-line*/
            contract f {
            }
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(5);


        code = `

            contract blah{} /*solium-disable-line*/
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(8);


        code = `

            
            contract blah{}     \t/* \t\tsolium-disable-line indentation, lbrace*/
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(11);


        config.plugins = ["security"];  // enable security plugin
        code = `

            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }\t\t/*solium-disable-line security/no-throw*/
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(14);


        code = `

            contract blah{}
            contract f {
                function(uint x, /*solium-disable-line security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar*/
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }/*solium-disable-line security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar*/
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            contract f {
                function(uint x,/*solium-disable-line security/enforce-explicit-visibility,security/no-throw,foo/bar \t   */
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }\t\t/*solium-disable-line security/enforce-explicit-visibility,security/no-throw,foo/bar      */
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(14);


        code = `

            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; } /* solium-disable-line     security/no-throw,  \t   \tlbrace\t\t*/
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            contract f { /*\t  \t\tsolium-disable-line  */
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(12);

        delete config.plugins; // disable security plugin


        code = `
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }
            /* \tsolium-disable-line\t  */
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `
            contract Foo {}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}     /*\n\t\tsolium-disable-line \t\t       \t  */
            }
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(9);


        config.plugins = ["security"];
        code = `
            contract Foo {}
            contract f {
                function(){throw;}/*\t\n\tsolium-disable-line\nsecurity/no-throw\n,lbrace,\nindentation  */
            }
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(8);
        delete config.plugins;
        

        Solium.reset();
        done();
    });

    it("should respect solium-disable-next-line", done => {
        const config = {
            "extends": "solium:all",
            "rules": {
                "no-trailing-whitespace": "off"
            }
        };

        let code = `
            contract blah{}//    \t   solium-disable-next-line
            contract f {
            }
        `;
        let errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(6);


        code = `

            contract blah{} //solium-disable-next-line
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(10);


        code = `

            
            contract blah{}
            \t// \t\tsolium-disable-next-line indentation, lbrace
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(12);


        config.plugins = ["security"];  // enable security plugin
        code = `

            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    //solium-disable-next-line security/no-throw
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(14);


        code = `

            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    //solium-disable-next-line security/no-throw

                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(15); // next line is blank, so no effect of disable-next-line


        code = `

            contract blah{}
            contract f {
                //solium-disable-next-line security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar
                function(uint x,
                    string y)
                    payable
                    owned
                    //solium-disable-next-line security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            contract f {
                //solium-disable-next-line security/enforce-explicit-visibility,security/no-throw,foo/bar
                function(uint x,
                    string y)
                    payable
                    owned
                    \t\t//solium-disable-next-line security/enforce-explicit-visibility,security/no-throw,foo/bar
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                      // solium-disable-next-line     security/no-throw,  \t   \tlbrace
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            \t\t//\t  \t\tsolium-disable-next-line
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(12);

        delete config.plugins; // disable security plugin


        code = `
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }
            // \tsolium-disable-next-line`;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        // Block comments
        code = `
        /*    \t   solium-disable-next-line*/
            contract blah{}
            contract f {
            }
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(5);


        code = `

            /*solium-disable-next-line*/
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(8);


        code = `

                 \t/* \t\tsolium-disable-next-line indentation, lbrace*/
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(11);


        config.plugins = ["security"];  // enable security plugin
        code = `

            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    \t\t/*solium-disable-next-line security/no-throw*/
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(14);


        code = `

            contract blah{}
            contract f {
                /*solium-disable-next-line security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar*/
                function(uint x,
                    string y)
                    payable
                    owned
                    /*solium-disable-next-line security/enforce-explicit-visibility, security/no-throw,\t\tfoo/bar*/
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            contract f {
                /*solium-disable-next-line security/enforce-explicit-visibility,security/no-throw,foo/bar \t   */
                function(uint x,
                    string y)
                    payable
                    owned
                    \t\t/*solium-disable-next-line security/enforce-explicit-visibility,security/no-throw,foo/bar      */
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                     /* solium-disable-next-line     security/no-throw,  \t   \tlbrace\t\t*/
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `

            contract blah{}
             /*\t  \t\tsolium-disable-next-line  */
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      { throw; }
            }


        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(12);

        delete config.plugins; // disable security plugin


        code = `
            contract blah{}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                    returns (uint, uint)      {}
            }
            /* \tsolium-disable-next-line\t  */`;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(13);


        code = `
            contract Foo {}
            contract f {
                function(uint x,
                    string y)
                    payable
                    owned
                         /*\t\t\tsolium-disable-next-line \t\t       \t  */
                    returns (uint, uint)      {}
            }
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(9);


        config.plugins = ["security"];
        code = `
            contract Foo {}
            contract f {
                /*\t\n\tsolium-disable-next-line\nsecurity/no-throw\n,lbrace,\nindentation  */
                function(){throw;}
            }
        `;
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(8);
        delete config.plugins;


        code = "/* solium-disable-next-line no-empty-blocks */ /* solium-disable-next-line camelcase */"
            + "\ncontract foo {}";
        errors = Solium.lint(code, config);

        errors.should.be.Array();
        errors.should.have.size(1);

        Solium.reset();
        done();
    });

    it("should respect solium-disable-previous-line", done => {
        let config = {
            "rules": {
                "no-empty-blocks": "error"
            }
        };
        let code = `
        if (true) {
            // solium-disable-previous-line no-empty-blocks
        }
        `;
        let errors = Solium.lint(wrappers.toFunction(code), config);
        errors.should.be.empty();

        config.rules = {
            "indentation": ["error", "tab"],
            "security/no-throw": "error"
        };
        code = `
                throw;
                //solium-disable-previous-line
        `;
        errors = Solium.lint(wrappers.toFunction(code), config);
        errors.should.be.empty();

        done();
    });

    it("should respect solium-enable comment directive", done => {
        const config = {
            "rules": {
                "no-empty-blocks": "error",
                "security/no-throw": "error",
                "mixedcase": "error"
            }
        };

        const snippets = [
            {
                code: `
                // solium-disable
                function BAFF() {
                    if (true) {}
                    throw;
                }
                // solium-enable
                function BAFF() {
                    if (true) {}
                    throw;
                }
                `,
                expectedIssues: 3
            },
            {
                code: `
                // solium-disable mixedcase, security/no-throw
                function BAFF() {
                    if (true) {}
                    throw;
                }
                // solium-enable mixedcase, security/no-throw
                function BAFF() {
                    if (true) {}
                    throw;
                }
                `,
                expectedIssues: 4
            },
            {
                code: `
                // solium-disable no-empty-blocks, security/no-throw
                function BAFF() {
                    if (true) {}
                    throw;
                }
                // solium-enable security/no-throw
                function BAFF() {
                    if (true) {}
                    throw;
                }
                `,
                expectedIssues: 3
            },
            {
                code: `
                // solium-disable no-empty-blocks
                function BAFF() {
                    if (true) {}
                    throw;
                }
                // solium-enable security/no-throw, no-empty-blocks, quotes
                function BAFF() {
                    if (true) {}
                    throw;
                }
                `,
                expectedIssues: 5
            },
            {
                code: `
                // solium-disable no-empty-blocks, mixedcase, security/no-throw
                function BAFF() {
                    if (true) {}
                    throw;
                }
                // solium-enable
                function BAFF() {
                    if (true) {}
                    throw;
                }
                `,
                expectedIssues: 3
            },

            // This is the edge case not yet handled.
            // Its expectedIssues value should be changed from 0 to 3 once it is handled.
            {
                code: `
                // solium-disable
                function BAFF() {
                    if (true) {}
                    throw;
                }
                // solium-enable no-empty-blocks, mixedcase, security/no-throw
                function BAFF() {
                    if (true) {}
                    throw;
                }
                `,
                expectedIssues: 0
            }
        ];

        snippets.forEach(({ code, expectedIssues }) => {
            let errors = Solium.lint(wrappers.toContract(code), config);
            errors.should.have.size(expectedIssues);
        });

        done();
    });

});
