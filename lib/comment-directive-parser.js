/**
 * @fileoverview Analyzes the given comment token stream for solium configurtion directives
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const astUtils = require("./utils/ast-utils");

/**
 * Parser can currently detect configuration to
 * - Disable linting on the next line
 * - Disable linting on the current line
 * - Disable linting on entire file
 * (all rules or specific ones (comma-separated))
 * NOTE: Constructor & Public functions of this class should have argument validations
 */
class CommentDirectiveParser {

    constructor(commentTokens, AST) {
        if (!Array.isArray(commentTokens)) {
            throw new Error("First argument should be an array of comment tokens.");
        }

        // AST gets validated by astUtils.getEndingLine(), no need to explicitly validate it here
        this.lastLine = astUtils.getEndingLine(AST); // relies on astUtils.init(code) being called before it
        this.commentTokens = commentTokens;
        this.lineConfigurations = {};   // mapping: line => list of rules to disable on line (Array / this.ALL_RULES)
        this.ALL_RULES = "all";

        this._constructLineConfigurations();
    }

    // Check if, for a given line, there is any rule disabling configuration present
    // and if yes, determine whether a specific rule is enabled on the line or not.
    isRuleEnabledOnLine(ruleName, line) {
        // Need not ensure that line > this.lastLine. This func's purpose is only to determine whether
        // given rule is disabled on given line, regardless of whether line is within bounds or not.
        if (typeof ruleName !== "string" || ruleName.length < 1) {
            throw new Error("Rule name should be a non-empty string string.");
        }

        if (!Number.isInteger(line) || line < 1) {
            throw new Error("Line number should be a positive integer.");
        }

        // entry can be undefined because we only record config for the lines which have any comment configuration.
        const entry = this.lineConfigurations[line] || "";
        return (entry !== this.ALL_RULES && !entry.includes(ruleName));
    }

    _constructLineConfigurations() {
        this.commentTokens.forEach(token => {
            this._constructLineConfigurationFromComment(token);
        });
    }

    _addRulesToLineConfig(line, rules) {
        // If line configuration is "all", then we've already covered all rules.
        // No need to add any more to list.
        if (this.lineConfigurations[line] === this.ALL_RULES) {
            return;
        }

        if (rules === this.ALL_RULES) {
            // set line config to "all" to cover all rules regardless of
            // whether it was previously undefined or a set of rules
            this.lineConfigurations[line] = this.ALL_RULES;
            return;
        }

        // If line config is undefined, assign array of rule names.
        // If array already exists, append the new rules list to it.
        this.lineConfigurations[line] = (this.lineConfigurations[line] || []).concat(rules);
    }

    _constructLineConfigurationFromComment(token) {
        const SD = "solium-disable", SDL = `${SD}-line`,
            SDNL = `${SD}-next-line`, text = this._cleanCommentText(token.text);

        // Important that we check for SDNL & SDL first. If they exist, then includes() will return true for SD anyway.
        if (text.includes(SDL)) {
            return this._addRulesToLineConfig(astUtils.getLine(token), this._parseRuleNames(text, SDL));
        }

        // Notice how we use getEndingLine() for SDNL & SD to ensure that in case of block
        // comment directive spanning over multiple lines, the disabling starts after the comment ends.
        // (SDL should disable on line on which the comment starts, so getLine() is used for it)
        if (text.includes(SDNL)) {
            return this._addRulesToLineConfig(astUtils.getEndingLine(token) + 1, this._parseRuleNames(text, SDNL));
        }

        if (text.includes(SD)) {
            const currLine = astUtils.getEndingLine(token), rulesToDisable = this._parseRuleNames(text, SD);
            const objContext = this;

            // Set desired configuration for all lines below the SD comment directive
            this._toEndOfFile(
                currLine + 1, lineNum => { objContext._addRulesToLineConfig(lineNum, rulesToDisable); });
        }

        // If none of the above branches were executed, then the current comment is not a solium directive.
    }

    // Remove all comment-related syntax so we only have configuration string + whitespace
    _cleanCommentText(text) {
        return text.replace("//", "").replace("/*", "").replace("*/", "");
    }

    // If the directive is followed by a list of rule names, extract them into Array.
    // If not, it means all rules must be disabled for the line(s) covered by that directive.
    _parseRuleNames(text, prefixToRemove) {
        text = text.replace(prefixToRemove, "");
        const rulesToDisable = text
            .split(",")
            .map(r => r.trim())
            .filter(r => r.length > 0);

        return rulesToDisable.length > 0 ? rulesToDisable : this.ALL_RULES;
    }

    // Performs the given action (callback) from the given line no. to last line of source code.
    _toEndOfFile(from, action) {
        for (let i = from; i <= this.lastLine; i++) {
            action(i);
        }
    }

}


module.exports = CommentDirectiveParser;
