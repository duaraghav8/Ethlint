/**
 * @fileoverview Utility functions to wrap solidity snippets with pragma, contract and/or 
 * function code so they can be passed to solidity-parser without erroring. These allow
 * the test cases to be presented in an easily legible form. 
 * @author cgewecke <christophergewecke@gmail.com>
 */

"use strict";

module.exports = {
    /**
     * Wrap a solidity statement in valid contract boilerplate. 
     * @param  {String} code Solidity snippet to wrap
     * @return {String}      wrapped snippet
     */
    toContract: function(code) {
        let pre = "pragma solidity ^0.4.3;\n\n\ncontract Wrap {\n\t";
        let post = "\n}";
        return pre + code + post;
    },

    /**
     * Wrap a solidity statement in valid contract and function boilerplate. 
     * @param  {String} code Solidity snippet
     * @return {String}      wrapped snippet
     */
    toFunction: function(code) {
        let pre = "pragma solidity ^0.4.3;\n\n\ncontract Wrap {\n\tfunction wrap() {\n\t\t";
        let post = "\n\t}\n}";
        return pre + code + post;
    },

    /**
     * Prepend solidity contract / library with a pragma statement 
     * @param  {String} code Solidity snippet
     * @return {String}      snippet with pragma statement.
     */
    addPragma: function(code) {
        let pre = "pragma solidity ^0.4.3;\n\n\n";
        return pre + code;
    }
};