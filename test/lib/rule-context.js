/**
 * @fileoverview Tests for lib/rule-context.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let RuleContext = require("../../lib/rule-context"),
    Solium = require("../../lib/solium"),
    _ = require("lodash");

/* eslint-disable no-unused-vars */

describe("Testing RuleContext object", function() {
    let ruleDesc = {
        enabled: true,
        recommended: true,
        type: "warning",
        description: "boo!",
        id: 1,
        custom: false,
        options: ["double", 2, { modifies: true }]
    };

    let meta = {
        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that all strings use only 1 style - either double quotes or single quotes."
        },
        schema: []
    };

    let sourceCode = "contract Visual {\n\tfunction foobar () {}\n}";

    it("should create a RuleContext instance and expose an API when valid arguments are passed", function(done) {
        let rcObject = new RuleContext("foo", ruleDesc, meta, Solium);

        rcObject.should.be.type("object");
        rcObject.should.be.instanceOf(RuleContext);
        rcObject.should.have.size(3);	// name & meta are readable props, so not counted as ownProperty of object

        rcObject.should.have.ownProperty("getSourceCode");
        rcObject.getSourceCode.should.be.type("function");

        rcObject.should.have.ownProperty("report");
        rcObject.report.should.be.type("function");

        //read-only properties
        rcObject.should.have.ownProperty("name");
        rcObject.name.should.be.type("string");
        Object.getOwnPropertyDescriptor(rcObject, "name").writable.should.equal(false);	//check for read-only

        rcObject.should.have.ownProperty("meta");
        rcObject.meta.should.be.type("object");
        _.isEqual(rcObject.meta, ruleDesc).should.equal(true);
        Object.getOwnPropertyDescriptor(rcObject, "meta").writable.should.equal(false);	//check for read-only

        rcObject.should.have.ownProperty("options");
        rcObject.options.should.be.type("object");
        rcObject.options.constructor.name.should.equal("Array");
        rcObject.options [0].should.equal("double");
        rcObject.options [1].should.equal(2);
        rcObject.options [2].modifies.should.equal(true);

        done();
    });

    it("should behave as expected upon calling getSourceCode ()", function(done) {
        let rcObject, scObject;

        Solium.lint(sourceCode, { rules: {} });
        rcObject = new RuleContext("foo", ruleDesc, meta, Solium);
        scObject = rcObject.getSourceCode();

        scObject.should.be.type("object");
        scObject.constructor.name.should.equal("SourceCode");
        scObject.should.have.ownProperty("text");
        scObject.text.should.equal(sourceCode);

        Solium.reset();
        done();
    });

    it("should handle invalid argument(s) passed to report()", function(done) {
        let rcObject = new RuleContext("foo", ruleDesc, meta, Solium);

        rcObject.report.bind(rcObject).should.throw();
        rcObject.report.bind(rcObject, null).should.throw();
        rcObject.report.bind(rcObject, 100).should.throw();
        rcObject.report.bind(rcObject, "foo").should.throw();
        rcObject.report.bind(rcObject, []).should.throw();

        let sampleNode = { type: "Literal", start: 0, end: 10 };

        rcObject.report.bind(rcObject, {}).should.throw();
        rcObject.report.bind(rcObject, { message: 91072 }).should.throw();
        rcObject.report.bind(rcObject, { message: "hello", node: true }).should.throw();
        rcObject.report.bind(
            rcObject,
            { message: "hello", node: sampleNode, randomAttr: {} }
        ).should.throw();
        rcObject.report.bind(
            rcObject,
            { message: "hello", node: sampleNode, location: { randomAttr: 1908 } }
        ).should.throw();
        rcObject.report.bind(
            rcObject,
            { message: "hello", node: sampleNode, location: { line: 90.1897 } }
        ).should.throw();
        rcObject.report.bind(
            rcObject,
            { message: "hello", node: sampleNode, location: { column: null } }
        ).should.throw();
        rcObject.report.bind(
            rcObject,
            { message: "hello", node: sampleNode, location: { line: 0 } }
        ).should.throw();
        rcObject.report.bind(
            rcObject,
            { message: "hello", node: sampleNode, location: { column: -1 } }
        ).should.throw();
        rcObject.report.bind(
            rcObject,
            { message: "hello", node: sampleNode, location: NaN }
        ).should.throw();
        rcObject.report.bind(
            rcObject,
            { message: "hello", node: sampleNode, fix: "this is a fix!!" }
        ).should.throw();

        // A minimal valid object should not throw
        rcObject.report.bind(
            rcObject,
            { message: "hello", node: sampleNode }
        ).should.not.throw();

        // A maximal valid object should not throw
        rcObject.report.bind(
            rcObject,
            {
                message: "hello",
                node: sampleNode,
                location: {
                    line: 7,
                    column: 56
                },
                fix(fixer) { return null; }
            }
        ).should.not.throw();

        Solium.reset(); // important here because the above 2 report()s add error messages to Solium that we need to remove.
        done();
    });

    it("should behave as expected upon calling report ()", function(done) {
        let rcObject = new RuleContext("foo", ruleDesc, meta, Solium);

        rcObject.report({
            node: { type: "TestNode", start: 0, end: 2 },
            message: "test run"
        });
        let errorObjects = Solium.lint(sourceCode, { rules: {} }, true);

        errorObjects.length.should.equal(1);
        let err = errorObjects [0];

        err.should.be.type("object");
        err.should.have.ownProperty("ruleName");
        err.ruleName.should.equal("foo");
        err.should.have.ownProperty("type");
        err.type.should.equal("warning");
        err.should.have.ownProperty("node");
        err.node.should.be.type("object");
        err.node.should.have.ownProperty("type");
        err.node.type.should.equal("TestNode");
        err.should.have.ownProperty("message");
        err.message.should.equal("test run");
        err.should.have.ownProperty("line");
        err.line.should.equal(1);
        err.should.have.ownProperty("column");
        err.column.should.equal(0);

        Solium.reset();
        done();
    });

});

/* eslint-enable no-unused-vars */