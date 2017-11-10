/**
 * @fileoverview Tests for no-bit-operations rule
 * @author Beau Gunderson <beau@beaugunderson.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var wrappers = require ('../../../utils/wrappers');
var toContract = wrappers.toContract;

var userConfig = {
  "custom-rules-filename": null,
  "rules": {
    "no-bit-operations": true
  }
};

describe ('[RULE] no-bit-operations', function () {
  it ('should reject contracts using bit operations (in declaration)', function (done) {
    var code = toContract('function foo () { uint a = 2 >> 4; }'),

    errors = Solium.lint (code, userConfig);

    errors.constructor.name.should.equal ('Array');
    errors.length.should.equal(1);

    Solium.reset ();

    done ();
  });

  it ('should reject contracts using bit operations (in assignment)', function (done) {
    var code = toContract('function foo () { uint a = 2; a >>= 4; }');
    var errors = Solium.lint (code, userConfig);

    errors.constructor.name.should.equal ('Array');
    errors.length.should.equal(1);

    Solium.reset ();

    done ();
  });

  it ('should reject contracts using bit operations (in statements)', function (done) {
    var code = toContract('function foo () { if (2 >> 4) { } }'),

    errors = Solium.lint (code, userConfig);

    errors.constructor.name.should.equal ('Array');
    errors.length.should.equal(1);

    Solium.reset ();

    done ();
  });
});
