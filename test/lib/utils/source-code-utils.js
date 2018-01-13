/**
 * @fileoverview Tests for lib/utils/node-event-generator.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const { EOL } = require("os"),
    SourceCode = require("../../../lib/utils/source-code-utils");

describe("Testing SourceCode instance for exposed functionality", function() {
    let sourceCodeText = "contract Visual {\n\n\tfunction foo () {\n\t\tvar x = 100;\n\t}\n\n}",
        varDeclarator = {
            type: "VariableDeclarator",
            id: { type: "Identifier", name: "x", start: 44, end: 45 },
            init: { type: "Literal", value: 100, start: 48, end: 51 },
            start: 44,
            end: 51
        };

    it("should create instance of SourceCode & expose set of functions (its own & those of astUtils)", function(done) {
        let sourceCodeObject = new SourceCode(sourceCodeText);

        sourceCodeObject.should.be.type("object");
        sourceCodeObject.should.be.instanceof(SourceCode);

        sourceCodeObject.should.have.ownProperty("text");
        sourceCodeObject.text.should.equal(sourceCodeText);

        //functions inherited from astUtils
        sourceCodeObject.should.have.property("getLine");
        sourceCodeObject.getLine.should.be.type("function");

        sourceCodeObject.should.have.property("getEndingLine");
        sourceCodeObject.getLine.should.be.type("function");

        sourceCodeObject.should.have.property("getColumn");
        sourceCodeObject.getColumn.should.be.type("function");

        sourceCodeObject.should.have.property("getEndingColumn");
        sourceCodeObject.getEndingColumn.should.be.type("function");

        sourceCodeObject.should.have.property("getParent");
        sourceCodeObject.getParent.should.be.type("function");

        // functions for node type checking
        sourceCodeObject.should.have.property("isBlockStatement");
        sourceCodeObject.isBlockStatement.should.be.type("function");

        sourceCodeObject.should.have.property("isBreakStatement");
        sourceCodeObject.isBreakStatement.should.be.type("function");

        sourceCodeObject.should.have.property("isExpression");
        sourceCodeObject.isExpression.should.be.type("function");

        sourceCodeObject.should.have.property("isAssignment");
        sourceCodeObject.isAssignment.should.be.type("function");

        sourceCodeObject.should.have.property("isUpdate");
        sourceCodeObject.isUpdate.should.be.type("function");

        sourceCodeObject.should.have.property("isMember");
        sourceCodeObject.isMember.should.be.type("function");

        sourceCodeObject.should.have.property("isIfStatement");
        sourceCodeObject.isIfStatement.should.be.type("function");

        sourceCodeObject.should.have.property("isLoopStatement");
        sourceCodeObject.isLoopStatement.should.be.type("function");

        //prototype functions
        sourceCodeObject.should.have.property("getText");
        sourceCodeObject.getText.should.be.type("function");

        sourceCodeObject.should.have.property("getTextOnLine");
        sourceCodeObject.getText.should.be.type("function");

        sourceCodeObject.should.have.property("getNextChar");
        sourceCodeObject.getNextChar.should.be.type("function");

        sourceCodeObject.should.have.property("getPrevChar");
        sourceCodeObject.getPrevChar.should.be.type("function");

        sourceCodeObject.should.have.property("getNextChars");
        sourceCodeObject.getNextChars.should.be.type("function");

        sourceCodeObject.should.have.property("getPrevChars");
        sourceCodeObject.getPrevChars.should.be.type("function");

        sourceCodeObject.should.have.property("getStringBetweenNodes");
        sourceCodeObject.getPrevChars.should.be.type("function");

        done();
    });

    it("should behave as expected upon calling getText ()", function(done) {
        let sourceCodeObject = new SourceCode(sourceCodeText);
        let functionCallText = "fooBar ();",
            functionCallNode = { type: "ExpressionStatement",
                expression: 
                { type: "CallExpression",
                    callee: { type: "Identifier", name: "fooBar", start: 0, end: 6 },
                    arguments: [],
                    start: 0,
                    end: 9 },
                start: 0,
                end: 10 };

        sourceCodeObject.getText.bind(sourceCodeObject, {}).should.throw();

        sourceCodeObject.getText().should.equal(sourceCodeText);
        sourceCodeObject.getText(varDeclarator).should.equal("x = 100");
        sourceCodeObject.getText(varDeclarator, 0, 0).should.equal("x = 100");
        sourceCodeObject.getText(varDeclarator, 4).should.equal("var x = 100");
        sourceCodeObject.getText(varDeclarator, 4, 1).should.equal("var x = 100;");
        sourceCodeObject.getText(varDeclarator, -4, -1).should.equal("var x = 100;");
        sourceCodeObject.getText(varDeclarator, 100, 100).should.equal(sourceCodeText);

        sourceCodeObject = new SourceCode(functionCallText);

        sourceCodeObject.getText(functionCallNode).should.equal(functionCallText);

        done();
    });

    it("should behave as expected upon calling getNextChar ()", function(done) {
        let sourceCodeObject = new SourceCode(sourceCodeText);

        sourceCodeObject.getNextChar.bind(sourceCodeObject, {}).should.throw();
        sourceCodeObject.getNextChar.bind(sourceCodeObject).should.throw();
        sourceCodeObject.getNextChar(varDeclarator).should.equal(";");
        //Imitate the last node (with no chars after its code), the function should return null
        (sourceCodeObject.getNextChar(
            {type: "LastNode", end: sourceCodeText.length, start: 2}
        ) === null).should.equal(true);

        //extreme
        (sourceCodeObject.getNextChar(
            {type: "LastNode", end: 100000, start: 90}
        ) === null).should.equal(true);

        done();
    });

    it("should behave as expected upon calling getPrevChar ()", function(done) {
        let sourceCodeObject = new SourceCode(sourceCodeText);

        sourceCodeObject.getPrevChar.bind(sourceCodeObject, {}).should.throw();
        sourceCodeObject.getPrevChar.bind(sourceCodeObject).should.throw();
        sourceCodeObject.getPrevChar(varDeclarator).should.equal(" ");
        //Imitate the first node (with no chars before its code), the function should return null
        (sourceCodeObject.getPrevChar(
            {type: "FirstNode", start: 0, end: 90}
        ) === null).should.equal(true);

        done();
    });

    it("should behave as expected upon calling getNextChars ()", function(done) {
        let sourceCodeObject = new SourceCode(sourceCodeText);

        sourceCodeObject.getNextChars.bind(sourceCodeObject, {}).should.throw();
        sourceCodeObject.getNextChars.bind(sourceCodeObject).should.throw();
        sourceCodeObject.getNextChars(varDeclarator).should.equal("");
        sourceCodeObject.getNextChars(varDeclarator, 1).should.equal(";");
        sourceCodeObject.getNextChars(varDeclarator, -1).should.equal(";");
        sourceCodeObject.getNextChars(varDeclarator, 100).should.equal(";\n\t}\n\n}");

        done();
    });

    it("should behave as expected upon calling getPrevChars ()", function(done) {
        let sourceCodeObject = new SourceCode(sourceCodeText);

        sourceCodeObject.getPrevChars.bind(sourceCodeObject, {}).should.throw();
        sourceCodeObject.getPrevChars.bind(sourceCodeObject).should.throw();
        sourceCodeObject.getPrevChars(varDeclarator).should.equal("");
        sourceCodeObject.getPrevChars(varDeclarator, 4).should.equal("var ");
        sourceCodeObject.getPrevChars(varDeclarator, -4).should.equal("var ");
        sourceCodeObject.getPrevChars(varDeclarator, 100).should.equal(
            "contract Visual {\n\n\tfunction foo () {\n\t\tvar "
        );

        done();
    });

    it("should behave as expected upon calling getStringBetweenNodes ()", function(done) {
        let sourceCodeText = "var x = 100;\n\tvar (y) = 200;\n\n\tvar z = 300;",
            sourceCodeObject = new SourceCode(sourceCodeText);

        let prevNode = {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "x",
                        "start": 4,
                        "end": 5
                    },
                    "init": {
                        "type": "Literal",
                        "value": 100,
                        "start": 8,
                        "end": 11
                    },
                    "start": 4,
                    "end": 11
                }
            ],
            "start": 0,
            "end": 12
        };

        let currentNode = {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "z",
                        "start": 35,
                        "end": 36
                    },
                    "init": {
                        "type": "Literal",
                        "value": 300,
                        "start": 39,
                        "end": 42
                    },
                    "start": 35,
                    "end": 42
                }
            ],
            "start": 31,
            "end": 43
        };

        sourceCodeObject
            .getStringBetweenNodes(prevNode, currentNode)
            .should.equal("\n\tvar (y) = 200;\n\n\t");

        sourceCodeObject
            .getStringBetweenNodes
            .bind(sourceCodeObject).should.throw();

        sourceCodeObject
            .getStringBetweenNodes
            .bind(sourceCodeObject, 1, 1).should.throw();

        sourceCodeObject
            .getStringBetweenNodes
            .bind(sourceCodeObject, {}, {}).should.throw();

        sourceCodeObject
            .getStringBetweenNodes
            .bind(sourceCodeObject, null, null).should.throw();

        sourceCodeObject
            .getStringBetweenNodes
            .bind(sourceCodeObject, [], []).should.throw();

        sourceCodeObject
            .getStringBetweenNodes
            .bind(sourceCodeObject, currentNode, prevNode).should.throw();

        done();
    });

    it("should behave as expected upon calling getTextOnLine()", function(done) {
        let sourceCodeObject = new SourceCode(sourceCodeText),
            sourceCodeTextLines = sourceCodeText.split(EOL);

        for (let i = 0; i < sourceCodeTextLines.length; i++) {
            sourceCodeObject.getTextOnLine(i+1)
                .should.equal(sourceCodeTextLines [i]);
        }

        sourceCodeObject.getTextOnLine.bind(sourceCodeObject).should.throw();
        sourceCodeObject.getTextOnLine.bind(sourceCodeObject, null).should.throw();
        sourceCodeObject.getTextOnLine.bind(sourceCodeObject, "").should.throw();
        sourceCodeObject.getTextOnLine.bind(sourceCodeObject, 0).should.throw();
        sourceCodeObject.getTextOnLine.bind(sourceCodeObject, "1").should.throw();
        sourceCodeObject.getTextOnLine.bind(sourceCodeObject, -1).should.throw();
        sourceCodeObject.getTextOnLine.bind(sourceCodeObject, 100).should.throw();
        sourceCodeObject.getTextOnLine.bind(sourceCodeObject, 2.3).should.throw();

        done();
    });

});
