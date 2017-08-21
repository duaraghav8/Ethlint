/**
 * @fileoverview Tests for config-inspector
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var configInspector = require('../../../lib/utils/config-inspector');

describe ('Test config-inspector functions', function () {

	it ('should have a set of functions exposed as API', function (done) {
		configInspector.should.have.ownProperty ('isValid');
		configInspector.isValid.should.be.type ('function');

		configInspector.should.have.ownProperty ('isFormatDeprecated');
		configInspector.isFormatDeprecated.should.be.type ('function');

		done ();
	});

	it ('isValid() should correctly classify invalid config objects', function (done) {
		configInspector.isValid ().should.equal (false);
		configInspector.isValid (undefined).should.equal (false);
		configInspector.isValid (null).should.equal (false);
		configInspector.isValid (-1).should.equal (false);
		configInspector.isValid (0).should.equal (false);
		configInspector.isValid (1.829).should.equal (false);
		configInspector.isValid ('hello world').should.equal (false);
		configInspector.isValid ([]).should.equal (false);
		configInspector.isValid (false).should.equal (false);
		configInspector.isValid (true).should.equal (false);
		configInspector.isValid ({}).should.equal (false);
		configInspector.isValid ({ rules: [] }).should.equal (false);
		configInspector.isValid ({ rules: 1, extends: 'blahblah' }).should.equal (false);
		configInspector.isValid ({ rules: {}, extends: 89.28 }).should.equal (false);
		configInspector.isValid ({ extends: '' }).should.equal (false);
		configInspector.isValid ({ extends: '', rules: {} }).should.equal (false);
		configInspector.isValid ({ extends: [] }).should.equal (false);
		configInspector.isValid ({ rules: {a: []} }).should.equal (false);
		configInspector.isValid ({ extends: 'lola', options: {randomAttr: true} }).should.equal (false);
		configInspector.isValid ({ extends: 'lola', rules: {}, options: {randomAttr: true} }).should.equal (false);
		configInspector.isValid ({ rules: {}, randomAttr: {} }).should.equal (false);
		configInspector.isValid ({ rules: {a: 1}, options: {randomAttr: true} }).should.equal (false);
		configInspector.isValid ({ rules: {a: 1}, options: {returnInternalIssues: 'hello world'} }).should.equal (false);
		configInspector.isValid ({ rules: {}, options: {randomAttr: true} }).should.equal (false);
		configInspector.isValid ({ rules: {}, randomAttr: {} }).should.equal (false);
		configInspector.isValid ({ rules: {}, options: {returnInternalIssues: 'hello'} }).should.equal (false);

		// This will be valid in future when extends is allowed to be array of strings.
		configInspector.isValid ({ extends: ['/dev', '/payments'] }).should.equal (false);

		// Deprecated
		configInspector.isValid ({ 'custom-rules-filename': [] }).should.equal (false);
		configInspector.isValid ({ 'custom-rules-filename': 89172, rules: {a: true} }).should.equal (false);
		configInspector.isValid ({ 'custom-rules-filename': {} }).should.equal (false);
		configInspector.isValid ({ 'custom-rules-filename': true }).should.equal (false);
		configInspector.isValid ({ 'custom-rules-filename': '' }).should.equal (false);
		configInspector.isValid ({ 'custom-rules-filename': 'lola', options: {auto: true} }).should.equal (false);
		configInspector.isValid ({ 'custom-rules-filename': 'lola', options: {autofix: 'hello'} }).should.equal (false);

		configInspector.isValid ({
			'custom-rules-filename': 'lola',
			options: {autofix: true, returnInternalIssues: 'hello'}
		}).should.equal (false);

		configInspector.isValid ({
			'custom-rules-filename': 'lola',
			options: {autofix: true, returnInternalIssue: false}
		}).should.equal (false);

		// Mixed
		configInspector.isValid ({ 'custom-rules-filename': 'iuyu', extends: 'sss' }).should.equal (false);
		configInspector.isValid ({ extends: 'sss', rules: {a: true} }).should.equal (false);
		configInspector.isValid ({ 'custom-rules-filename': 'goaka', rules: {a: 1} }).should.equal (false);

		done ();
	});

	it ('isValid() should correctly classify valid config objects', function (done) {
		configInspector.isValid ({ rules: {a: [1]} }).should.equal (true);
		configInspector.isValid ({ extends: 'blahblah' }).should.equal (true);
		configInspector.isValid ({ rules: {a: [1]}, extends: 'blahblah' }).should.equal (true);
		configInspector.isValid ({ rules: {} }).should.equal (true);
		configInspector.isValid ({ rules: {}, options: {} }).should.equal (true);
		configInspector.isValid ({ rules: {}, extends: 'lola', options: {} }).should.equal (true);
		configInspector.isValid ({ rules: {}, options: {autofix: true} }).should.equal (true);
		configInspector.isValid ({ rules: {}, options: {returnInternalIssues: true} }).should.equal (true);
		configInspector.isValid ({ rules: {}, options: {autofix: false, returnInternalIssues: true} }).should.equal (true);
		configInspector.isValid ({ rules: {a: 1}, options: {autofix: false, returnInternalIssues: true} }).should.equal (true);

		// Deprecated
		configInspector.isValid ({ rules: {a: true} }).should.equal (true);
		configInspector.isValid ({ rules: {a: false, b: false, c: true} }).should.equal (true);
		configInspector.isValid ({ 'custom-rules-filename': 'koala', rules: {a: false} }).should.equal (true);
		configInspector.isValid ({ 'custom-rules-filename': null, rules: {a: true} }).should.equal (true);
		configInspector.isValid ({ 'custom-rules-filename': null, rules: {} }).should.equal (true);

		done ();
	});

	it ('isFormatDeprecated() should correctly classify a deprecated config format', function (done) {
		configInspector.isFormatDeprecated ({ rules: {a: true} }).should.equal (true);
		configInspector.isFormatDeprecated ({ rules: {a: false} }).should.equal (true);
		configInspector.isFormatDeprecated ({ rules: {a: false, b: true, c: true} }).should.equal (true);
		configInspector.isFormatDeprecated ({ rules: {a: false}, options: {} }).should.equal (true);
		configInspector.isFormatDeprecated ({ rules: {a: true}, options: {autofix: true} }).should.equal (true);

		configInspector.isFormatDeprecated ({ 'custom-rules-filename': 'koala' }).should.equal (true);
		configInspector.isFormatDeprecated ({ 'custom-rules-filename': 'koala', rules: {} }).should.equal (true);
		configInspector.isFormatDeprecated ({ 'custom-rules-filename': 'koala', rules: {a: true} }).should.equal (true);
		configInspector.isFormatDeprecated ({ 'custom-rules-filename': null }).should.equal (true);
		configInspector.isFormatDeprecated ({ 'custom-rules-filename': null, rules: {a: true} }).should.equal (true);

		done ();
	});

	it ('isFormatDeprecated() should correctly classify a non-deprecated config format', function (done) {
		configInspector.isFormatDeprecated ({ rules: {} }).should.equal (false);
		configInspector.isFormatDeprecated ({ rules: {}, options: {} }).should.equal (false);
		configInspector.isFormatDeprecated ({ rules: {}, options: {autofix: true} }).should.equal (false);
		configInspector.isFormatDeprecated ({ extends: 'helloworld' }).should.equal (false);
		configInspector.isFormatDeprecated ({ rules: {}, extends: 'jon-snow' }).should.equal (false);
		configInspector.isFormatDeprecated ({ rules: { abc: [1] }, extends: 'mowgli' }).should.equal (false);
		configInspector.isFormatDeprecated ({ rules: { abc: 2 } }).should.equal (false);
		configInspector.isFormatDeprecated ({ rules: { abc: 'off' } }).should.equal (false);
		configInspector.isFormatDeprecated ({ rules: { abc: 'off', bcd: 'warning', cde: 'error' } }).should.equal (false);
		configInspector.isFormatDeprecated ({ rules: { abc: 2, bcd: ['error', 100] } }).should.equal (false);
		configInspector.isFormatDeprecated ({ rules: { abc: 2, bcd: ['error', 100] }, extends: 'jellyfish' }).should.equal (false);

		done ();
	});

});