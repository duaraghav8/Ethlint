/**
 * @fileoverview Tests for indentation rules
 * @author Alex Chapman <achap5dk@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var toContract = require ('../../../utils/wrappers').toContract;

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "overflow-indentation": true,
  }
};

describe ('[RULE] indentation overflow: Rejections', function () {

	it ('should enforce the rule that excess element lists must go on individual lines', function (done) {
		var code = toContract ('function ArgumentOverflow(int one, int two, int three, int four) {}'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (1);
		errors[0].message.should.equal("Function \'ArgumentOverflow\': in case of more than 3 parameters, drop each into its own line.");

		Solium.reset ();
		done ();
	});

});

describe ('[RULE] indentation overflow: Acceptance', function () {

	it ('should enforce the rule that excess element lists must go on individual lines', function (done) {
		var code = toContract ('function ArgumentOverflow(int one, int two, int three) {}'),
			errors = Solium.lint (code, userConfig);

		errors.constructor.name.should.equal ('Array');
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});