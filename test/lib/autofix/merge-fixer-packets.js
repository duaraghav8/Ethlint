/**
 * @fileoverview Tests for autofix/merge-fixer-packets.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


let mfp = require("../../../lib/autofix/merge-fixer-packets"),
    ruleFixer = require("../../../lib/autofix/rule-fixer");


describe("check exposed API", function() {

    it("should expose a single function", function(done) {
        mfp.should.be.type("function");
        done();
    });

    it("should handle all valid inputs", function(done) {
        let sourceCode = "abcdefghijklmnopqrstuvwxyz?<>,.!~",
            codeModification = "123d@@@efgh+++lop===qr$$$stuvwz*###";	// 'abc' in start & '!~' in end are left out as-it-is
        let rf = new ruleFixer("code");

        // fixerPackets represent the outputs of the functions exposed by rule-fixer
        // when a particular node & text are provided
        let fixerPackets = [
            rf.insertTextAfter({type: "a", start: 0, end: 3}, "123"),
            rf.insertTextBefore({type: "a", start: 4, end: 6}, "@@@"),
            rf.replaceText({type: "a", start: 8, end: 11}, "+++"),
            rf.remove({type: "a", start: 12, end: 14}),
            rf.insertTextAfterRange([15, 16], "==="),
            rf.insertTextBeforeRange([18, 22], "$$$"),
            rf.removeRange([23, 25]),
            rf.replaceChar(26, "*"),
            rf.replaceTextRange([27, 31], "###")
        ];

        // Send a single packet as object, should be returned as-it-is
        let result = mfp(fixerPackets [0], sourceCode);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(fixerPackets [0].range [0]);
        result.range [1].should.equal(fixerPackets [0].range [1]);
        result.text.should.equal(fixerPackets [0].text);

        // Send a single packet as item of array, should return the packet itself
        result = mfp(fixerPackets.slice(0, 1), sourceCode);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(fixerPackets [0].range [0]);
        result.range [1].should.equal(fixerPackets [0].range [1]);
        result.text.should.equal(fixerPackets [0].text);

        // Send a list of (shuffled) packets, should return 1 final packet that
        // ranges from start to end, accounting for all text changes
        result = mfp(fixerPackets, sourceCode);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(fixerPackets [0].range [0]);
        result.range [1].should.equal(fixerPackets.slice(-1) [0].range [1]);
        result.text.should.equal(codeModification);

        done();
    });

    it("should handle all logically invalid inputs", function(done) {
        // Since merge-fixer-packets is a module called internally, it is guaranteed to receive a
        // valid fixer packet or array of packets. Therefore we need not test it for all the fuzzy values.
		
        // overlapping ranges
        mfp.bind(
            mfp, [{range: [2, 5], text: ""}, {range: [4, 8], text: "%%%"}], "abcdefghijk"
        ).should.throw();

        done();
    });

});
