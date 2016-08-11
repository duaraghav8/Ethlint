/**
 * @fileoverview Tests for lib/utils/node-event-generator.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var SourceCode = require ('../../../lib/utils/source-code-utils'),
	Solium = require ('../../../lib/solium');

describe ('Testing SourceCode instance for exposed functionality', function () {
	var sourceCodeText = 'contract Visual {\n\n\tfunction foo () {\n\t\tvar x = 100;\n\t}\n\n}',
		varDeclarator = {
			type: 'VariableDeclarator',
  			id: { type: 'Identifier', name: 'x', start: 44, end: 45 },
  			init: { type: 'Literal', value: 100, start: 48, end: 51 },
  			start: 44,
  			end: 51
  		};

	it ('should create instance of SourceCode & expose set of functions (its own & those of astUtils)', function (done) {
		var sourceCodeObject = new SourceCode (sourceCodeText);

		sourceCodeObject.should.be.type ('object');
		sourceCodeObject.should.be.instanceof (SourceCode);

		sourceCodeObject.should.have.ownProperty ('text', sourceCodeText);

		//functions inherited from astUtils
		sourceCodeObject.should.have.property ('getLine');
		sourceCodeObject.getLine.should.be.type ('function');

		sourceCodeObject.should.have.property ('getColumn');
		sourceCodeObject.getColumn.should.be.type ('function');

		sourceCodeObject.should.have.property ('getParent');
		sourceCodeObject.getParent.should.be.type ('function');

		//prototype functions
		sourceCodeObject.should.have.property ('getText');
		sourceCodeObject.getText.should.be.type ('function');

		sourceCodeObject.should.have.property ('getNextChar');
		sourceCodeObject.getNextChar.should.be.type ('function');

		sourceCodeObject.should.have.property ('getPrevChar');
		sourceCodeObject.getPrevChar.should.be.type ('function');

		sourceCodeObject.should.have.property ('getNextChars');
		sourceCodeObject.getNextChars.should.be.type ('function');

		sourceCodeObject.should.have.property ('getPrevChars');
		sourceCodeObject.getPrevChars.should.be.type ('function');

		done ();
	});

	it ('should behave as expected upon calling getText ()', function (done) {
		var sourceCodeObject = new SourceCode (sourceCodeText);

		sourceCodeObject.getText.bind (sourceCodeObject, {}).should.throw ();

		sourceCodeObject.getText ().should.equal (sourceCodeText);
		sourceCodeObject.getText (varDeclarator).should.equal ('x = 100');
		sourceCodeObject.getText (varDeclarator, 0, 0).should.equal ('x = 100');
		sourceCodeObject.getText (varDeclarator, 4).should.equal ('var x = 100');
		sourceCodeObject.getText (varDeclarator, 4, 1).should.equal ('var x = 100;');
		sourceCodeObject.getText (varDeclarator, -4, -1).should.equal ('var x = 100;');
		sourceCodeObject.getText (varDeclarator, 100, 100).should.equal (sourceCodeText);

		done ();
	});

});