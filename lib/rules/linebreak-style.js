"use strict";

const eol = require("eol");

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "error", // 'warning' | 'error' | 'off'
            description:
                                "This rule changes the EOL of the codebase as per config"
        },
        schema: [
            {
                type: "string",
                enum: ["unix", "windows"]
            }
        ],
        fixable: "whitespace"
    },

    create: function(context) {
        const sourceCode = context.getSourceCode();
        let convertFn = eol.lf.bind(eol);
        if (context.options && context.options[0] === "windows") {
            convertFn = eol.crlf.bind(eol);
        }

        function inspectAll(emitted) {
            let node = emitted.node;
            let txt = sourceCode.getText();
            let convertedTxt = convertFn(txt);

            if (emitted.exit || convertedTxt === txt) {
                return;
            }

            context.report({
                node: node,
                fix: function(fixer) {
                    return fixer.replaceText(
                        node,
                        convertedTxt
                    );
                },
                message: "Error! Inconsistent Line breaks!"
            });
        }

        return {
            Program: inspectAll
        };
    }
};

