/**
 * @fileoverview Tests for test/utils/wrappers.js
 * @author cgewecke <christohergewecke@gmail.com>
 */

'use strict';

var wrappers = require ('../../utils/wrappers'),
    Solium = require ('../../../lib/solium');

var userConfig = {
    'custom-rules-filename': null,
    rules: {}
};

describe ('Test wrappers', function () {

    it ('should have a set of functions exposed as API', function (done) {
        
        wrappers.should.have.ownProperty ('toContract');
        wrappers.toContract.should.be.type ('function');

        wrappers.should.have.ownProperty ('toFunction');
        wrappers.toFunction.should.be.type ('function');

        wrappers.should.have.ownProperty ('addPragma');
        wrappers.toFunction.should.be.type ('function');

        done ();
    });

    it('toContract: should correctly wrap a solidity statement in contract code', function (done) {
        var toContract = wrappers.toContract;
        var statement = 'uint x = 1;'
        var expected = 
            'pragma solidity ^0.4.3;\n\n\n' +
            'contract Wrap {\n' +
            '\t' + statement + '\n' +
            '}';

        var errors = Solium.lint(expected, userConfig);
        errors.constructor.name.should.equal ('Array');
        errors.length.should.equal (0);
        toContract(statement).should.equal(expected);

        Solium.reset();
        done ();
    });

    it('toFunction: should correctly wrap a solidity statement in contract/function code', function (done) {
        var toFunction = wrappers.toFunction;
        var statement = 'uint x = 1;'
        var expected = 
            'pragma solidity ^0.4.3;\n\n\n' +
            'contract Wrap {\n' +
            '\tfunction wrap() {\n' + 
            '\t\t' + statement + '\n' +
            '\t}\n' +
            '}';

        var errors = Solium.lint(expected, userConfig);
        errors.constructor.name.should.equal ('Array');
        errors.length.should.equal (0);
        toFunction(statement).should.equal(expected);

        Solium.reset();
        done ();
    });

    it('addPragma: should correctly pre-pend a pragma statement to a solidity contract or library', function (done) {
        var addPragma = wrappers.addPragma;
        var contract = 'contract Abc { }'
        var expected = 'pragma solidity ^0.4.3;\n\n\n' + contract;
            
        var errors = Solium.lint(expected, userConfig);
        errors.constructor.name.should.equal ('Array');
        errors.length.should.equal (0);
        addPragma(contract).should.equal(expected);

        Solium.reset();
        done ();
    });
});