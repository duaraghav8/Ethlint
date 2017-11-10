/**
 * @fileoverview Ensure no use of continue statements in the code
 * @author Simon Hajjar <simon.j.hajjar@gmail.com>
 */

module.exports = {

	meta: {

		docs: {
			recommended: true,
			type: 'warning',
			description: 'Ensure no use of continue statements in the code'
		},

		schema: [],
    fixable: 'code'

	},

	create: function (context) {

		function inspectContinueStatement (emitted) {
			if (emitted.exit) { return; }

			context.report ({
				node: emitted.node,
				message: 'Use of \'continue\' statement.'
			});
		}

		return {
			ContinueStatement: inspectContinueStatement
		};

	}

};
