/**
 * @fileoverview Tests for lib/comment-directive-parser.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const solidityParser = require("solparse"),
    CommentDirectiveParser = require("../../lib/comment-directive-parser");

const code = `
// hello world
contract foo {
    /* hello world */
}
`;
const AST = solidityParser.parse(code, { comment: true });


describe("comment-directive-parser", () => {

    it("should expose a class to create CDP objects", done => {
        function shouldThrow(f, msg) {
            try { f(); } catch (e) { e.message.should.equal(msg); }
        }

        CommentDirectiveParser.should.be.type("function");

        const minimalAST = { type: "Program", start: 0, end: 1 };
        const myCdp = new CommentDirectiveParser([], minimalAST);
        const invalidArgError = "First argument should be an array of comment tokens.";

        (myCdp instanceof CommentDirectiveParser).should.be.true();
        myCdp.should.have.size(4);  // changes when properties are added/removed
        myCdp.should.have.ownProperty("lastLine");
        myCdp.should.have.ownProperty("commentTokens");
        myCdp.should.have.ownProperty("lineConfigurations");
        myCdp.should.have.ownProperty("ALL_RULES");


        const invalidTokens = [, undefined, null, {}, 1, 90, "", 1.83, 0, -1892, true, false, ()=>{}];

        invalidTokens.forEach(t => {
            shouldThrow(() => {new CommentDirectiveParser(t, minimalAST);}, invalidArgError);
        });

        // Just check that AST validation is working, no need for extensive testing
        shouldThrow(() => {new CommentDirectiveParser([], null);}, "getEndingLine(): null is not a valid AST node.");

        done();
    });

    it("should expose a set of methods via the CDP object", done => {
        const cdp = new CommentDirectiveParser(AST.comments, AST);

        cdp.isRuleEnabledOnLine.should.be.type("function");
        cdp._constructLineConfigurations.should.be.type("function");
        cdp._addRulesToLineConfig.should.be.type("function");
        cdp._constructLineConfigurationFromComment.should.be.type("function");
        cdp._cleanCommentText.should.be.type("function");
        cdp._parseRuleNames.should.be.type("function");
        cdp._toEndOfFile.should.be.type("function");

        done();
    });

    it("should throw when calling isRuleEnabledOnLine() with invalid args", done => {
        const cdp = new CommentDirectiveParser(AST.comments, AST);
        const badRuleNames = [, undefined, null, {}, [], 1, 90, "", 1.83, 0, -1892, true, false, ()=>{}],
            badLineNumbers = [, undefined, null, {}, [], "h", "", 1.83, 0, -1892, true, false, ()=>{}];

        badRuleNames.forEach(r => {
            cdp.isRuleEnabledOnLine.bind(
                cdp, r, 1).should.throw("Rule name should be a non-empty string string.");
        });

        badLineNumbers.forEach(l => {
            cdp.isRuleEnabledOnLine.bind(
                cdp, "rule", l).should.throw("Line number should be a positive integer.");
        });

        done();
    });

    it("should work as expected when calling private utility functions", done => {
        const cdp = new CommentDirectiveParser(AST.comments, AST);
        const texts = [
            ["///////", "/////"],
            ["//", ""],
            ["//\t", "\t"],
            ["//hello world", "hello world"],
            ["//  foobar", "  foobar"],
            ["//baz////", "baz////"],
            ["/*****/", "***"],
            ["/**/", ""],
            ["/*\t\t*/", "\t\t"],
            ["/*hello world*/", "hello world"],
            ["/*  foobar   */", "  foobar   "],
            ["/*hello\n\n@author bro<hello@world.com>\n\n*/", "hello\n\n@author bro<hello@world.com>\n\n"],

            ["// solium-disable", " solium-disable"],
            ["// solium-disable pragma-on-top, indentation", " solium-disable pragma-on-top, indentation"],
            ["// solium-disable foorule", " solium-disable foorule"],
            ["// solium-disable-line", " solium-disable-line"],
            ["// solium-disable-line pragma-on-top, indentation", " solium-disable-line pragma-on-top, indentation"],
            ["// solium-disable-line foorule", " solium-disable-line foorule"],
            ["/* solium-disable*/", " solium-disable"],
            ["/* solium-disable pragma-on-top, indentation*/", " solium-disable pragma-on-top, indentation"],
            ["/* solium-disable foorule*/", " solium-disable foorule"],
            ["/* solium-disable-line*/", " solium-disable-line"],
            ["/* solium-disable-line pragma-on-top, indentation*/", " solium-disable-line pragma-on-top, indentation"],
            ["/* solium-disable-line foorule*/", " solium-disable-line foorule"]
        ];

        texts.forEach(([dirty, clean]) => {
            cdp._cleanCommentText(dirty).should.equal(clean);
        });


        const ruleCodes = [
            ["  \tsolium-disable\t  ", "all", "solium-disable"],
            ["  \tsolium-disable pragma-on-top,   indentation", "pragma-on-top,indentation", "solium-disable"],
            ["  \tsolium-disable  \tfoorule", "foorule", "solium-disable"],
            ["  \tsolium-disable-line", "all", "solium-disable-line"],
            ["  \tsolium-disable-line   pragma-on-top\t,  indentation", "pragma-on-top,indentation", "solium-disable-line"],
            ["  \tsolium-disable-line foorule", "foorule", "solium-disable-line"],
            ["  \tsolium-disable-next-line", "all", "solium-disable-next-line"],
            ["  \tsolium-disable-next-line   pragma-on-top\t,  indentation", "pragma-on-top,indentation", "solium-disable-next-line"],
            ["  \tsolium-disable-next-line foorule", "foorule", "solium-disable-next-line"],
            ["  \tsolium-disable", "all", "solium-disable"],
            ["  \tsolium-disable pragma-on-top, indentation", "pragma-on-top,indentation", "solium-disable"],
            ["  \tsolium-disable foorule", "foorule", "solium-disable"],
            ["  \tsolium-disable-line", "all", "solium-disable-line"],
            ["  \tsolium-disable-line  pragma-on-top,\t\tindentation", "pragma-on-top,indentation", "solium-disable-line"],
            ["  \tsolium-disable-line foorule", "foorule", "solium-disable-line"]
        ];

        ruleCodes.forEach(([text, expectedOutput, p2r]) => {
            let rules = cdp._parseRuleNames(text, p2r);

            if (rules.constructor.name === "Array") {
                rules = rules.join();
            }

            rules.should.equal(expectedOutput);
        });


        let counter = 7;
        cdp.lastLine = 96;

        cdp._toEndOfFile(counter, currentLine => {
            currentLine.should.equal(counter++);
        });

        done();
    });

});
