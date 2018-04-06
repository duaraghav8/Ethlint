/**
 * @fileoverview Ensure that experimental features are not used in production
 * @author Ivan Mushketyk <ivan.mushketik@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that experimental features are not used in production"
        },

        schema: []
    },

    create: function(context) {

        function inspectExperimentalPragmaStatement(emitted) {
            if (emitted.exit) {
                return;
            }

            return context.report({
                node: emitted.node,
                message: "Experimental features should not be used in production"
            });
        }

        return {
            ExperimentalPragmaStatement: inspectExperimentalPragmaStatement
        };
    }
};
