/**
 * @fileoverview Use emit statement to trigger a solidity event
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


/**
 * While entering nodes, register all events and all call expressions that are not part of emit statement
 * While exiting, determine which of the registered call expressions is an event trigger and flag them
 * NOTE: This rule currently doesn't flag issues where event declaration & non-"emit"ted event trigger reside in
 * different contracts which are linked through inheritance.
 *
 * TODO: Enhance this rule to also detect event declarations inherited from other contracts
 * and whether they're being triggered using "emit".
 */
function create(context) {
    const events = [], callExpressions = [], sourceCode = context.getSourceCode();

    // Determines whether the given call name refers to an event declaration using scope resolution.
    function isEvent(expr, eventDeclarations) {
        for (let { node, enclosingContract } of eventDeclarations) {
            if (expr.callee.name === node.name && sourceCode.isAChildOf(expr, enclosingContract)) {
                return true;
            }
        }
        return false;
    }


    // Stores each declared event in the file and its corresponding parent contract
    function registerEventName(emitted) {
        const { node } = emitted;
        (!emitted.exit) && events.push({ node, enclosingContract: sourceCode.getParent(node) });
    }

    function registerNonEmittedCallExpression(emitted) {
        const { node } = emitted;

        if (!emitted.exit && sourceCode.getParent(node).type !== "EmitStatement") {
            callExpressions.push(node);
        }
    }

    function reportBadEventTriggers(emitted) {
        if (!emitted.exit) {
            return;
        }

        callExpressions.forEach(node => {
            isEvent(node, events) && context.report({
                node,
                fix(fixer) {
                    return fixer.insertTextBefore(node, "emit ");
                },
                message: "Use emit statements for triggering events."
            });
        });
    }


    return {
        EventDeclaration: registerEventName,
        CallExpression: registerNonEmittedCallExpression,
        Program: reportBadEventTriggers
    };
}


module.exports = {

    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Use emit statement to trigger a solidity event"
        },
        schema: [],
        fixable: "code"
    },

    create

};