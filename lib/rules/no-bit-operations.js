/**
 * @fileoverview Disallow bit operations
 * @author Beau Gunderson <beau@beaugunderson.com>
 */

'use strict';

const DISALLOWED_OPERATORS = [
  '>>',
  '<<',
  '~',
  '^',
  '&',
  '|',
];

const DISALLOWED_ASSIGNMENTS = [
  '>>=',
  '<<=',
  '^=',
  '&=',
  '|='
];

module.exports = {
  meta: {
    docs: {
      recommended: false,
      type: 'error',
      description: 'Disallow bitwise operators'
    },

    schema: []
  },

  create: function (context) {
    function inspectAssignmentExpression (emitted) {
      if (emitted.exit) {
        return;
      }
      var node = emitted.node;

      if (DISALLOWED_ASSIGNMENTS.indexOf(node.operator.trim()) !== -1) {
        context.report({
          node: node,
          message: node.operator + ' is a bit operation and these are disallowed'
        });
      }
    }

    function inspectBinaryExpression (emitted) {
      var node = emitted.node;

      if (emitted.exit) {
        return;
      }

      if (DISALLOWED_OPERATORS.indexOf(node.operator.trim()) !== -1) {
        context.report({
          node: node,
          message: node.operator + ' is a bit operation and these are disallowed'
        });
      }
    }

    return {
      AssignmentExpression: inspectAssignmentExpression,
      BinaryExpression: inspectBinaryExpression
    };
  }
};
