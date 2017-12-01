/**
 * @fileoverview Tests for lib/autofix/rule-fixer.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let rf = require("../../../lib/autofix/rule-fixer");
let RuleFixer, sampleRange = [5, 19];

// gets updated when a function is added/deleted in rulefixer API
let listOfFunctions = [
    "insertTextAfter", "insertTextBefore", "insertTextAt", "remove", "replaceText",
    "insertTextAfterRange", "insertTextBeforeRange", "removeRange", "replaceChar", "replaceTextRange"
];

let node = {
    type: "Literal",
    start: 19,
    end: 32
};

describe("Test the rule-fixer API", function() {

    it("should expose a constructor that creates a RuleFixer Object", function(done) {
        rf.should.be.type("function");

        RuleFixer = new rf("code");

        RuleFixer.should.be.type("object");
        RuleFixer.constructor.name.should.equal("RuleFixer");
        Object.keys(RuleFixer).length.should.equal(10);	// gets changed every time a function is added/deleted

        // Check methods exposed
        listOfFunctions.forEach(function(fName) {
            RuleFixer.should.have.ownProperty(fName);
            RuleFixer [fName].should.be.type("function");
        });

        done();
    });

    it("should handle all valid inputs for all the functions", function(done) {
        let result, sampleText = "hello";

        // since RuleFixer.insertTextAt() is internally called by a lot of API functions,
        // it gets tested with them. So no need to explicitly test it here.

        result = RuleFixer.insertTextAfter(node, sampleText);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(node.end);
        result.range [1].should.equal(node.end);
        result.text.should.equal(sampleText);

        result = RuleFixer.insertTextBefore(node, sampleText);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(node.start);
        result.range [1].should.equal(node.start);
        result.text.should.equal(sampleText);

        result = RuleFixer.remove(node);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(node.start);
        result.range [1].should.equal(node.end);
        result.text.should.be.empty();

        result = RuleFixer.replaceText(node, sampleText);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(node.start);
        result.range [1].should.equal(node.end);
        result.text.should.equal(sampleText);

        result = RuleFixer.insertTextAfterRange(sampleRange, sampleText);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(sampleRange [1]);
        result.range [1].should.equal(sampleRange [1]);
        result.text.should.equal(sampleText);

        result = RuleFixer.insertTextBeforeRange(sampleRange, sampleText);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(sampleRange [0]);
        result.range [1].should.equal(sampleRange [0]);
        result.text.should.equal(sampleText);

        result = RuleFixer.removeRange(sampleRange, sampleText);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(sampleRange [0]);
        result.range [1].should.equal(sampleRange [1]);
        result.text.should.be.empty();

        result = RuleFixer.replaceChar(sampleRange [0], sampleText [0]);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(sampleRange [0]);
        result.range [1].should.equal(sampleRange [0] + 1);
        result.text.should.equal(sampleText [0]);

        result = RuleFixer.replaceTextRange(sampleRange, sampleText);
        result.should.be.type("object");
        result.should.have.ownProperty("range");
        result.should.have.ownProperty("text");
        result.range.should.be.Array();
        result.range.length.should.equal(2);
        result.range [0].should.equal(sampleRange [0]);
        result.range [1].should.equal(sampleRange [1]);
        result.text.should.equal(sampleText);

        done();
    });

    it("should handle all invalid inputs for all the functions", function(done) {
        RuleFixer.insertTextAfter.bind(RuleFixer, undefined, "hello").should.throw();
        RuleFixer.insertTextAfter.bind(RuleFixer, null, "hello").should.throw();
        RuleFixer.insertTextAfter.bind(RuleFixer, 109, "hello").should.throw();
        RuleFixer.insertTextAfter.bind(RuleFixer, {}, "hello").should.throw();
        RuleFixer.insertTextAfter.bind(RuleFixer, "node", "hello").should.throw();

        RuleFixer.insertTextAfter.bind(RuleFixer, node, undefined).should.throw();
        RuleFixer.insertTextAfter.bind(RuleFixer, node, null).should.throw();
        RuleFixer.insertTextAfter.bind(RuleFixer, node, 109).should.throw();
        RuleFixer.insertTextAfter.bind(RuleFixer, node, {}).should.throw();
        RuleFixer.insertTextAfter.bind(RuleFixer, node, node).should.throw();

        RuleFixer.insertTextAfter.bind(RuleFixer, node, "hello").should.not.throw();

        /*****************************************************************************/

        RuleFixer.insertTextBefore.bind(RuleFixer, undefined, "hello").should.throw();
        RuleFixer.insertTextBefore.bind(RuleFixer, null, "hello").should.throw();
        RuleFixer.insertTextBefore.bind(RuleFixer, 109, "hello").should.throw();
        RuleFixer.insertTextBefore.bind(RuleFixer, {}, "hello").should.throw();
        RuleFixer.insertTextBefore.bind(RuleFixer, "node", "hello").should.throw();

        RuleFixer.insertTextBefore.bind(RuleFixer, node, undefined).should.throw();
        RuleFixer.insertTextBefore.bind(RuleFixer, node, null).should.throw();
        RuleFixer.insertTextBefore.bind(RuleFixer, node, 109).should.throw();
        RuleFixer.insertTextBefore.bind(RuleFixer, node, {}).should.throw();
        RuleFixer.insertTextBefore.bind(RuleFixer, node, node).should.throw();

        RuleFixer.insertTextBefore.bind(RuleFixer, node, "hello").should.not.throw();

        /*****************************************************************************/

        RuleFixer.replaceText.bind(RuleFixer, undefined, "hello").should.throw();
        RuleFixer.replaceText.bind(RuleFixer, null, "hello").should.throw();
        RuleFixer.replaceText.bind(RuleFixer, 109, "hello").should.throw();
        RuleFixer.replaceText.bind(RuleFixer, {}, "hello").should.throw();
        RuleFixer.replaceText.bind(RuleFixer, "node", "hello").should.throw();

        RuleFixer.replaceText.bind(RuleFixer, node, undefined).should.throw();
        RuleFixer.replaceText.bind(RuleFixer, node, null).should.throw();
        RuleFixer.replaceText.bind(RuleFixer, node, 109).should.throw();
        RuleFixer.replaceText.bind(RuleFixer, node, {}).should.throw();
        RuleFixer.replaceText.bind(RuleFixer, node, node).should.throw();

        RuleFixer.replaceText.bind(RuleFixer, node, "hello").should.not.throw();

        /*****************************************************************************/

        RuleFixer.remove.bind(RuleFixer, undefined).should.throw();
        RuleFixer.remove.bind(RuleFixer, null).should.throw();
        RuleFixer.remove.bind(RuleFixer, 109).should.throw();
        RuleFixer.remove.bind(RuleFixer, {}).should.throw();
        RuleFixer.remove.bind(RuleFixer, "node").should.throw();

        RuleFixer.remove.bind(RuleFixer, node).should.not.throw();

        /*****************************************************************************/

        RuleFixer.insertTextAfterRange.bind(RuleFixer, undefined, "hello").should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, null, "hello").should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, 109, "hello").should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, {}, "hello").should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, "range", "hello").should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, [], "hello").should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, [1], "hello").should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, [-1, -293], "hello").should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, [18.289, 8917.21], "hello").should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, [1, 2, 3], "hello").should.throw();

        RuleFixer.insertTextAfterRange.bind(RuleFixer, sampleRange, undefined).should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, sampleRange, null).should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, sampleRange, 109).should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, sampleRange, {}).should.throw();
        RuleFixer.insertTextAfterRange.bind(RuleFixer, sampleRange, node).should.throw();

        RuleFixer.insertTextAfterRange.bind(RuleFixer, sampleRange, "hello").should.not.throw();

        /*****************************************************************************/

        RuleFixer.insertTextBeforeRange.bind(RuleFixer, undefined, "hello").should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, null, "hello").should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, 109, "hello").should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, {}, "hello").should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, "range", "hello").should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, [], "hello").should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, [1], "hello").should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, [-1, -293], "hello").should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, [18.289, 8917.21], "hello").should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, [1, 2, 3], "hello").should.throw();

        RuleFixer.insertTextBeforeRange.bind(RuleFixer, sampleRange, undefined).should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, sampleRange, null).should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, sampleRange, 109).should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, sampleRange, {}).should.throw();
        RuleFixer.insertTextBeforeRange.bind(RuleFixer, sampleRange, node).should.throw();

        RuleFixer.insertTextBeforeRange.bind(RuleFixer, sampleRange, "hello").should.not.throw();

        /*****************************************************************************/

        RuleFixer.replaceTextRange.bind(RuleFixer, undefined, "hello").should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, null, "hello").should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, 109, "hello").should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, {}, "hello").should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, "range", "hello").should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, [], "hello").should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, [1], "hello").should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, [-1, -293], "hello").should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, [18.289, 8917.21], "hello").should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, [1, 2, 3], "hello").should.throw();

        RuleFixer.replaceTextRange.bind(RuleFixer, sampleRange, undefined).should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, sampleRange, null).should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, sampleRange, 109).should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, sampleRange, {}).should.throw();
        RuleFixer.replaceTextRange.bind(RuleFixer, sampleRange, node).should.throw();

        RuleFixer.replaceTextRange.bind(RuleFixer, sampleRange, "hello").should.not.throw();

        /*****************************************************************************/

        RuleFixer.removeRange.bind(RuleFixer, undefined).should.throw();
        RuleFixer.removeRange.bind(RuleFixer, null).should.throw();
        RuleFixer.removeRange.bind(RuleFixer, 109).should.throw();
        RuleFixer.removeRange.bind(RuleFixer, {}).should.throw();
        RuleFixer.removeRange.bind(RuleFixer, "range").should.throw();
        RuleFixer.removeRange.bind(RuleFixer, []).should.throw();
        RuleFixer.removeRange.bind(RuleFixer, [1]).should.throw();
        RuleFixer.removeRange.bind(RuleFixer, [-1, -293]).should.throw();
        RuleFixer.removeRange.bind(RuleFixer, [18.289, 8917.21]).should.throw();
        RuleFixer.removeRange.bind(RuleFixer, [1, 2, 3]).should.throw();

        RuleFixer.removeRange.bind(RuleFixer, sampleRange).should.not.throw();

        /*****************************************************************************/

        RuleFixer.replaceChar.bind(RuleFixer, undefined, "a").should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, null, "a").should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, 1.289, "a").should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, {}, "a").should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, "range", "a").should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, [], "a").should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, [1], "a").should.throw();

        RuleFixer.replaceChar.bind(RuleFixer, 2, undefined).should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, 2, null).should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, 2, 1.289).should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, 2, {}).should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, 2, "ch").should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, 2, []).should.throw();
        RuleFixer.replaceChar.bind(RuleFixer, 2, [1]).should.throw();

        RuleFixer.replaceChar.bind(RuleFixer, 2, " ").should.not.throw();

        /*****************************************************************************/

        done();
    });

});