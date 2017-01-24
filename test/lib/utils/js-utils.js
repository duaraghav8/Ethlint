/**
 * @fileoverview Tests for lib/utils/js-utils.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Solium = require ('../../../lib/solium'),
	jsUtils = require('../../../lib/utils/js-utils');

describe ('Test jsUtils functions', function () {

	it ('should have a set of functions exposed as API', function (done) {
		jsUtils.should.have.ownProperty ('isStrictlyObject');
		jsUtils.isStrictlyObject.should.be.type ('function');

		done ();
	});

	it ('isStrictlyObject: should correctly classify whether argument is a non-array, non-null object', function (done) {
		var iso = jsUtils.isStrictlyObject;

		iso ().should.equal (false);
		iso (100).should.equal (false);
		iso (null).should.equal (false);
		iso ('foo').should.equal (false);
		iso ([1,2]).should.equal (false);

		iso ({}).should.equal (true);

		done ();
	});
});
