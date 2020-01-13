/**
 * @fileoverview Ensure that no empty blocks exist
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "warning",
            description: "Ensure that no empty blocks exist"
        },

        schema: []

    },

    create(context) {

        function report(node, loc) {
            context.report({
                node, message: "Code contains empty block", location: loc });
        }

        function isFunc(node) {
            return node.type === "FunctionDeclaration";
        }

        function isConstructor(node) {
            return node.type === "ConstructorDeclaration";
        }

        function isFallbackFunc(node) {
            return isFunc(node) && node.name === null;
        }

        function isPayable(funcNode) {
            for (let m of (funcNode.modifiers || [])) {
                if (m.name === "payable") { return true; }
            }
            return false;
        }

        function hasNonTrivialModifiers(node) {
            if (!node.modifiers) return false;

            const re = /^(external|public|internal|private|pure|view|payable)$/;
            return node.modifiers.filter(m => !re.test(m.name)).length !== 0;
        }

        function inspectCLI(emitted) {
            let node = emitted.node,
                sourceCode = context.getSourceCode(), text = sourceCode.getText(node);

            if (emitted.exit) {
                return;
            }

            if (!node.body.length) {
                report(node, { column: text.indexOf("{") });
            }
        }

        function inspectBlockStatement(emitted) {
            const { node } = emitted, { body } = node,
                parent = context.getSourceCode().getParent(node);

            // Historical note: No need to check (as suggested in #264) that a modifier is calling a base constructor,
            // because ANY modifier in constructor should make its body not required.
            if (emitted.exit || isConstructor(parent) || isFunc(parent)) {
                // Use inspectFunctionDeclaration or inspectConstructorDeclaration logic instead,
                // not to report the error twice.
                return;
            }

            if (Array.isArray(body) && body.length === 0) {
                report(node);
            }
        }

        function inspectFunctionDeclaration(emitted) {
            const { node } = emitted;

            if (emitted.exit) {
                return;
            }

            // If node.modifiers is null, it means no modifiers exist for this
            // function and it should therefore be reported.
            if (node.body.body.length === 0 && !hasNonTrivialModifiers(node) && !isFallbackFunc(node) && !isPayable(node)) {
                report(node.body);
            }
        }

        function inspectConstructorDeclaration(emitted) {
            const { node } = emitted;

            if (emitted.exit) {
                return;
            }

            // If node.modifiers is null, it means no modifiers exist for this
            // constructor and it should therefore be reported.
            if (node.body.body.length === 0 && !hasNonTrivialModifiers(node) && !isPayable(node)) {
                report(node.body);
            }
        }


        const similarNodeTypes = ["ContractStatement", "LibraryStatement", "InterfaceStatement"];

        const response = {
            BlockStatement: inspectBlockStatement,
            ConstructorDeclaration: inspectConstructorDeclaration,
            FunctionDeclaration: inspectFunctionDeclaration
        };

        similarNodeTypes.forEach(function(nodeName) {
            response[nodeName] = inspectCLI;
        });

        return response;

    }

};
