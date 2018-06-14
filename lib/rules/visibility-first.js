/**
 * @fileoverview Ensure that the visibility modifier for a function should come before any custom modifiers.
 * @author Harrison Beckerich <https://github.com/hbeckeri>
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description:
            "Ensure that the visibility modifier for a function should come before any custom modifiers"
        },

        schema: []
    },

    create(context) {
        function inspect(emitted) {
            const visibilityModifiers = ["public", "external", "internal", "private"];
            let node = emitted.node;
            let modifiers = (node.modifiers || []).map(m => m.name);

            if (emitted.exit) {
                return;
            }

            modifiers.forEach((m, index) => {
                if (!visibilityModifiers.includes(m)) {
                    return;
                }

                const misplacedModifier = modifiers
                    .slice(0, index)
                    .find(e => !visibilityModifiers.includes(e));

                if (misplacedModifier) {
                    context.report({
                        node: node,
                        message: `FunctionDeclaration name "${node.name}" doesn't follow the function visibility modifier order`
                    });
                }
            });
        }

        return { FunctionDeclaration: inspect };
    }
};
