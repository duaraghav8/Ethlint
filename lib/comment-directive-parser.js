/**
 * @fileoverview Analyzes the given comment token stream for configuration directives
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const astUtils = require("./utils/ast-utils");

/**
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
            throw new Error("Rule name should be a non-empty string.");
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

    _removeRulesFromLineConfig(line, rules) {
        if (rules === this.ALL_RULES) {
            // delete disabled-rule configuration for this line, since all rules
            // are to be enabled.
            delete this.lineConfigurations[line];
            return;
        }

        /**
         * A special case arises when the user has disabled all rules
         * and then wants to enable a select few. When all rules are disabled,
         * the configuration for a line is set to `all`. This means there is no
         * array of rules to delete the enabled ones from.
         *
         * Right now, this edge case is not accounted for. In the below example,
         * `throw;` will not be reported, which goes against expectations.
         *
         * contract Foo {
         *   // solium-disable
         *   function b11d() {
         *     // solium-enable security/no-throw
         *     throw;
         *   }
         * }
         *
         * TODO: Account for this edge case.
         */
        if (this.lineConfigurations[line] === this.ALL_RULES) {
            return;
        }

        // Delete rules from line's disabled-rule configuration list
        this.lineConfigurations[line] = this.lineConfigurations[line].filter(lc => { return !rules.includes(lc); });
    }

    _constructLineConfigurationFromComment(token) {
        const text = this._cleanCommentText(token.text);
        const S = "solium", SD = `${S}-disable`, SDL = `${SD}-line`,
            SDNL = `${SD}-next-line`, SDPL = `${SD}-previous-line`, SE = `${S}-enable`;

        // Important that we check for SDNL, SDPL & SDL first. If they exist, then includes() will return true for SD anyway.
        if (text.includes(SDL)) {
            return this._addRulesToLineConfig(astUtils.getLine(token), this._parseRuleNames(text, SDL));
        }

        if (text.includes(SDPL)) {
            const targetLine = astUtils.getLine(token) - 1;

            // SDPL shouldn't be used on first line of the file.
            if (targetLine < 1) {
                throw new Error(`Comment directive "${SDPL}" refers to an invalid line number.`);
            }

            return this._addRulesToLineConfig(targetLine, this._parseRuleNames(text, SDPL));
        }

        // Notice how we use getEndingLine() for below directives to ensure that in case of a block
        // comment directive spanning over multiple lines, the disabling starts after the comment ends.
        // (SDL should disable on line on which the comment starts, so getLine() is used for it)
        if (text.includes(SDNL)) {
            return this._addRulesToLineConfig(astUtils.getEndingLine(token) + 1, this._parseRuleNames(text, SDNL));
        }

        if (text.includes(SD)) {
            const currLine = astUtils.getEndingLine(token), rulesToDisable = this._parseRuleNames(text, SD);
            const objContext = this;

            // Disable rules for all lines below the SD comment directive
            this._toEndOfFile(
                currLine + 1,
                lineNum => { objContext._addRulesToLineConfig(lineNum, rulesToDisable); }
            );
        }

        if (text.includes(SE)) {
            const currLine = astUtils.getEndingLine(token), rulesToEnable = this._parseRuleNames(text, SE);
            const objContext = this;

            // Remove disabled-rule entries for all lines below the SE comment directive
            this._toEndOfFile(
                currLine + 1,
                lineNum => { objContext._removeRulesFromLineConfig(lineNum, rulesToEnable); }
            );
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
