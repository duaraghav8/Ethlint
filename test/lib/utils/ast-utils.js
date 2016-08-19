/**
 * @fileoverview Tests for lib/utils/ast-utils.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var astUtils = require ('../../../lib/utils/ast-utils');

describe ('Testing astUtils Object', function () {

	var sourceCode = 'contract Visual {\n\n\tfunction foo () {\n\t\tvar x = 100;\n\t}\n\n}',

		varDeclarator = {
			type: 'VariableDeclarator',
  			id: { type: 'Identifier', name: 'x', start: 44, end: 45 },
  			init: { type: 'Literal', value: 100, start: 48, end: 51 },
  			start: 44,
  			end: 51
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
  			"end": 57
		};

	it ('should expose a set of functions for use', function (done) {
		astUtils.should.have.ownProperty ('init');
		astUtils.init.should.be.type ('function');

		astUtils.should.have.ownProperty ('isASTNode');
		astUtils.isASTNode.should.be.type ('function');

		astUtils.should.have.ownProperty ('getParent');
		astUtils.getParent.should.be.type ('function');

		astUtils.should.have.ownProperty ('getLine');
		astUtils.getLine.should.be.type ('function');

		astUtils.should.have.ownProperty ('getColumn');
		astUtils.getColumn.should.be.type ('function');

		done ();
	});

	it ('should correctly classify argument as AST Node or non-AST Node upon calling isASTNode ()', function (done) {
		var ian = astUtils.isASTNode, temp;

		ian ().should.equal (false);
		ian (null).should.equal (false);
		ian (100).should.equal (false);
		ian ({}).should.equal (false);

		ian ({type: 'TestNode'}).should.equal (true);

		done ();
	});

	it ('should return node.parent when a valid node is passed to getParent ()', function (done) {
		var node = { type: 'TestNode', parent: {type: 'TestParentNode'} };
		var parent = astUtils.getParent (node);

		parent.should.be.type ('object');
		parent.should.have.ownProperty ('type', 'TestParentNode');

		done ();
	});

	it ('should handle invalid argument(s) passed to getParent ()', function (done) {
		astUtils.getParent.bind (astUtils).should.throw ();
		astUtils.getParent.bind (astUtils, null).should.throw ();
		astUtils.getParent.bind (astUtils, 100).should.throw ();
		astUtils.getParent.bind (astUtils, 'foo').should.throw ();
		astUtils.getParent.bind (astUtils, []).should.throw ();

		done ();
	});

	it ('should return correct line no. upon getLine() with valid AST node & sourceCode init()ed', function (done) {
  		astUtils.init (sourceCode);
  		astUtils.getLine (varDeclarator).should.equal (4);
  		astUtils.getLine (functionDeclaration).should.equal (3);
  		astUtils.init ('');

		done ();
	});

	it ('should handle invalid argument(s) passed to getLine ()', function (done) {
		astUtils.getLine.bind (astUtils).should.throw ();
		astUtils.getLine.bind (astUtils, null).should.throw ();
		astUtils.getLine.bind (astUtils, 100).should.throw ();
		astUtils.getLine.bind (astUtils, 'foo').should.throw ();
		astUtils.getLine.bind (astUtils, []).should.throw ();

		done ();
	});

	it ('should return correct column no. upon getColumn() with valid AST node & sourceCode init()ed', function (done) {
		astUtils.init (sourceCode);
		//astUtils.getColumn (varDeclarator).should.equal (/*COLUMN NO. - LOGIC NOT WRITTEN YET*/);
		astUtils.init ('');

		done ();
	});

	it ('should handle invalid argument(s) passed to getColumn ()', function (done) {
		astUtils.getColumn.bind (astUtils).should.throw ();
		astUtils.getColumn.bind (astUtils, null).should.throw ();
		astUtils.getColumn.bind (astUtils, 100).should.throw ();
		astUtils.getColumn.bind (astUtils, 'foo').should.throw ();
		astUtils.getColumn.bind (astUtils, []).should.throw ();

		done ();
	});

	it ('should return correct line no. on getEndingLine() with valid AST node & sourceCode init()ed', function (done) {
  		astUtils.init (sourceCode);
  		astUtils.getEndingLine (varDeclarator).should.equal (4);
  		astUtils.getEndingLine (functionDeclaration).should.equal (5);
  		//console.log ('***********', astUtils.getEndingLine (functionDeclaration));
  		astUtils.init ('');

		done ();
	});

	it ('should handle invalid argument(s) passed to getLine ()', function (done) {
		astUtils.getEndingLine.bind (astUtils).should.throw ();
		astUtils.getEndingLine.bind (astUtils, null).should.throw ();
		astUtils.getEndingLine.bind (astUtils, 100).should.throw ();
		astUtils.getEndingLine.bind (astUtils, 'foo').should.throw ();
		astUtils.getEndingLine.bind (astUtils, []).should.throw ();

		done ();
	});

});