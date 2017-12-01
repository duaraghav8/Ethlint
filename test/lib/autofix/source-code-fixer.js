/**
 * @fileoverview Tests for lib/autofix/source-code-fixer.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let scf = require("../../../lib/autofix/source-code-fixer");

// No need to check for fuzzy values in this module since it is only used internally, ensuring expected arguments
describe("Test the source-code-fixer API", function() {

    it("should expose a set of functions", function(done) {
        scf.should.be.type("object");
        scf.should.have.ownProperty("applyFixes");
        scf.applyFixes.should.be.type("function");
        done();
    });

    it("should not alter the errorMessages array when passed to applyFixes()", function(done) {
        let msgsNoFixes = [{
            ruleName: "abc",
            message: "def",
            type: "error",
            line: 1,
            column: 4,
            node: {type: "Literal", start: 1, end: 9}
        }];

        let msgsWithFixes = [{
            ruleName: "abc",
            message: "def",
            type: "error",
            line: 1,
            column: 4,
            node: {type: "Literal", start: 1, end: 9},
            fix: {range: [1, 4], text: ""}
        }];

        scf.applyFixes("", msgsNoFixes);

        msgsNoFixes.should.be.Array();
        msgsNoFixes.should.have.size(1);
        msgsNoFixes [0].should.be.type("object");
        msgsNoFixes [0].should.have.size(6);
        msgsNoFixes [0].should.have.ownProperty("ruleName");
        msgsNoFixes [0].ruleName.should.equal("abc");
        msgsNoFixes [0].should.have.ownProperty("type");
        msgsNoFixes [0].type.should.equal("error");
        msgsNoFixes [0].should.have.ownProperty("node");
        msgsNoFixes [0].node.should.be.type("object");
        msgsNoFixes [0].should.have.ownProperty("line");
        msgsNoFixes [0].line.should.equal(1);
        msgsNoFixes [0].should.have.ownProperty("column");
        msgsNoFixes [0].column.should.equal(4);
        msgsNoFixes [0].should.have.ownProperty("message");
        msgsNoFixes [0].message.should.equal("def");
        msgsNoFixes [0].should.not.have.ownProperty("fix");

        scf.applyFixes("abcd", msgsWithFixes);

        msgsWithFixes.should.be.Array();
        msgsWithFixes.should.have.size(1);
        msgsWithFixes [0].should.be.type("object");
        msgsWithFixes [0].should.have.size(7);
        msgsWithFixes [0].should.have.ownProperty("ruleName");
        msgsWithFixes [0].ruleName.should.equal("abc");
        msgsWithFixes [0].should.have.ownProperty("type");
        msgsWithFixes [0].type.should.equal("error");
        msgsWithFixes [0].should.have.ownProperty("node");
        msgsWithFixes [0].node.should.be.type("object");
        msgsWithFixes [0].should.have.ownProperty("line");
        msgsWithFixes [0].line.should.equal(1);
        msgsWithFixes [0].should.have.ownProperty("column");
        msgsWithFixes [0].column.should.equal(4);
        msgsWithFixes [0].should.have.ownProperty("message");
        msgsWithFixes [0].message.should.equal("def");
        msgsWithFixes [0].should.have.ownProperty("fix");
        msgsWithFixes [0].fix.should.be.type("object");

        done();
    });

    it("should return source code as-it-is if there are no fixes to apply", function(done) {
        let msgsNoFixes = [{
            ruleName: "abc",
            message: "def",
            type: "error",
            line: 1,
            column: 4,
            node: {type: "Literal", start: 1, end: 9}
        }];

        let sourceCode = "abcd123@@@***&^###;;{}[]";

        let result = scf.applyFixes(sourceCode, []);

        result.should.be.type("object");
        result.should.have.size(3);
        result.should.have.ownProperty("fixesApplied");
        result.should.have.ownProperty("remainingErrorMessages");
        result.should.have.ownProperty("fixedSourceCode");
        result.fixesApplied.should.be.Array();
        result.fixesApplied.should.be.empty();
        result.remainingErrorMessages.should.be.Array();
        result.remainingErrorMessages.should.be.empty();
        result.fixedSourceCode.should.equal(sourceCode);

        result = scf.applyFixes(sourceCode, msgsNoFixes);

        result.should.be.type("object");
        result.should.have.size(3);
        result.should.have.ownProperty("fixesApplied");
        result.should.have.ownProperty("remainingErrorMessages");
        result.should.have.ownProperty("fixedSourceCode");
        result.fixesApplied.should.be.Array();
        result.fixesApplied.should.be.empty();
        result.remainingErrorMessages.should.be.Array();
        result.remainingErrorMessages.should.have.size(1);
        result.fixedSourceCode.should.equal(sourceCode);
		
        done();
    });

    it("should fix as expected when valid args are passed to applyFixes()", function(done) {
        // Also ensure that it correctly segregates all messages into either fixesApplied or remainingErrorMessages
        let msgs = [
            {
                ruleName: "a",
                message: "def",
                type: "error",
                line: 1,
                column: 4,
                node: {type: "Literal", start: 1, end: 9}
            },
            {
                ruleName: "b",
                message: "def",
                type: "error",
                line: 1,
                column: 4,
                node: {type: "Literal", start: 1, end: 9},
                fix: {range: [3, 8], text: "***"}	// replace
            },
            {
                ruleName: "c",
                message: "def",
                type: "error",
                line: 1,
                column: 4,
                node: {type: "Literal", start: 1, end: 9}
            },
            {
                ruleName: "d",
                message: "def",
                type: "error",
                line: 1,
                column: 4,
                node: {type: "Literal", start: 1, end: 9},
                fix: {range: [8, 24], text: ""}	// delete
            }
        ];

        let sourceCode = "abcd123@@@***&^###;;{}[]",
            fixedSourceCode = "abc***";

        let result = scf.applyFixes(sourceCode, msgs);

        result.should.be.type("object");
        result.should.have.size(3);
        result.should.have.ownProperty("fixesApplied");
        result.should.have.ownProperty("remainingErrorMessages");
        result.should.have.ownProperty("fixedSourceCode");

        result.fixesApplied.should.be.Array();
        result.fixesApplied.should.have.size(2);
        result.fixesApplied [0].ruleName.should.equal("b");
        result.fixesApplied [1].ruleName.should.equal("d");
        result.remainingErrorMessages.should.be.Array();
        result.remainingErrorMessages.should.have.size(2);
        result.remainingErrorMessages [0].ruleName.should.equal("a");
        result.remainingErrorMessages [1].ruleName.should.equal("c");
        result.fixedSourceCode.should.equal(fixedSourceCode);

        done();
    });

    it("in case of overlapping fixes, the one that occurs before (row-wise then col-wise) should be applied", function(done) {
        let msgs = [
            {
                ruleName: "a",
                message: "def",
                type: "error",
                line: 1,
                column: 4,
                node: {type: "Literal", start: 1, end: 9},
                fix: {range: [5, 10], text: "^_^"}	// shouldn't get applied
            },
            {
                ruleName: "b",
                message: "def",
                type: "error",
                line: 1,
                column: 4,
                node: {type: "Literal", start: 1, end: 9},
                fix: {range: [3, 8], text: "***"}
            }
        ];

        let sourceCode = "abcd123@@@***&^###;;{}[]",
            fixedSourceCode = "abc***@@***&^###;;{}[]";

        let result = scf.applyFixes(sourceCode, msgs);

        result.should.be.type("object");
        result.should.have.size(3);
        result.should.have.ownProperty("fixesApplied");
        result.should.have.ownProperty("remainingErrorMessages");
        result.should.have.ownProperty("fixedSourceCode");

        result.fixesApplied.should.be.Array();
        result.fixesApplied.should.have.size(1);
        result.fixesApplied [0].ruleName.should.equal("b");
        result.remainingErrorMessages.should.be.Array();
        result.remainingErrorMessages.should.have.size(1);
        result.remainingErrorMessages [0].ruleName.should.equal("a");
        result.fixedSourceCode.should.equal(fixedSourceCode);

        done();
    });

    it("should throw when a fix reported by a rule contains overlapping fixer objects", function(done) {
        // This is different from the overlapping being tested above. Here, we want to ensure that
        // if rule ABC reports a fix inside an error object, and if that fix is an array of fixer packets,
        // those packets must not have overlapping ranges.
        scf.applyFixes.bind(scf,
            [{range: [2, 5], text: ""}, {range: [4, 8], text: "%%%"}], "abcdefghijk"
        ).should.throw();

        done();
    });

});