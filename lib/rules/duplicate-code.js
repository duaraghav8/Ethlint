/**
 * @fileoverview Ensure that duplicates are not in code.
 * @author Devgoks <olabamsg@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that code duplicates does not exist"
        },

        schema: []
    },

    create(context) {
        let sourceCode = context.getSourceCode();

        function inspectProgram(emitted) {
            if (emitted.exit) {
                return;
            }

            let lines = sourceCode.text.split(/\r?\n/).map(function(item) {return item.trim();});
            let sorted_arr = lines.slice().sort(); 
            let duplicates = [];
            for (let i = 0; i < sorted_arr.length - 1; i++) {
                if (sorted_arr[i + 1] == sorted_arr[i]) {
                    duplicates.push(sorted_arr[i]);
                }
            }
            function checkNodes(nodes) {
                if (!Array.isArray(nodes)) {
                    nodes = [nodes];
                }
                nodes.forEach(node => {
                    if(duplicates.includes(sourceCode.getText(node))){
                        context.report({
                            node,
                            message: "This code contain duplicates"
                        });
                    }
                    checkNodes(node.body || []);
                });
            }

            checkNodes(emitted.node.body);
        }

        return {
            Program: inspectProgram
        };

    }
};

