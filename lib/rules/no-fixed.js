/**
 * @fileoverview Disallow fixed point types
 * @author Beau Gunderson <beau@beaugunderson.com>
 */

'use strict';

module.exports = {
  meta: {
    docs: {
      recommended: false,
      type: 'error',
      description: 'Disallow fixed point types'
    },

    schema: []
  },

  create: function (context) {
    function inspectDeclarationExpression (emitted) {
      if (emitted.exit) {
        return;
      }

      var node = emitted.node;

      if (node.literal.literal.indexOf('fixed') === 0 ||
         node.literal.literal.indexOf('ufixed') === 0) {
        context.report({
          node: node,
          message: node.literal.literal + ' is a fixed type and these are disallowed'
        });
      }
    }

    return {
      DeclarativeExpression: inspectDeclarationExpression
    };
  }
};
