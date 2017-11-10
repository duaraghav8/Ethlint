/**
 * @fileoverview Flags any loops which contain two or more break statements
 * @author Artem Litchmanov <artem.litchmanov@gmail.com>
 */

'use strict';

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: 'error',
            description: 'Flag all loops which contain two or more break statements'
        },

        schema: []

    },

    create: function (context) {

        var allBreakStatementDeclarations = 0;

        function inspectBreakStatement(emitted) {

            if (!emitted.exit) {
                allBreakStatementDeclarations += 1;
            }
        }

        //While exiting for loop Node, Report if Break statement declarations is more than 1
        function inspectLoopStatement(emitted) {
            var node = emitted.node;
            if (emitted.exit) {
                if (allBreakStatementDeclarations > 1) {
                    context.report({
                        node: node,
                        message: 'Loop contains too many breaks.'
                    });
                }
            } else {
                // reset the count for break statements when entering the loop
                allBreakStatementDeclarations = 0;
            }
        }

        return {
            ForStatement: inspectLoopStatement,
            WhileStatement: inspectLoopStatement,
            DoWhileStatement: inspectLoopStatement,
            BreakStatement: inspectBreakStatement,
        };

    }

};
