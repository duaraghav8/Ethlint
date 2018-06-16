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
            description: "Ensure that the visibility modifier for a function should come before any custom modifiers"
        },

        schema: []
    },

    create(context) {
        // Find index of the first visibility modifier in declaration.
        // Find the first non-VM before this first VM found above.
        // If non-VM found, report the VM.
        function inspectFD(emitted) {
            const { node } = emitted,
                visibilityModifiers = ["public", "external", "internal", "private"];
            const modifiers = (node.modifiers || []),
                firstVisibilityModifierIndex = modifiers.findIndex(m => visibilityModifiers.includes(m.name));

            // If no visibility modifiers exist in function declaration, exit now
            if (emitted.exit || firstVisibilityModifierIndex === -1) {
                return;
            }

            const firstNonVisModifBeforeFirstVisModif = modifiers.slice(0, firstVisibilityModifierIndex).find(m => !visibilityModifiers.includes(m.name));

            // TODO: Add fix() for this rule
            if (firstNonVisModifBeforeFirstVisModif) {
                const issue = {
                    node: modifiers[firstVisibilityModifierIndex],
                    message: `Visibility modifier "${modifiers[firstVisibilityModifierIndex].name}" should come before other modifiers.`
                };
                context.report(issue);
            }
        }

        return {
            FunctionDeclaration: inspectFD
        };
    }
};
