/**
 * @fileoverview Tests for max-one-break-per-loop rule
 * @author Artem Litchmanov <artem.litchmanov@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium');
var wrappers = require ('../../../utils/wrappers');
var toFunction = wrappers.toFunction;

var userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "max-one-break-per-loop": true
    }
};

describe ('[RULE] max-one-break-per-loop: Acceptances', function () {

    it ('should accept all loops that have one or less breaks in them', function (done) {
        var code = [
            'for(uint i = 0; i<10; i++) {break;}',
            'for(uint i = 0; i < 10; i++) { uint x=1; }',
            'while(true) {break;}',
            'while(x!=1) { x=1; }',
            'do { foo (); } while (i < 20);',
            'do { break; } while (i < 20);',
            'if(1=1){break;} do { break; } while (i < 20);',
        ];
        var errors;

        code = code.map(function(item){return toFunction(item)});

        errors = Solium.lint (code [0], userConfig);
        errors.length.should.equal (0);
        errors = Solium.lint (code [1], userConfig);
        errors.length.should.equal (0);
        errors = Solium.lint (code [2], userConfig);
        errors.length.should.equal (0);
        errors = Solium.lint (code [3], userConfig);
        errors.length.should.equal (0);
        errors = Solium.lint (code [4], userConfig);
        errors.length.should.equal (0);
        errors = Solium.lint (code [5], userConfig);
        errors.length.should.equal (0);
        errors = Solium.lint (code [6], userConfig);
        errors.length.should.equal (0);
        Solium.reset ();
        done ();
    });
});


describe ('[RULE] max-one-break-per-loop: Rejections', function () {

    it ('should reject all loops that have two or more breaks in them', function (done) {
        var code = [
            'for(uint i = 0; i<10; i++) {break; break;}',
            'for(uint i = 0; i < 10; i++) { uint x=1; if(x=1){break;} if(x=2){break;} }',
            'while(true) {break;break;}',
            'while(x!=1) { x=1; if(x=1){break;} if(x=2){break;} if(x=3){break;} }',
            'do { break; break; } while (i < 20);',
            'do { if(x=1){break;} if(x=2){break;} if(x=3){break;} } while (i < 20);',
        ];
        var errors;

        code = code.map(function(item){return toFunction(item)});

        errors = Solium.lint (code [0], userConfig);
        errors.length.should.equal (1);
        errors = Solium.lint (code [1], userConfig);
        errors.length.should.equal (1);
        errors = Solium.lint (code [2], userConfig);
        errors.length.should.equal (1);
        errors = Solium.lint (code [3], userConfig);
        errors.length.should.equal (1);
        errors = Solium.lint (code [4], userConfig);
        errors.length.should.equal (1);
        errors = Solium.lint (code [5], userConfig);
        errors.length.should.equal (1);
        Solium.reset ();
        done ();
    });
});
