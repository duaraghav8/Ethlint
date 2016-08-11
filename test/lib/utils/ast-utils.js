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
  			id: { type: 'Identifier', name: 'x', start: 42, end: 43 },
  			init: { type: 'Literal', value: 100, start: 46, end: 49 },
  			start: 42,
  			end: 49
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

	it ('should return correct line no. upon getLine() with valid AST node & sourceCode init()ed', function (done) {
  		astUtils.init (sourceCode);
  		astUtils.getLine (varDeclarator).should.equal (4)
  		astUtils.init ('');

		done ();
	});

	it ('should return correct column no. upon getColumn() with valid AST node & sourceCode init()ed', function (done) {
		astUtils.init (sourceCode);
		//astUtils.getColumn (varDeclarator).should.equal (/*COLUMN NO. - LOGIC NOT WRITTEN YET*/);
		astUtils.init ('');

		done ();
	});

});