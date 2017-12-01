"use strict";

module.exports = {

    "CUSTOM_RULE": function(context) {
        context.on("IfStatement", function(emitted) {
            if (emitted.exit) {
                return;
            }

            context.report({
                node: emitted.node,
                message: "*******************THIS IS MY CUSTOM RULE**********************"
            });
        });
    },

    //this rule overlaps a built-in rule
    "lbrace": function(context) {
        context.on("IfStatement", function(emitted) {
            if (emitted.exit) {
                return;
            }

            context.report({
                node: emitted.node,
                message: "*******************THIS IS MY CUSTOM RULE**********************"
            });
        });
    },

    //this rule is defined in this file, but shouldn't be included in rules because config.rules doesn't enable it
    "not-included": function(context) {
        context.on("IfStatement", function(emitted) {
            if (emitted.exit) {
                return;
            }

            context.report({
                node: emitted.node,
                message: "*******************THIS IS MY CUSTOM RULE**********************"
            });
        });
    }

};