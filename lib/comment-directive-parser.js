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
 */
class CommentDirectiveParser {

    constructor(commentTokens, AST) {
        this.lastLine = astUtils.getEndingLine(AST);
        this.commentTokens = commentTokens;
        this.lineConfigurations = {};   // mapping: line => list of rules to disable on line (Array / "all")

        this._constructLineConfigurations();
    }

    // Check if, for a given line, there is any rule disabling configuration present
    // and if yes, determine whether a specific rule is enabled on the line or not.
    isRuleEnabledOnLine(ruleName, line) {
        // entry can be undefined because we only record config for the lines which have any comment configuration.
        const entry = this.lineConfigurations[line] || "";
        return (entry !== "all" && !entry.includes(ruleName));
    }

    _constructLineConfigurations() {
        this.commentTokens.forEach(token => {
            this._constructLineConfigurationFromComment(token);
        });
    }

    _constructLineConfigurationFromComment(token) {
        const SD = "solium-disable", SDL = `${SD}-line`,
            SDNL = `${SD}-next-line`, text = this._cleanCommentText(token.text);

        // Important that we check for SDNL & SDL first. If they exist, then includes() will return true for SD anyway.
        if (text.includes(SDL)) {
            this.lineConfigurations[astUtils.getLine(token)] = this._parseRuleNames(text, SDL);
            return;
        }

        if (text.includes(SDNL)) {
            this.lineConfigurations[astUtils.getLine(token) + 1] = this._parseRuleNames(text, SDNL);
            return;
        }

        if (text.includes(SD)) {
            const currLine = astUtils.getLine(token), rulesToDisable = this._parseRuleNames(text, SD);

            // Set desired configuration for all lines below the SD comment directive
            this._toEndOfFile(
                currLine + 1, lineNum => { this.lineConfigurations[lineNum] = rulesToDisable; });
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

        return rulesToDisable.length > 0 ? rulesToDisable : "all";
    }

    // Performs the given action (callback) from the given line no. to last line of source code.
    _toEndOfFile(from, action) {
        if (typeof action !== "function") {
            return;
        }

        for (let i = from; i <= this.lastLine; i++) { action(i); }
    }

}


module.exports = CommentDirectiveParser;
