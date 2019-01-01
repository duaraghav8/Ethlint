/**
 * @fileoverview Ensure consistent linebreak style across codebase
 * @author Arjun Nemani <nemaniarjun@gmail.com>
 */

"use strict";

const eol = require("eol");

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "Ensure consistent linebreak style across codebase"
        },
        schema: [{
            type: "string",
            enum: ["unix", "windows"]
        }],
        fixable: "whitespace"
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        let convertFn = eol.lf.bind(eol);
        
        if (context.options && context.options[0] === "windows") {
            convertFn = eol.crlf.bind(eol);
        }

        function inspectProgram(emitted) {
            const { node } = emitted;
            const txt = sourceCode.getText();
            const convertedTxt = convertFn(txt);

            if (emitted.exit || convertedTxt === txt) {
                return;
            }

            // TODO: Report the exact row and column position at which the linebreak
            // violation occured. Still need to investigate the best way to calculate
            // the positions where LB is different from the expected.
            context.report({
                node,
                // TODO: solve issue #221
                // fix(fixer) {
                //     return fixer.replaceText(node, convertedTxt);
                // },
                message: "Inconsistent line-break style"
            });
        }

        return {
            Program: inspectProgram
        };
    }
};

