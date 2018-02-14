/**
 * @fileoverview Utility functions to wrap solidity snippets with pragma, contract and/or 
 * function code so they can be passed to solidity-parser without erroring. These allow
 * the test cases to be presented in an easily legible form. 
 * @author cgewecke <christophergewecke@gmail.com>
 */

"use strict";

const { EOL } = require("os");

module.exports = {
    /**
     * Wrap a solidity statement in valid contract boilerplate. 
     * @param  {String} code Solidity snippet to wrap
     * @return {String}      wrapped snippet
     */
    toContract: function(code) {
        let pre = `pragma solidity ^0.4.3;${EOL.repeat(3)}contract Wrap {${EOL}\t`;
        let post = `${EOL}}`;
        return pre + code + post;
    },

    /**
     * Wrap a solidity statement in valid contract and function boilerplate. 
     * @param  {String} code Solidity snippet
     * @return {String}      wrapped snippet
     */
    toFunction: function(code) {
        let pre = `pragma solidity ^0.4.3;${EOL.repeat(3)}contract Wrap {${EOL}\tfunction wrap() {${EOL}\t\t`;
        let post = `${EOL}\t}${EOL}}`;
        return pre + code + post;
    },

    /**
     * Prepend solidity contract / library with a pragma statement 
     * @param  {String} code Solidity snippet
     * @return {String}      snippet with pragma statement.
     */
    addPragma: function(code) {
        let pre = `pragma solidity ^0.4.3;${EOL.repeat(3)}`;
        return pre + code;
    }
};