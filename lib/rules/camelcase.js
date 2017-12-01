/**
 * @fileoverview Ensure that contract, library, modifier and struct names follow CamelCase notation
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that contract, library, modifier and struct names follow CamelCase notation"
        },

        schema: []

    },

    create: function(context) {

        let camelCaseRegEx = /^([A-Z][A-Za-z0-9]+)+$/;
        let nodesToWatch = {
            "ContractStatement": "Contract",
            "LibraryStatement": "Library",
            "StructDeclaration": "Struct",
            "EventDeclaration": "Event"
        };

        function createInspector(nodeDesc) {
            return (function inspect(emitted) {
                let node = emitted.node;

                if (emitted.exit) {
                    return;
                }

                if (!camelCaseRegEx.test(node.name)) {
                    context.report({
                        node: node,
                        message: nodeDesc + " name '" + node.name + "' doesn't follow the CamelCase notation."
                    });
                }
            });
        }

        return Object.keys(nodesToWatch).reduce(function(listeners, nodeName) {

            listeners [nodeName] = createInspector(nodesToWatch [nodeName]);
            return listeners;

        }, {});

    }

};
