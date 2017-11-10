'use strict';

/**
 * @fileoverview Disallow suicide and selfdestruct
 * @author Beau Gunderson <beau@beaugunderson.com>
 * @author Federico Bond <federicobond@gmail.com>
 */

function isSuicideOrSelfDestruct(node) {
  return node.type === 'Identifier' &&
    (node.name === 'suicide' || node.name === 'selfdestruct');
}

module.exports = {
  meta: {
    docs: {
      recommended: true,
      type: 'warning',
      description: 'Disallow \'suicide\' and \'selfdestruct\''
    },

    schema: []
  },

  create: function (context) {
    function inspectCallExpression(emittedObject) {
      if (!emittedObject.exit) {
        return;
      }

      var callee = emittedObject.node.callee;

      if (isSuicideOrSelfDestruct(callee)) {
        context.report({
          node: emittedObject.node,

          message: "'suicide' and 'selfdestruct' are disallowed"
        });
      }
    }

    return {
      CallExpression: inspectCallExpression
    };
  }
};
