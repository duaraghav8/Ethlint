"use strict";

const eol = require("eol");

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "This rule changes the EOL of the codebase as per config"
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

            context.report({
                node: node,
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

