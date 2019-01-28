/**
 * @fileoverview Tests for lib/utils/ast-utils.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const astUtils = require("../../../lib/utils/ast-utils");

/* eslint-disable no-mixed-spaces-and-tabs */

describe("Testing astUtils Object", function() {

    let sourceCode = "contract Visual {\n\n\tfunction foo () {\n\t\tvar x = 100;\n\t}\n\n}",

        varDeclarator = {
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "x",
                "start": 44,
                "end": 45
            },
            "init": {
                "type": "Literal",
                "value": 100,
                "start": 48,
                "end": 51
            },
            "start": 44,
            "end": 51
        },

        functionDeclaration = {
            "type": "FunctionDeclaration",
            "name": "foo",
            "params": null,
            "modifiers": null,
            "body": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "VariableDeclaration",
                        "declarations": [
                            {
                                "type": "VariableDeclarator",
                                "id": {
                                    "type": "Identifier",
                                    "name": "x",
                                    "start": 44,
                                    "end": 45
                                },
                                "init": {
                                    "type": "Literal",
                                    "value": 100,
                                    "start": 48,
                                    "end": 51
                                },
                                "start": 44,
                                "end": 51
                            }
                        ],
                        "start": 40,
                        "end": 52
                    }
                ],
                "start": 40,
                "end": 52
            },
            "is_abstract": false,
            "start": 20,
            "end": 55
        };


    it("should expose a set of functions for use", function(done) {
        astUtils.should.have.ownProperty("init");
        astUtils.init.should.be.type("function");

        astUtils.should.have.ownProperty("isASTNode");
        astUtils.isASTNode.should.be.type("function");

        astUtils.should.have.ownProperty("isBlockStatement");
        astUtils.isBlockStatement.should.be.type("function");

        astUtils.should.have.ownProperty("isMember");
        astUtils.isMember.should.be.type("function");

        astUtils.should.have.ownProperty("isIfStatement");
        astUtils.isIfStatement.should.be.type("function");

        astUtils.should.have.ownProperty("isLoopStatement");
        astUtils.isLoopStatement.should.be.type("function");

        astUtils.should.have.ownProperty("getParent");
        astUtils.getParent.should.be.type("function");

        astUtils.should.have.ownProperty("getLine");
        astUtils.getLine.should.be.type("function");

        astUtils.should.have.ownProperty("getColumn");
        astUtils.getColumn.should.be.type("function");

        done();
    });

    it("should correctly classify argument as AST Node or non-AST Node upon calling isASTNode ()", function(done) {
        let ian = astUtils.isASTNode;

        ian().should.equal(false);
        ian(null).should.equal(false);
        ian(100).should.equal(false);
        ian({}).should.equal(false);

        ian({ type: "TestNode", start: 0, end: 10 }).should.equal(true);

        done();
    });

    it("should return node.parent when a valid node is passed to getParent ()", function(done) {
        let node = {
            type: "TestNode",
            start: 0, end: 190,
            parent: { type: "TestParentNode", start: 21, end: 981 }
        };

        let parent = astUtils.getParent(node);

        parent.should.be.type("object");
        parent.should.have.ownProperty("type");
        parent.type.should.equal("TestParentNode");

        done();
    });

    it("should handle invalid argument(s) passed to utility functions", function(done) {
        astUtils.isIfStatement.bind(astUtils).should.throw();
        astUtils.isIfStatement.bind(astUtils, null).should.throw();
        astUtils.isIfStatement.bind(astUtils, 100).should.throw();
        astUtils.isIfStatement.bind(astUtils, "foo").should.throw();
        astUtils.isIfStatement.bind(astUtils, []).should.throw();

        done();
    });

    it("should handle invalid argument(s) passed to getParent ()", function(done) {
        astUtils.getParent.bind(astUtils).should.throw();
        astUtils.getParent.bind(astUtils, null).should.throw();
        astUtils.getParent.bind(astUtils, 100).should.throw();
        astUtils.getParent.bind(astUtils, "foo").should.throw();
        astUtils.getParent.bind(astUtils, []).should.throw();

        done();
    });

    it("should return correct line no. upon getLine() with valid AST node & sourceCode init()ed", function(done) {
        astUtils.init(sourceCode);
        astUtils.getLine(varDeclarator).should.equal(4);
        astUtils.getLine(functionDeclaration).should.equal(3);
        astUtils.init("");

        done();
    });

    it("should handle invalid argument(s) passed to getLine ()", function(done) {
        astUtils.getLine.bind(astUtils).should.throw();
        astUtils.getLine.bind(astUtils, null).should.throw();
        astUtils.getLine.bind(astUtils, 100).should.throw();
        astUtils.getLine.bind(astUtils, "foo").should.throw();
        astUtils.getLine.bind(astUtils, []).should.throw();

        done();
    });

    it("should return correct column no. upon getColumn() with valid AST node & sourceCode init()ed", function(done) {
        astUtils.init("[1,2,386267,-19028.87];");
        let literals = [
            { type: "Literal", value: 1, start: 1, end: 2 },
            { type: "Literal", value: 2, start: 3, end: 4 },
            { type: "Literal", value: 386267, start: 5, end: 11 },
            {
                type: "UnaryExpression",
                operator: "-",
                argument: { type: "Literal", value: 19028.87, start: 13, end: 21 },
                prefix: true,
                start: 12,
                end: 21
            } 
        ];

        astUtils.getColumn(literals [0]).should.equal(1);
        astUtils.getColumn(literals [1]).should.equal(3);
        astUtils.getColumn(literals [2]).should.equal(5);
        astUtils.getColumn(literals [3]).should.equal(12);

        astUtils.init("\n[\"foo\",\n\"bar\",\t\t\"baz\"];");
        literals = [
            { type: "Literal", value: "foo", start: 2, end: 7 },
  			{ type: "Literal", value: "bar", start: 9, end: 14 },
  			{ type: "Literal", value: "baz", start: 17, end: 22 }
  		];

        astUtils.getColumn(literals [0]).should.equal(1);
        astUtils.getColumn(literals [1]).should.equal(0);
        astUtils.getColumn(literals [2]).should.equal(8);

        astUtils.init("function foo () {\n\t[1,2,3,4];\n}");
        literals = [
            { type: "Literal", value: 1, start: 20, end: 21 },
     		{ type: "Literal", value: 2, start: 22, end: 23 },
     		{ type: "Literal", value: 3, start: 24, end: 25 },
     		{ type: "Literal", value: 4, start: 26, end: 27 }
     	];

     	astUtils.getColumn(literals [0]).should.equal(2);
        astUtils.getColumn(literals [1]).should.equal(4);
        astUtils.getColumn(literals [2]).should.equal(6);
        astUtils.getColumn(literals [3]).should.equal(8);

        astUtils.init("\n\n(10,\n\n \"foo\"\n\n,\t189.2786)");
        literals = [
            { type: "Literal", value: 10, start: 3, end: 5 },
     		{ type: "Literal", value: "foo", start: 9, end: 14 },
     		{ type: "Literal", value: 189.2786, start: 18, end: 26 }
     	];

     	astUtils.getColumn(literals [0]).should.equal(1);
        astUtils.getColumn(literals [1]).should.equal(1);
        astUtils.getColumn(literals [2]).should.equal(2);

        astUtils.init("");

        done();
    });

    it("should handle invalid argument(s) passed to getColumn ()", function(done) {
        astUtils.getColumn.bind(astUtils).should.throw();
        astUtils.getColumn.bind(astUtils, null).should.throw();
        astUtils.getColumn.bind(astUtils, 100).should.throw();
        astUtils.getColumn.bind(astUtils, "foo").should.throw();
        astUtils.getColumn.bind(astUtils, []).should.throw();

        done();
    });

    it("should return correct ending column upon getEndingColumn () with valid AST node & sourceCode init()ed", function(done) {
        astUtils.init("[1,2,386267,-19028.87];");
        let literals = [
            { type: "Literal", value: 1, start: 1, end: 2 },
            { type: "Literal", value: 2, start: 3, end: 4 },
            { type: "Literal", value: 386267, start: 5, end: 11 },
            {
                type: "UnaryExpression",
                operator: "-",
                argument: { type: "Literal", value: 19028.87, start: 13, end: 21 },
                prefix: true,
                start: 12,
                end: 21
            } 
        ];

        astUtils.getEndingColumn(literals [0]).should.equal(1);
        astUtils.getEndingColumn(literals [1]).should.equal(3);
        astUtils.getEndingColumn(literals [2]).should.equal(10);
        astUtils.getEndingColumn(literals [3]).should.equal(20);

        astUtils.init("\n[\"foo\",\n\"bar\",\t\t\"baz\"];");
        literals = [
            { type: "Literal", value: "foo", start: 2, end: 7 },
  			{ type: "Literal", value: "bar", start: 9, end: 14 },
  			{ type: "Literal", value: "baz", start: 17, end: 22 }
  		];

        astUtils.getEndingColumn(literals [0]).should.equal(5);
        astUtils.getEndingColumn(literals [1]).should.equal(4);
        astUtils.getEndingColumn(literals [2]).should.equal(12);

        astUtils.init("function foo () {\n\t[1,2,3,4];\n}");
        literals = [
            { type: "Literal", value: 1, start: 20, end: 21 },
     		{ type: "Literal", value: 2, start: 22, end: 23 },
     		{ type: "Literal", value: 3, start: 24, end: 25 },
     		{ type: "Literal", value: 4, start: 26, end: 27 }
     	];

     	astUtils.getEndingColumn(literals [0]).should.equal(2);
        astUtils.getEndingColumn(literals [1]).should.equal(4);
        astUtils.getEndingColumn(literals [2]).should.equal(6);
        astUtils.getEndingColumn(literals [3]).should.equal(8);

        astUtils.init("\n\n(10,\n\n \"foo\"\n\n,\t189.2786)");
        literals = [
            { type: "Literal", value: 10, start: 3, end: 5 },
     		{ type: "Literal", value: "foo", start: 9, end: 14 },
     		{ type: "Literal", value: 189.2786, start: 18, end: 26 }
     	];

     	astUtils.getEndingColumn(literals [0]).should.equal(2);
        astUtils.getEndingColumn(literals [1]).should.equal(5);
        astUtils.getEndingColumn(literals [2]).should.equal(9);

        astUtils.init("");

        done();
    });

    it("should handle invalid argument(s) passed to getEndingColumn ()", function(done) {
        astUtils.getEndingLine.bind(astUtils).should.throw();
        astUtils.getEndingLine.bind(astUtils, null).should.throw();
        astUtils.getEndingLine.bind(astUtils, 100).should.throw();
        astUtils.getEndingLine.bind(astUtils, "foo").should.throw();
        astUtils.getEndingLine.bind(astUtils, []).should.throw();

        done();
    });

    it("should return correct line no. on getEndingLine() with valid AST node & sourceCode init()ed", function(done) {
        astUtils.init(sourceCode);
        astUtils.getEndingLine(varDeclarator).should.equal(4);
        astUtils.getEndingLine(functionDeclaration).should.equal(5);
        astUtils.init("");

        done();
    });

    it("should handle invalid argument(s) passed to getLine ()", function(done) {
        astUtils.getEndingLine.bind(astUtils).should.throw();
        astUtils.getEndingLine.bind(astUtils, null).should.throw();
        astUtils.getEndingLine.bind(astUtils, 100).should.throw();
        astUtils.getEndingLine.bind(astUtils, "foo").should.throw();
        astUtils.getEndingLine.bind(astUtils, []).should.throw();

        done();
    });

    it("should behave correctly when calling isAChildOf()", done => {
        const child = { type: "Blah", start: 10, end: 20 },
            parent = { type: "Blah", start: 0, end: 30 }, notChild = { type: "Blah", start: 45, end: 80 };

        astUtils.isAChildOf(child, parent).should.be.true();
        astUtils.isAChildOf(parent, child).should.be.false();
        astUtils.isAChildOf(parent, parent).should.be.false();
        astUtils.isAChildOf(notChild, parent).should.be.false();
        astUtils.isAChildOf(child, notChild).should.be.false();

        done();
    });

    it("should reject invalid nodes when calling isAChildOf()", done => {
        const validNode = { type: "Blah", start: 10, end: 20 },
            invalidNode = { start: 10, end: 20 };

        astUtils.isAChildOf.bind(astUtils).should.throw();
        astUtils.isAChildOf.bind(astUtils, null).should.throw();
        astUtils.isAChildOf.bind(astUtils, 100).should.throw();
        astUtils.isAChildOf.bind(astUtils, "foo").should.throw();
        astUtils.isAChildOf.bind(astUtils, []).should.throw();

        astUtils.isAChildOf.bind(astUtils, validNode, null).should.throw();
        astUtils.isAChildOf.bind(astUtils, validNode, 100).should.throw();
        astUtils.isAChildOf.bind(astUtils, validNode, "foo").should.throw();
        astUtils.isAChildOf.bind(astUtils, validNode, []).should.throw();

        astUtils.isAChildOf.bind(astUtils, null, validNode).should.throw();
        astUtils.isAChildOf.bind(astUtils, 100, validNode).should.throw();
        astUtils.isAChildOf.bind(astUtils, "foo", validNode).should.throw();
        astUtils.isAChildOf.bind(astUtils, [], validNode).should.throw();

        astUtils.isAChildOf.bind(astUtils, invalidNode, validNode).should.throw();
        astUtils.isAChildOf.bind(astUtils, validNode, invalidNode).should.throw();

        astUtils.isAChildOf.bind(astUtils, validNode, validNode).should.not.throw();

        done();
    });

});

/* eslint-enable no-mixed-spaces-and-tabs */
