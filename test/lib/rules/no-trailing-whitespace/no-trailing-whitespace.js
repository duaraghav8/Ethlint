/**
 * @fileoverview Tests for no-trailing-whitespace rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const Solium = require("../../../../lib/solium");

const config = {
    "rules": {
        "no-trailing-whitespace": "error"
    }
};


describe("[RULE] no-trailing-whitespace: Acceptances", () => {

    it("should accept lines having no trailing whitespaces", done => {
        const code = `

            contract Foo {
                // a comment
                function baz() returns(uint) {
                    /*
                        another happy comment
                        on multiple lines
                    */


                    callHelloWorld(
                        100, /* another block comment              */
                        "voila!",

                        0x1892873871198
                    );
                }
            }`;

        Solium.lint(code, config).should.be.empty();
        done();
    });

    it("should accept comments & blank lines with trailing whitespaces if they're ignored", done => {
        const configLocal = {
            "rules": {
                "no-trailing-whitespace": [
                    "error",
                    { "skipBlankLines": true, "ignoreComments": true }
                ]
            }
        };

        const code = `
                \t\t        \t
            contract Foo {
                // a comment         
                function baz() returns(uint) {
                    /* \t    
                        another happy comment 
                        on multiple lines\t
                    */
                                       
        \t                 \t                 
                    callHelloWorld(
                        100, /* another block comment              */
                        "voila!",
\t
                        0x1892873871198
                    );
                } // another line comment\t\t
                
                
                function /* hello */ bax() /* world */ returns(string) { /* this is a stretched    \t
                    comment */
                    return "hello";
                }
            }`;

        Solium.lint(code, configLocal).should.be.empty();
        done();
    });

});


describe("[RULE] no-trailing-whitespace: Rejections", () => {

    it("should reject code, comment & blank lines with trailing whitespaces", done => {
        const code = `
                \t\t        \t
            contract Foo { 
                // a comment         
                function baz() returns(uint) {
                    /* \t    
                        another happy comment 
                        on multiple lines\t
                    */   
                                       
        \t                 \t                 
                    callHelloWorld(
                        100, /* another block comment              */ 
                        "voila!",
\t
                        0x1892873871198\t
                    );
                } // another line comment\t\t
                
                
                function /* hello */ bax() /* world */ returns(string) { /* this is a stretched    \t
                    comment */
                    return "hello";
                }
            }`;

        Solium.lint(code, config).should.have.size(16);
        done();
    });

});
