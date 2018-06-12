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

    create: function(context) {
        let visibilityModifiers = ["public", "external", "internal", "private"];
        let nodesToWatch = {
            FunctionDeclaration: "function"
        };

        function createInspector(nodeDesc) {
            return function inspect(emitted) {
                let node = emitted.node;
                let modifiers = node.modifiers.map(m => m.name);

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
                            message:
                            nodeDesc +
                            " name '" +
                            node.name +
                            "' doesn't follow the function visibility modifier order."
                        });
                    }
                });
            };
        }

        return Object.keys(nodesToWatch).reduce(function(listeners, nodeName) {
            listeners[nodeName] = createInspector(nodesToWatch[nodeName]);
            return listeners;
        }, {});
    }
};
